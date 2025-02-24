// 写个方法，导出transactions表中的数据 ，利用nodejieba分词，分词description，然后导出分词后的数据
const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');
const jieba = require('nodejieba');
// 配置词性白名单
const allowedPOS = new Set(['n', 'vn', 'v', 'nz', 'eng']);

// 主处理函数
function extractKeywords(text) {
  // 1. 词性标注
  const taggedWords = jieba.tag(text);

  // 2. 过滤停用词和无效词性
  const keywords = taggedWords
    .filter(({ word, tag }) => 
      allowedPOS.has(tag) && 
      word.length > 1
    )
    .map(({ word }) => word);

  return keywords;
}

function exportTrans() {
    const db = new sqlite3.Database(path.join(__dirname, '../../../data/database.db'));
    db.all('SELECT * FROM transactions', (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }
        const descriptions = rows.map(row => extractKeywords(row.description));
        // descriptions 去掉各种符号
        
        
        const jsonData = JSON.stringify(descriptions);
        fs.writeFileSync(path.join(__dirname, '../../../data/transactions.txt'), jsonData);
    });
}

exportTrans();