const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

/**
 * 从CSV文件读取数据并格式化
 * @param {string} fileName - CSV文件名，不含扩展名
 * @returns {Promise<Array>} - 格式化后的数据数组
 */
function getCsvData(fileName) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '../../data/description', `${fileName}.csv`);
    
    if (!fs.existsSync(filePath)) {
      return reject(new Error(`文件 ${filePath} 不存在`));
    }
    
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        try {
          // 根据文件名前缀处理不同类型的数据
          const formattedData = formatCsvData(results, fileName);
          resolve(formattedData);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/**
 * 格式化CSV数据
 * @param {Array} data - 原始CSV数据
 * @param {string} fileName - 文件名，用于确定数据类型
 * @returns {Array} - 格式化后的数据
 */
function formatCsvData(data, fileName) {
  // 判断数据类型
  const isJd = fileName.includes('jd');
  const isPdd = fileName.includes('pdd');
  
  if (!isJd && !isPdd) {
    throw new Error('不支持的文件类型，仅支持京东(jd)或拼多多(pdd)订单');
  }
  
  // 根据数据类型筛选和格式化数据
  let filtered = data;
  if (isJd) {
    filtered = data.filter(item => item['订单状态'] === '已完成' || item['订单状态'] === '等待收货');
  } else if (isPdd) {
    filtered = data.filter(item => item['订单状态'] === '交易成功');
  }
  
  // 两个文件一样的字段
  return filtered.map(item => {
    return {
      id: item['订单号'],
      payee: isJd ? '京东': '拼多多',
      amount:  item['订单总价'].replace(/[^0-9.]/g, ''),
      description: item['商品名称'],
      trans_time: item['下单时间']
    };
  });
}

module.exports = {
  getCsvData
}; 