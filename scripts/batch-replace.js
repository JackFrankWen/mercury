// 批量替换 数据中 的 字段

const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');
const dayjs = require('dayjs');
const { getCsvData } = require('./utils/csv-helper');

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

async function splitData(data) {
  const transferData = await getTransferData();
  const newTransferData = transferData.map((item) => {
    // 将description 拆成  payee 和 description 分隔，利用正则 将description 拆成  payee 和 description 分隔
    const result = splitString(item.description);
    if (result.length === 2 && result[0] && result[1] && !item.payee) {
      if (Number(item.payment_type) === 1) {
        return {
          ...item,
          payee: result[0].replace('/', ''),
          description: result[1],
        };
      } else {
        return {
          ...item,
          payee: result[1].replace('/', ''),
          description: result[0],
        };
      }
    }
    if (item.payee) {
      return item;
    }
    return item;
  });
  try {
    newTransferData.forEach(async (item) => {
      db.run(
        `UPDATE transactions SET payee = ?, description = ? WHERE id = ?`,
        [item.payee, item.description, item.id],
      );
    });
    console.log('批量更新完成');
  } catch (error) {
    console.error(error);
  }
}

// 获取 csv 里面
async function updateTask(fileName) {
  try {
    const transferData = await getTransferData();
    const toUpdateData = [];
    const csvData = await getCsvData(fileName);
    // 改成包含
    const data = transferData.filter(
      (item) =>
        item.description.includes('订单编号') ||
        item.description.includes('商户单号'),
    );
    // console.log(data, 'data');
    data.forEach(async (item) => {
      const matchingItem = csvData.find((csvItem) => {
        // 时间误差在3分钟
        const isSameTime =
          dayjs(item.trans_time).diff(dayjs(csvItem.trans_time), 'minute') < 2;
        const isSameAmount =
          Math.round(Number(item.amount)) ===
          Math.round(Number(csvItem.amount));

        return isSameTime && isSameAmount;
      });
      if (matchingItem) {
        toUpdateData.push({
          id: item.id,
          payee: matchingItem.payee,
          description: matchingItem.description,
          trans_time: item.trans_time,
        });
      }
    });
    // 更新数据库
    toUpdateData.forEach(async (item) => {
      db.run(
        `UPDATE transactions SET payee = ?, description = ? WHERE id = ?`,
        [item.payee, item.description, item.id],
      );
    });
    console.log('批量更新完成', fileName);
  } catch (error) {
    console.error(error);
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
