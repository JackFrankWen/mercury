/* eslint-disable */
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const { db, createRuleTable, checkTableExists } = require("./utils/import-table");
/* eslint-enable */

// 导入CSV数据
function importCSV(filepath) {
  return new Promise((resolve, reject) => {
    const results = [];
    let successCount = 0;
    let errorCount = 0;

    fs.createReadStream(filepath)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", () => {
        console.log(`读取到 ${results.length} 条数据`);

        const stmt = db.prepare(`
                    INSERT INTO match_rules (
                        rule, category, consumer, 
                         tag, creation_time, modification_time
                    ) VALUES ( ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                `);

        results.forEach((row) => {
          try {
            stmt.run([row.rule, row.category, row.consumer, row.tag]);
            successCount++;
          } catch (err) {
            console.error("导入行数据失败:", err);
            errorCount++;
          }
        });

        stmt.finalize();
        console.log(`成功导入 ${successCount} 条数据`);
        if (errorCount > 0) {
          console.log(`失败 ${errorCount} 条数据`);
        }
        resolve({
          total: results.length,
          success: successCount,
          error: errorCount,
        });
      })
      .on("error", reject);
  });
}

// 主函数
async function main() {
  try {
    const dataDir = path.join(__dirname, "../data/202501/match_rules.csv");
    if (!fs.existsSync(dataDir)) {
      throw new Error(`文件不存在: ${dataDir}`);
    }

    const tableExists = await checkTableExists("match_rules");
    if (!tableExists) {
      await createRuleTable();
    }

    await importCSV(dataDir);

    const rows = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM match_rules", (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
    console.log("导入后的数据:", rows);
    console.log("数据导入成功！");
  } catch (error) {
    console.error("导入失败:", error);
  } finally {
    db.close();
  }
}

main();
