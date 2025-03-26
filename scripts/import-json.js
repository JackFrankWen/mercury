/* eslint-disable */
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const { db, createTransactionTable, checkTableExists } = require("./utils/import-table");
/* eslint-enable */

// 配置 dayjs
dayjs.extend(utc);
dayjs.extend(timezone);
// 设置默认时区为亚洲/上海
dayjs.tz.setDefault("Asia/Shanghai");

// Import JSON data
function importJSON(filepath) {
  return new Promise((resolve, reject) => {
    try {
      const jsonData = JSON.parse(fs.readFileSync(filepath, "utf8"));
      let successCount = 0;
      let errorCount = 0;

      console.log(`Read ${jsonData.length} records`);

      db.exec("BEGIN TRANSACTION");

      const stmt = db.prepare(`
                INSERT INTO "transactions" (
                    amount,
                    category,
                    description,
                    account_type,
                    payment_type, 
                    consumer,
                    flow_type,
                    tag,
                    abc_type,
                    cost_type,
                    trans_time
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime(?))
            `);

      jsonData.forEach((row) => {
        try {
          // 使用 dayjs 处理时间戳并解决时区问题
          let timestamp;
          
          if (row.trans_time && row.trans_time.$date && row.trans_time.$date.$numberLong) {
            // MongoDB 时间戳处理 (毫秒)
            const milliseconds = parseInt(row.trans_time.$date.$numberLong);
            // 使用 dayjs 并确保时区正确
            timestamp = dayjs(milliseconds).tz().format('YYYY-MM-DD HH:mm:ss');
          } else if (row.trans_time && typeof row.trans_time === 'string') {
            // 处理字符串格式时间
            timestamp = dayjs(row.trans_time).tz().format('YYYY-MM-DD HH:mm:ss');
          } else {
            // 默认使用当前时间
            timestamp = dayjs().tz().format('YYYY-MM-DD HH:mm:ss');
          }

          // Improved amount handling
          let amount = 0;
          if (typeof row.amount === "number") {
            amount = row.amount;
          } else if (typeof row.amount === "string") {
            amount = parseFloat(row.amount) || 0;
          } else if (row.amount && row.amount.$numberDecimal) {
            amount = parseFloat(row.amount.$numberDecimal) || 0;
          }

          stmt.run([
            amount,
            row.category || "[100000,100003]",
            row.description || "",
            row.account_type || "",
            row.payment_type || "",
            row.consumer || null,
            row.flow_type || "",
            row.tag || "",
            row.abc_type || null,
            parseInt(row.cost_type) || 1,
            timestamp,
          ]);
          successCount++;
        } catch (err) {
          console.error("Error inserting row:", err, row);
          errorCount++;
        }
      });

      // 提交事务
      db.exec("COMMIT");

      stmt.finalize();
      console.log(`Import completed. Success: ${successCount}, Errors: ${errorCount}`);
      resolve({ successCount, errorCount });
    } catch (err) {
      // 如果发生错误，回滚事务
      db.exec("ROLLBACK");
      console.error("Import failed:", err);
      reject(err);
    }
  });
}

// Execute
async function main() {
  try {
    const dataDir = path.join(__dirname, "../data/202501/transaction.json");
    if (!fs.existsSync(dataDir)) {
      throw new Error(`文件不存在: ${dataDir}`);
    }

    const tableExists = await checkTableExists("transactions");
    if (!tableExists) {
      await createTransactionTable();
    }

    await importJSON(dataDir);

    console.log("Import process completed successfully");
  } catch (err) {
    console.error("Error during import process:", err);
    process.exit(1);
  } finally {
    console.log("close db");
    db.close();
  }
}
// 导入以前的数据使用
main();
