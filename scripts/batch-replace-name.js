const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');
const dayjs = require('dayjs');
const chalk = require('chalk');
const { getCsvDataAipay } = require('./utils/csv-helper');

const db = new sqlite3.Database(path.join(__dirname, '../data/database.db'));
function getTransferData() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM transactions where flow_type = 1 and trans_time > "2020-01-01" and trans_time < "2025-01-01" `,
      (err, rows) => {
        resolve(rows);
      }
    );
  });
}
// 获取 csv 里面
async function updateTask(fileName, time) {
  console.log(`开始处理文件: ${fileName}`);
  try {
    const transferData = await getTransferData();
    const csvData = await getCsvDataAipay(fileName);
    console.log(csvData);

    // 过滤需要更新的数据
    const data = transferData.filter(
      item =>
        dayjs(item.trans_time).isAfter(dayjs(`${time}-01-01 00:00:00`)) &&
        dayjs(item.trans_time).isBefore(dayjs(`${time}-12-31 23:59:59`))
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
        noMatch: 0,
      };

      data.forEach(item => {
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
          if (timeDiff <= 1 && amountDiff <= 1) {
            // 找到最佳匹配（时间差最小）
            if (!bestMatch || timeDiff < Math.abs(dayjs(itemTime).diff(dayjs(bestMatch.trans_time), 'minute'))) {
              bestMatch = csvItem;
            }
          }
        });

        matchingItem = bestMatch;

        if (matchingItem) {
          matchedCount++;
          console.log(
            chalk.green(
              `匹配成功: ${itemTime} (${itemAmount}) -> ${dayjs(matchingItem.trans_time).format('YYYY-MM-DD HH:mm:ss')} (${Number(matchingItem.amount)})`
            )
          );

          db.run(`UPDATE transactions SET account_name = ? WHERE id = ?`, [matchingItem.account_name, item.id], err => {
            if (err) {
              console.error(`更新记录失败 ID: ${item.id}`, err);
            } else {
              updatedCount++;
            }
          });
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
      db.run('COMMIT', err => {
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
  await updateTask('2021', '2021');
  await updateTask('2022', '2022');
  await updateTask('2023', '2023');
  await updateTask('2024', '2024');
  await updateTask('2021-n', '2021');
  await updateTask('2022-n', '2022');
  await updateTask('2023-n', '2023');
  await updateTask('2024-n', '2024');
}
main();
