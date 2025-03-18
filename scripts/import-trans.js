/* eslint-disable */
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const { db, createTransactionTable, checkTableExists } = require("./utils/import-table");
/* eslint-enable */

// Import CSV data
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
        console.log(`Read ${results.length} records`);

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
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

        results.forEach((row) => {
          try {
            stmt.run([
              row.amount,
              row.category === "" ? "[100000,100003]" : row.category,
              row.description,
              row.account_type,
              row.payment_type,
              row.consumer,
              row.flow_type,
              row.tag,
              row.abc_type || "",
              row.cost_type || "",
              row.trans_time,
            ]);
            successCount++;
          } catch (err) {
            console.error("Error inserting row:", err);
            errorCount++;
          }
        });

        stmt.finalize();
        console.log(`Import completed. Success: ${successCount}, Errors: ${errorCount}`);
        resolve();
      });
  });
}

// Execute
async function main() {
  try {
    const dataDir = path.join(__dirname, "../exports/20250312-1523/transactions.csv");
    if (!fs.existsSync(dataDir)) {
      throw new Error(`文件不存在: ${dataDir}`);
    }

    const tableExists = await checkTableExists("transactions");
    if (!tableExists) {
      await createTransactionTable();
    }

    await importCSV(dataDir);

    console.log("Import process completed successfully");
  } catch (err) {
    console.error("Error during import process:", err);
    process.exit(1);
  } finally {
    console.log("close db");
    db.close();
  }
}

main();
