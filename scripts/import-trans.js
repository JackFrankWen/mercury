/* eslint-disable */
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const chalk = require('chalk');
const { db, createTransactionTable, checkTableExists } = require('./utils/import-table');
/* eslint-enable */

// 彩色日志函数
const log = {
  info: msg => console.log(chalk.blue('ℹ️ 信息: ') + msg),
  success: msg => console.log(chalk.green('✅ 成功: ') + msg),
  warn: msg => console.log(chalk.yellow('⚠️ 警告: ') + msg),
  error: (msg, err) => console.log(chalk.red('❌ 错误: ') + msg + (err ? `\n   ${err}` : '')),
  progress: (current, total) => {
    const percent = Math.round((current / total) * 100);
    const bar = '█'.repeat(Math.floor(percent / 2)) + '░'.repeat(50 - Math.floor(percent / 2));
    process.stdout.write(`\r${chalk.cyan('📊 进度:')} ${bar} ${percent}%`);
    if (current === total) process.stdout.write('\n');
  },
};

// Import CSV data
function importCSV(filepath) {
  return new Promise((resolve, reject) => {
    log.info(`开始从文件导入数据: ${chalk.cyan(filepath)}`);

    const results = [];
    let successCount = 0;
    let errorCount = 0;
    let totalRows = 0;

    fs.createReadStream(filepath)
      .pipe(csv())
      .on('data', data => {
        results.push(data);
        totalRows++;
        if (totalRows % 100 === 0) {
          process.stdout.write(`\r${chalk.cyan('📖 读取数据:')} ${totalRows} 条记录`);
        }
      })
      .on('end', () => {
        process.stdout.write('\n');
        log.success(`共读取 ${chalk.cyan(results.length)} 条记录，准备导入数据库`);

        // 使用事务提高性能
        db.serialize(() => {
          db.run('BEGIN TRANSACTION');

          const stmt = db.prepare(`
            INSERT INTO "transactions" (
              amount,
              category,
              payee,
              description,
              account_type,
              payment_type, 
              consumer,
              flow_type,
              tag,
              upload_file_name,
              trans_time
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);

          results.forEach((row, index) => {
            try {
              stmt.run([
                row.amount,
                row.category === '' ? '[100000,100003]' : row.category,
                row.payee,
                row.description,
                row.account_type,
                row.payment_type,
                row.consumer,
                row.flow_type,
                row.tag,
                row.upload_file_name,
                row.trans_time,
              ]);
              successCount++;

              // 显示进度
              if ((index + 1) % 100 === 0 || index === results.length - 1) {
                log.progress(index + 1, results.length);
              }
            } catch (err) {
              log.error(`导入第 ${index + 1} 行数据失败`, err);
              errorCount++;
            }
          });

          stmt.finalize();

          // 提交事务
          db.run('COMMIT', err => {
            if (err) {
              log.error('提交事务失败，正在回滚', err);
              db.run('ROLLBACK');
              reject(err);
            } else {
              log.success(
                `导入完成: ${chalk.green(successCount)} 条成功, ${chalk.red(errorCount)} 条失败`
              );
              resolve();
            }
          });
        });
      })
      .on('error', err => {
        log.error('读取 CSV 文件失败', err);
        reject(err);
      });
  });
}

// Execute
async function main() {
  log.info(chalk.cyan('===== 开始数据导入流程 ====='));
  try {
    const dataDir = path.join(__dirname, '../exports/stable/transactions.csv');
    if (!fs.existsSync(dataDir)) {
      log.error(`文件不存在: ${chalk.cyan(dataDir)}`);
      throw new Error(`文件不存在: ${dataDir}`);
    }
    log.success(`找到导入文件: ${chalk.cyan(dataDir)}`);

    const tableExists = await checkTableExists('transactions');
    if (!tableExists) {
      log.info('数据表不存在，正在创建...');
      await createTransactionTable();
      log.success('成功创建数据表');
    } else {
      log.info('数据表已存在，准备导入数据');
    }

    await importCSV(dataDir);

    log.success(chalk.cyan('===== 数据导入流程成功完成 ====='));
  } catch (err) {
    log.error('导入过程中发生错误', err);
    process.exit(1);
  } finally {
    log.info('关闭数据库连接');
    db.close();
  }
}

main();
