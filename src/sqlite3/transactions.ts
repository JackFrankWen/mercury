import { log } from "node:console"
import { getDbInstance } from "./connect"
import { Params_Transaction } from "src/global"
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
    createdAt: Date
    updatedAt: Date
  }
// 获取所有交易 根据preload.ts 的getTransactions
export const getAllTransactions = async (params: Params_Transaction): Promise<I_Transaction[]> => {
  try {
    const db = await getDbInstance()
    const conditions: string[] = []

    // 添加调试日志查看输入参数
    console.log('Search params:', params)

    if (params.is_unclassified) {
      conditions.push('(category IS NULL OR category = "" OR category = "[100000,100003]")')
    }

    if (params.description) {
      conditions.push(`description LIKE '%${params.description}%'`)
    }

    if (params.consumer) {
      conditions.push(`consumer LIKE '%${params.consumer}%'`)
    }

    if (params.min_money !== undefined || params.max_money !== undefined) {
      if (params.min_money !== undefined && params.max_money !== undefined) {
        conditions.push(`amount BETWEEN ${params.min_money} AND ${params.max_money}`)
      } else if (params.min_money !== undefined) {
        conditions.push(`amount >= ${params.min_money}`)
      } else if (params.max_money !== undefined) {
        conditions.push(`amount <= ${params.max_money}`)
      }
    }

    if (params.trans_time && params.trans_time[0] && params.trans_time[1]) {
      conditions.push(`trans_time BETWEEN '${params.trans_time[0]}' AND '${params.trans_time[1]}'`)
    }

    if (params.createdAt && params.createdAt[0] && params.createdAt[1]) {
      conditions.push(`creation_time BETWEEN '${params.createdAt[0]}' AND '${params.createdAt[1]}'`)
    }

    if (params.updatedAt && params.updatedAt[0] && params.updatedAt[1]) {
      conditions.push(`modification_time BETWEEN '${params.updatedAt[0]}' AND '${params.updatedAt[1]}'`)
    }

    if (params.account_type) {
      conditions.push(`account_type = '${params.account_type}'`)
    }

    if (params.payment_type) {
      conditions.push(`payment_type = '${params.payment_type}'`)
    }

    if (params.tag) {
      conditions.push(`tag = '${params.tag}'`)
    }

    if (params.abc_type) {
      conditions.push(`abc_type = '${params.abc_type}'`)
    }

    if (params.cost_type) {
      conditions.push(`cost_type = '${params.cost_type}'`)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    let sql = `
      SELECT * 
      FROM transactions 
      ${whereClause}
      ORDER BY trans_time DESC
    `;

    // Add pagination
    if (params.page !== undefined && params.page_size !== undefined) {
      const offset = (params.page - 1) * params.page_size
      sql += ` LIMIT ${params.page_size} OFFSET ${offset}`
    }

    console.log('==========Final SQL Query:', sql)
    
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

// 获取category 的 group by 
export async function getCategoryTotal(params: Params_Transaction): Promise<{category: string, total: number, avg: number}[]> {
  try {
    const db = await getDbInstance()
    if(!params.trans_time) {
      return []
    }
    // Calculate months difference between start and end date
    const startDate = new Date(params.trans_time[0])
    const endDate = new Date(params.trans_time[1])
    const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                      (endDate.getMonth() - startDate.getMonth()) + 1;
    
    const conditions: string[] = [];
    
    
    if (params.trans_time && params.trans_time[0] && params.trans_time[1]) {
      conditions.push(`trans_time BETWEEN '${params.trans_time[0]}' AND '${params.trans_time[1]}'`);
    }

    if (params.account_type) {
      conditions.push(`account_type = '${params.account_type}'`);
    }

    if (params.payment_type) {
      conditions.push(`payment_type = '${params.payment_type}'`);
    }

    if (params.consumer) {
      conditions.push(`consumer LIKE '%${params.consumer}%'`);
    }

    if (params.tag) {
      conditions.push(`tag = '${params.tag}'`);
    }

    if (params.abc_type) {
      conditions.push(`abc_type = '${params.abc_type}'`);
    }

    if (params.cost_type) {
      conditions.push(`cost_type = '${params.cost_type}'`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    const sql = `
      SELECT 
        category, 
        SUM(amount) as total,
        SUM(amount)/${monthsDiff} as avg 
      FROM transactions 
      ${whereClause}
      GROUP BY category
    `;
    console.log(sql,'===aa')

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