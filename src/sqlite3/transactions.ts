import { Transaction } from "electron"
import { getDbInstance } from "./connect"

export interface I_Transaction {
    amount: number
    category: string
    description: string
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
export const getAllTransactions = async (params: {
    description?: string,
    account_type?: string,
    payment_type?: string, 
    consumer?: string,
    tag?: string,
    abc_type?: string,
    cost_type?: string,
    trans_time?: [string, string],
    createdAt?: [string, string],
    min_money?: number,
    max_money?: number,
    is_unclassified?: boolean,
}): Promise<I_Transaction[]> => {
  try {
    const db = await getDbInstance()
    let sqlWithValues = 'SELECT * FROM transactions'
    const conditions: string[] = []

    // 添加调试日志查看输入参数
    console.log('Search params:', params)

    if (params.is_unclassified) {
        conditions.push('(category IS NULL OR category = "")')
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
      conditions.push(`createdAt BETWEEN '${params.createdAt[0]}' AND '${params.createdAt[1]}'`)
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

    if (conditions.length > 0) {
      sqlWithValues += ' WHERE ' + conditions.join(' AND ')
    }

    sqlWithValues += ' ORDER BY trans_time DESC'

    console.log('========Final SQL Query:', sqlWithValues)
    
    const rows = await new Promise<I_Transaction[]>((resolve, reject) => {
      db.all(sqlWithValues, (err, rows: I_Transaction[]) => {
        if (err) {
          console.error('Database query error:', err)
          reject(err)
          return
        }
        console.log('Query results count:', rows?.length)
        console.log('First few results:', rows?.slice(0, 3))
        resolve(rows || [])
      })
    })
    return rows
  } catch (error) {
    console.error('Error getting transactions:', error)
    throw error
  }
}   