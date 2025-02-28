import { log } from "node:console"
import { getDbInstance } from "./connect"
import { Params_Transaction } from "src/global"
import { generateWhereClause } from "./common"
export interface I_Transaction {
    id: number
    amount: number
    category: string
    description: string
    payee: string // trading partner
    account_type: string
    payment_type: string
    consumer: string
    flow_type: string
    tag: string
    abc_type: string
    cost_type: string
    trans_time: Date
    creation_time: Date
    modification_time: Date
  }
// 获取所有交易 根据preload.ts 的getTransactions
export const getAllTransactions = async (params: Params_Transaction): Promise<I_Transaction[]> => {
  try {
    const db = await getDbInstance()
    const { whereClause } = generateWhereClause(params)
    
    let sql = `
      SELECT * 
      FROM transactions 
      ${whereClause}
      ORDER BY trans_time DESC
    `

    if (params.page !== undefined && params.page_size !== undefined) {
      const offset = (params.page - 1) * params.page_size
      sql += ` LIMIT ${params.page_size} OFFSET ${offset}`
    }
    
    const rows = await new Promise<I_Transaction[]>((resolve, reject) => {
      db.all(sql, (err, rows: I_Transaction[]) => {
        if (err) {
          console.error('Database query error:', err)
          reject(err)
          return
        }
        resolve(rows || [])
      })
    })
    return rows
  } catch (error) {
    console.error('Error getting transactions:', error)
    throw error
  }
}

