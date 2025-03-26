// 批量替换 数据中 的 字段

const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');
const dayjs = require('dayjs');
const { getCsvData } = require('./utils/csv-helper');
const { log } = require('console');
const chalk = require('chalk');

const db = new sqlite3.Database(path.join(__dirname, '../data/database.db'));

function getTransferData() {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM transactions where flow_type = 1 and trans_time > "2020-12-01" and trans_time < "2025-03-09" ',
      (err, rows) => {
        resolve(rows);
      },
    );
  });
}
function splitString(str) {
  // 定义符号优先级顺序：分号 > 逗号 > 空格
  const splitters = [';', ',', ' '];

  for (const splitter of splitters) {
    const index = str.indexOf(splitter);

    // 找到符合条件的符号
    if (index !== -1) {
      // 如果符号在字符串末尾则不分割
      if (index === str.length - 1 || index === 0 || index === str.length - 2) {
        return [str];
      }

      return [str.slice(0, index), str.slice(index + 1)];
    }
  }

  // 没有符号的情况
  return [str];
}

async function splitData() {
  console.log('开始处理数据拆分...');
  try {
    const transferData = await getTransferData();
    console.log(`获取到 ${transferData.length} 条转账记录`);
    
    // 过滤需要处理的数据
    const dataToProcess = transferData.filter(item => !item.payee);
    console.log(`需要处理 ${dataToProcess.length} 条记录`);
    
    // 使用事务进行批量更新
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      
      let processedCount = 0;
      let updatedCount = 0;
      
      dataToProcess.forEach((item) => {
        processedCount++;
        
      
        
        const result = splitString(item.description);
        if (result.length === 2 && result[0] && result[1]) {
          const isPaymentType1 = Number(item.payment_type) === 1;
          const payee = isPaymentType1 ? result[0].replace('/', '') : result[1].replace('/', '');
          const description = isPaymentType1 ? result[1] : result[0];
          
          db.run(
            `UPDATE transactions SET payee = ?, description = ? WHERE id = ?`,
            [payee, description, item.id],
            (err) => {
              if (err) {
                console.error(`更新记录失败 ID: ${item.id}`, err);
              } else {
                updatedCount++;
              }
            }
          );
        }
      });
      
      // 提交事务
      db.run('COMMIT', (err) => {
        if (err) {
          console.error('提交事务失败:', err);
          db.run('ROLLBACK');
        } else {
          console.log('数据拆分处理完成:');
          console.log(`- 总记录数: ${transferData.length}`);
          console.log(`- 需要处理: ${dataToProcess.length}`);
          console.log(`- 成功更新: ${updatedCount}`);
        }
      });
    });
  } catch (error) {
    console.error('数据拆分处理失败:', error);
    throw error;
  }
}

// 获取 csv 里面
async function updateTask(fileName) {
  console.log(`开始处理文件: ${fileName}`);
  try {
    const transferData = await getTransferData();
    const csvData = await getCsvData(fileName);
    
    // 过滤需要更新的数据
    const data = transferData.filter(
      (item) =>
        item.description.includes('订单编号') ||
        item.description.includes('商户单号'),
    );
    
    console.log(chalk.green(`找到 ${data.length} 条需要更新的记录`));
    console.log(chalk.blue(`CSV 文件中有 ${csvData.length} 条记录`));
    
    // 使用事务进行批量更新
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      
      let updatedCount = 0;
      let matchedCount = 0;
      let matchingItem;
      
      // 为调试添加一些记录
      let notMatchedReasons = {
        timeDiffTooLarge: 0,
        amountDiffTooLarge: 0,
        noMatch: 0
      };
      
      data.forEach((item) => {
        // 格式化日期以便于比较和调试
        const itemTime = dayjs(item.trans_time).format('YYYY-MM-DD HH:mm:ss');
        const itemAmount = Number(item.amount);
        
        let bestMatch = null;
        let smallestTimeDiff = Infinity;
        let smallestAmountDiff = Infinity;
        
        csvData.forEach(csvItem => {
          const csvTime = dayjs(csvItem.trans_time).format('YYYY-MM-DD HH:mm:ss');
          const csvAmount = Number(csvItem.amount);
          
          // 计算绝对差值
          const timeDiff = Math.abs(dayjs(itemTime).diff(dayjs(csvTime), 'minute'));
          const amountDiff = Math.abs(itemAmount - csvAmount);
          
          // 记录最小差异，用于调试
          if (timeDiff < smallestTimeDiff) smallestTimeDiff = timeDiff;
          if (amountDiff < smallestAmountDiff) smallestAmountDiff = amountDiff;
          
          // 时间误差在2分钟内，金额误差在1元内
          if (timeDiff <= 2 && amountDiff <= 1) {
            // 找到最佳匹配（时间差最小）
            if (!bestMatch || timeDiff < Math.abs(dayjs(itemTime).diff(dayjs(bestMatch.trans_time), 'minute'))) {
              bestMatch = csvItem;
            }
          }
        });
        
        matchingItem = bestMatch;
        
        if (matchingItem) {
          matchedCount++;
          // console.log(chalk.green(`匹配成功: ${itemTime} (${itemAmount}) -> ${dayjs(matchingItem.trans_time).format('YYYY-MM-DD HH:mm:ss')} (${Number(matchingItem.amount)})`));
          
          db.run(
            `UPDATE transactions SET payee = ?, description = ? WHERE id = ?`,
            [matchingItem.payee, matchingItem.description, item.id],
            (err) => {
              if (err) {
                console.error(`更新记录失败 ID: ${item.id}`, err);
              } else {
                updatedCount++;
              }
            }
          );
        } else {
          // 记录未匹配原因
          if (smallestTimeDiff > 2) {
            notMatchedReasons.timeDiffTooLarge++;
          } else if (smallestAmountDiff > 1) {
            notMatchedReasons.amountDiffTooLarge++;
          } else {
            notMatchedReasons.noMatch++;
          }
          
          // console.log(chalk.yellow(`未找到匹配: ${itemTime} (${itemAmount}), 最小时间差: ${smallestTimeDiff}分钟, 最小金额差: ${smallestAmountDiff}元`));
        }
      });
      
      // 提交事务
      db.run('COMMIT', (err) => {
        if (err) {
          console.error('提交事务失败:', err);
          db.run('ROLLBACK');
        } else {
          console.log(`文件 ${fileName} 处理完成:`);
          console.log(`- 总记录数: ${data.length}`);
          console.log(`- 匹配记录: ${matchedCount}`);
          console.log(chalk.green(`- 更新成功: ${updatedCount}`));
          console.log('未匹配原因统计:');
          console.log(`- 时间差过大: ${notMatchedReasons.timeDiffTooLarge}`);
          console.log(`- 金额差过大: ${notMatchedReasons.amountDiffTooLarge}`);
          console.log(`- 其他原因: ${notMatchedReasons.noMatch}`);
        }
      });
    });
  } catch (error) {
    console.error(`处理文件 ${fileName} 时发生错误:`, error);
    throw error;
  }
}
async function main() {
  await updateTask("jd-orders-niu");
  await updateTask("pdd-orders-niu");
  await updateTask("jd-orders-wen");
  await updateTask("pdd-orders-wen");
  await splitData();
}
main();
