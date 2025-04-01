const sqlite3 = require('sqlite3');
const path = require('path');
const chalk = require('chalk');

// 系统表白名单
const SYSTEM_TABLES = ['sqlite_sequence', 'sqlite_master'];

// 连接数据库
const db = new sqlite3.Database(path.join(__dirname, '../data/database.db'));

// 获取所有用户表
function getAllTables() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT name 
      FROM sqlite_master 
      WHERE type='table' 
      AND name NOT IN (${SYSTEM_TABLES.map(t => `'${t}'`).join(',')})
    `;

    db.all(sql, (err, tables) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(tables.map(t => t.name));
    });
  });
}

// 删除表
function dropTable(tableName) {
  return new Promise((resolve, reject) => {
    if (SYSTEM_TABLES.includes(tableName)) {
      resolve(); // 跳过系统表
      return;
    }

    db.run(`DROP TABLE IF EXISTS "${tableName}"`, err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

// 倒计时函数
function countdown(seconds) {
  return new Promise(resolve => {
    let remaining = seconds;
    const timer = setInterval(() => {
      process.stdout.write(`\r⏱️  ${remaining} 秒后开始删除...按 Ctrl+C 取消`);
      remaining--;
      if (remaining < 0) {
        clearInterval(timer);
        process.stdout.write('\n');
        resolve();
      }
    }, 1000);
  });
}

// 主函数
async function main() {
  try {
    // 获取所有表名
    const tables = await getAllTables();

    if (tables.length === 0) {
      console.log(chalk.yellow('没有找到可删除的表格'));
      return;
    }

    console.log(chalk.blue(`\n发现 ${tables.length} 个可删除的表格：`));
    console.log(chalk.gray(tables.join(', ')));

    // 倒计时
    await countdown(1);

    console.log(chalk.yellow('\n开始删除表格...'));

    // 开始事务
    await new Promise((resolve, reject) => {
      db.run('BEGIN TRANSACTION', err => (err ? reject(err) : resolve()));
    });

    // 删除进度统计
    let successCount = 0;
    let failCount = 0;

    // 删除每个表
    for (const table of tables) {
      try {
        await dropTable(table);
        console.log(chalk.green(`✓ 成功删除表格: ${table}`));
        successCount++;
      } catch (error) {
        console.error(chalk.red(`✗ 删除表格失败: ${table}`), error.message);
        failCount++;

        // 如果有错误，回滚事务
        await new Promise(resolve => {
          db.run('ROLLBACK', () => resolve());
        });
        throw error;
      }
    }

    // 提交事务
    await new Promise((resolve, reject) => {
      db.run('COMMIT', err => (err ? reject(err) : resolve()));
    });

    // 输出统计信息
    console.log(chalk.green('\n✅ 删除操作完成！'));
    console.log(chalk.blue(`总计：${tables.length} 个表格`));
    console.log(chalk.green(`成功：${successCount} 个表格`));
    if (failCount > 0) {
      console.log(chalk.red(`失败：${failCount} 个表格`));
    }
  } catch (error) {
    console.error(chalk.red('\n❌ 删除过程中发生错误:'), error.message);
    process.exit(1);
  } finally {
    // 关闭数据库连接
    db.close(err => {
      if (err) {
        console.error(chalk.red('关闭数据库连接时发生错误:'), err.message);
      }
      console.log(chalk.gray('\n数据库连接已关闭'));
    });
  }
}

// 开始执行
main().catch(error => {
  console.error(chalk.red('执行过程中发生错误:'), error.message);
  process.exit(1);
});