// 删除交易
export async function deleteTransactions(ids: number[]): Promise<void> {
  try {
    const db = await getDbInstance()

    // Create a string of placeholders for the SQL query
    const placeholders = ids.map(() => '?').join(',');
    const sql = `DELETE FROM transactions WHERE id IN (${placeholders})`;

    // Execute the SQL query to delete the transactions
    await new Promise<void>((resolve, reject) => {
      db.run(sql, ids, (err) => {
        if (err) {
          console.error('Error deleting transactions:', err);
          reject(err);
          return;
        }
        resolve();
      });
    });
  } catch (error) {
    console.error('Error deleting transactions:', error);
    throw error;
  }
}
type Params_Update = Params_Transaction & {
  modification_time?: string
}
// 批量修改
export async function updateTransactions(ids: number[], params: Params_Update): Promise<void> {
  try {
    const db = await getDbInstance()

    // Create a string of placeholders for the SQL query
    const placeholders = ids.map(() => '?').join(',');
    // Add modification_time to track when the record was last updated
    const sql = `UPDATE transactions SET ${Object.keys(params).map(key => `${key} = ?`).join(',')}, modification_time = CURRENT_TIMESTAMP WHERE id IN (${placeholders})`;

    // Execute the SQL query to update the transactions
    await new Promise<void>((resolve, reject) => {
      db.run(sql, [...Object.values(params), ...ids], (err) => {
        if (err) {
          console.error('Error updating transactions:', err);
          reject(err);
          return;
        }
        resolve();
      });
    });
  } catch (error) {
    console.error('Error updating transactions:', error);
    throw error;
  }
}
// 批量插入
export async function batchInsertTransactions(list: I_Transaction[]): Promise<void> {
  try {
    const db = await getDbInstance();
    const sql = `INSERT INTO transactions (
      amount, category, description, payee, account_type, 
      payment_type, consumer, flow_type, tag, abc_type, 
      cost_type, trans_time, creation_time, modification_time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

    for (const transaction of list) {
      await new Promise<void>((resolve, reject) => {
        db.run(sql, [
          transaction.amount,
          transaction.category,
          transaction.description,
          transaction.payee,
          transaction.account_type,
          transaction.payment_type,
          transaction.consumer,
          transaction.flow_type,
          transaction.tag,
          transaction.abc_type,
          transaction.cost_type,
          transaction.trans_time
        ], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  } catch (error) {
    console.error('Error inserting transactions:', error);
    throw error;
  }
}
// 帮我写个方法，计算'2001-11-1'到'2002-12-1' 之间的月份差
export function getMonthsDiff(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1
}

// 获取category 的 group by 
export async function getCategoryTotal(params: Params_Transaction): Promise<{category: string, total: number, avg: number}[]> {
  try {
    const db = await getDbInstance()
    if(!params.trans_time) {
      return []
    }
    
    const monthsDiff = getMonthsDiff(params.trans_time[0], params.trans_time[1])
    const { whereClause } = generateWhereClause(params)
    
    const sql = `
      SELECT 
        category, 
        SUM(amount) as total,
        SUM(amount)/${monthsDiff} as avg 
      FROM transactions 
      ${whereClause}
      GROUP BY category
    `;

    const rows = await new Promise<{category: string, total: number, avg: number}[]>((resolve, reject) => {
      db.all(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      })
    })
    return rows
  } catch (error) {
    console.error('Error getting category total by date:', error);
    throw error;
  }
}

// 新增单条交易记录
export async function insertTransaction(transaction: Partial<I_Transaction>): Promise<void> {
  try {
    const db = await getDbInstance();
    const sql = `INSERT INTO transactions (
      amount, category, description, payee, account_type, 
      payment_type, consumer, flow_type, tag, abc_type, 
      cost_type, trans_time, creation_time, modification_time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

    await new Promise<void>((resolve, reject) => {
      db.run(sql, [
        transaction.amount,
        transaction.category || '[100000,100003]',
        transaction.description,
        transaction.payee,
        transaction.account_type,
        transaction.payment_type,
        transaction.consumer,
        transaction.flow_type,
        transaction.tag,
        transaction.abc_type,
        transaction.cost_type,
        transaction.trans_time || new Date().toISOString()
      ], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  } catch (error) {
    console.error('Error inserting transaction:', error);
    throw error;
  }
}

// 查询transaction 的所有数据，并且返回 [{date: '2022-02', total: 111}]
export async function getTransactionsByMonth(params: Params_Transaction): Promise<{date: string, total: number}[]> {
  try {
    const db = await getDbInstance();
    console.log(params,'====aaaa');
   
    const { whereClause } = generateWhereClause(params)
    const sql = `
      SELECT 
        strftime('%Y-%m', trans_time) as date,
        SUM(amount) as total
      FROM transactions
      ${whereClause} 
      GROUP BY strftime('%Y-%m', trans_time)
      ORDER BY date ASC
    `;

    const rows = await new Promise<{date: string, total: number}[]>((resolve, reject) => {
      db.all(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    return rows;
  } catch (error) {
    console.error('Error getting transactions by month:', error);
    throw error;
  }
}


// 按消费者分组统计
export async function getConsumerTotal(params: Params_Transaction): Promise<{item: string, total: number}[]> {
  try {
    const db = await getDbInstance()
    
    const { whereClause } = generateWhereClause(params)
    
    const sql = `
      SELECT 
        consumer as item, 
        SUM(amount) as total
      FROM transactions 
      ${whereClause}
      GROUP BY consumer
      ORDER BY total DESC
    `

    const rows = await new Promise<{item: string, total: number}[]>((resolve, reject) => {
      db.all(sql, (err, rows) => {
        if (err) {
          console.error('Error getting consumer totals:', err)
          reject(err)
          return
        }
        resolve(rows || [])
      })
    })
    
    return rows
  } catch (error) {
    console.error('Error getting consumer totals:', error)
    throw error
  }
}

// 按账户类型和支付方式分组统计
export async function getAccountPaymentTotal(params: Params_Transaction): Promise<{account_type: string, payment_type: string, total: number}[]> {
  try {
    const db = await getDbInstance()
    
    const { whereClause } = generateWhereClause(params)
    
    const sql = `
      SELECT 
        account_type,
        payment_type,
        SUM(amount) as total
      FROM transactions 
      ${whereClause}
      GROUP BY account_type, payment_type
      ORDER BY total DESC
    `

    const rows = await new Promise<{account_type: string, payment_type: string, total: number}[]>((resolve, reject) => {
      db.all(sql, (err, rows) => {
        if (err) {
          console.error('Error getting account and payment totals:', err)
          reject(err)
          return
        }
        resolve(rows || [])
      })
    })
    
    return rows
  } catch (error) {
    console.error('Error getting account and payment totals:', error)
    throw error
  }
}

// 获取所有交易记录
