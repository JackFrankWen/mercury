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
    
    // 使用事务进行批量更新
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      
      let updatedCount = 0;
      let matchedCount = 0;
      
      data.forEach((item) => {
        const matchingItem = csvData.find((csvItem) => {
          // 优化时间比较逻辑
          const timeDiff = dayjs(item.trans_time).diff(dayjs(csvItem.trans_time), 'minute');
          const amountDiff = Number(item.amount) - Number(csvItem.amount);
          
          // 时间误差在2分钟内，金额误差在1元内
          return timeDiff <= 2 && amountDiff <= 1;
        });
        
        if (matchingItem) {
          matchedCount++;
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
