// 批量替换 数据中 的 字段

const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');
const dayjs = require('dayjs');
const { getCsvData } = require('./utils/csv-helper');
const { log } = require('console');

const db = new sqlite3.Database(path.join(__dirname, '../data/database.db'));

function getTransferData() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM transactions where flow_type = 1 and trans_time > "2020-12-01" and trans_time < "2025-03-09" ', (err, rows) => {
            resolve(rows);
        });
    });
}

function BatchReplace(type) {
   
}


// 获取 csv 里面
async function updateTask(fileName) {
    try {
        const transferData = await getTransferData();
        const toUpdateData = [];
        const csvData = await getCsvData(fileName);
        // 改成包含
        const data = transferData.filter(item => item.description.includes('订单编号') || item.description.includes('商户单号'));
        // console.log(data, 'data');
    data.forEach(async (item) => {
        const matchingItem = csvData.find((csvItem) => {
            // 时间误差在3分钟
            const isSameTime = dayjs(item.trans_time).diff(dayjs(csvItem.trans_time), 'minute') < 2;
            const isSameAmount = Math.round(Number(item.amount)) === Math.round(Number(csvItem.amount))

            return isSameTime && isSameAmount;
          });
          if (matchingItem) {
            toUpdateData.push({
                id: item.id,
                payee: matchingItem.payee,
                description: matchingItem.description,
                trans_time: item.trans_time
            });
          }

    });
    console.log(toUpdateData, 'toUpdateData');
    // 更新数据库
    toUpdateData.forEach(async (item) => {
            db.run(`UPDATE transactions SET payee = ?, description = ? WHERE id = ?`, [item.payee, item.description, item.id]);
    });
    console.log('批量更新完成',fileName);

    } catch (error) {
        console.error(error);
    }
}
async function main() {   
    await updateTask('jd-orders-niu');
    await updateTask('pdd-orders-niu');
    await updateTask('jd-orders-2025-03-03-1617');
    await updateTask('pdd-orders-2025-02-24-1133');
}
main();