/* eslint-disable */
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { db, createTransactionTable, checkTableExists } = require('./import-table');
/* eslint-enable */


// Import JSON data
function importJSON(filepath) {
    return new Promise((resolve, reject) => {
        try {
            const jsonData = JSON.parse(fs.readFileSync(filepath, 'utf8'));
            let successCount = 0;
            let errorCount = 0;

            console.log(`Read ${jsonData.length} records`);
            
            db.exec('BEGIN TRANSACTION');
            
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
                    // Convert MongoDB timestamp to ISO string
                    let timestamp = new Date().toISOString();
                    if (row.trans_time && row.trans_time.$date && row.trans_time.$date.$numberLong) {
                        timestamp = new Date(parseInt(row.trans_time.$date.$numberLong)).toISOString();
                    }

                    // Improved amount handling
                    let amount = 0;
                    if (typeof row.amount === 'number') {
                        amount = row.amount;
                    } else if (typeof row.amount === 'string') {
                        amount = parseFloat(row.amount) || 0;
                    } else if (row.amount && row.amount.$numberDecimal) {
                        amount = parseFloat(row.amount.$numberDecimal) || 0;
                    }

                    stmt.run([
                        amount,
                        row.category || '[100000,100003]',
                        row.description || '',
                        row.account_type || '',
                        row.payment_type || '',
                        row.consumer || null,
                        row.flow_type || '',
                        row.tag || '',
                        row.abc_type || null,
                        parseInt(row.cost_type) || 1,
                        timestamp
                    ]);
                    successCount++;
                } catch (err) {
                    console.error('Error inserting row:', err, row);
                    errorCount++;
                }
            });

            // 提交事务
            db.exec('COMMIT');
            
            stmt.finalize();
            console.log(`Import completed. Success: ${successCount}, Errors: ${errorCount}`);
            resolve({ successCount, errorCount });
        } catch (err) {
            // 如果发生错误，回滚事务
            db.exec('ROLLBACK');
            console.error('Import failed:', err);
            reject(err);
        }
    });
}

// Execute
async function main() {
    try {
        const dataDir = path.join(__dirname, '../data/202501/transaction.json');
        if (!fs.existsSync(dataDir)) {
            throw new Error(`文件不存在: ${dataDir}`);
        }
        
        const tableExists = await checkTableExists('transactions');
        if (!tableExists) {
            await createTransactionTable();
        }
        
        await importJSON(dataDir);

        console.log('Import process completed successfully');
    } catch (err) {
        console.error('Error during import process:', err);
        process.exit(1);
    } finally {
        console.log('close db')
        db.close();
    }
}

main();
