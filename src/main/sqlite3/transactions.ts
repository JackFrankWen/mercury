import { log } from "node:console";
import { getDbInstance } from "./connect";
import { Params_Transaction } from "src/preload/type";
import { generateWhereClause } from "./common";
export interface I_Transaction {
  id: number;
  amount: number;// 金额
  category: string;// 分类
  description: string;// 描述
  payee: string; // 交易对方
  account_type: string; // 账户类型
  payment_type: string; // 支付方式
  consumer: string; // 消费者
  flow_type: string; // 流水类型
  account_name: string; // 支付账户
  tag: string; // 标签
  trans_time: Date; // 交易时间
  creation_time: Date; // 创建时间
  modification_time: Date; // 修改时间
}
// 批量替换数据
export async function batchReplaceTransactions(
  list: I_Transaction[],
): Promise<void> {
  if (!list.length) return;

  const db = await getDbInstance();

  try {
    // 开启事务以提高批量操作性能
    await new Promise<void>((resolve, reject) => {
      db.run("BEGIN TRANSACTION", (err) => (err ? reject(err) : resolve()));
    });

    const sql = `REPLACE INTO transactions (
      id, amount, category, description, payee, 
      account_type, payment_type, consumer, flow_type, 
      tag, trans_time, account_name,
      creation_time, modification_time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '+8 hours'))`;

    // 使用 Promise.all 并行处理插入操作
    await Promise.all(
      list.map(
        (transaction) =>
          new Promise<void>((resolve, reject) => {
            db.run(
              sql,
              [
                transaction.id,
                transaction.amount,
                transaction.category,
                transaction.description,
                transaction.payee,
                transaction.account_type,
                transaction.payment_type,
                transaction.consumer,
                transaction.flow_type,
                transaction.tag,
                transaction.trans_time,
                transaction.account_name || '',
                transaction.creation_time,
              ],
              (err) => (err ? reject(err) : resolve()),
            );
          }),
      ),
    );

    // 提交事务
    await new Promise<void>((resolve, reject) => {
      db.run("COMMIT", (err) => (err ? reject(err) : resolve()));
    });
  } catch (error) {
    // 发生错误时回滚事务
    await new Promise<void>((resolve) => {
      db.run("ROLLBACK", () => resolve());
    });
    console.error("Error in batch replacing transactions:", error);
    throw error; // 向上传递错误，让调用者知道操作失败
  }
}
// 获取所有交易 根据preload.ts 的getTransactions
export const getAllTransactions = async (
  params: Params_Transaction,
): Promise<I_Transaction[]> => {
  try {
    const db = await getDbInstance();
    const { whereClause } = generateWhereClause(params);

    let sql = `
      SELECT * 
      FROM transactions 
      ${whereClause}
      ORDER BY trans_time DESC
    `;

    if (params.page !== undefined && params.page_size !== undefined) {
      const offset = (params.page - 1) * params.page_size;
      sql += ` LIMIT ${params.page_size} OFFSET ${offset}`;
    }

    const rows = await new Promise<I_Transaction[]>((resolve, reject) => {
      db.all(sql, (err, rows: I_Transaction[]) => {
        if (err) {
          console.error("Database query error:", err);
          reject(err);
          return;
        }
        resolve(rows || []);
      });
    });
    return rows;
  } catch (error) {
    console.error("Error getting transactions:", error);
    throw error;
  }
};

// 删除交易
export async function deleteTransactions(ids: number[]): Promise<void> {
  try {
    const db = await getDbInstance();

    // Create a string of placeholders for the SQL query
    const placeholders = ids.map(() => "?").join(",");
    const sql = `DELETE FROM transactions WHERE id IN (${placeholders})`;

    // Execute the SQL query to delete the transactions
    await new Promise<void>((resolve, reject) => {
      db.run(sql, ids, (err) => {
        if (err) {
          console.error("Error deleting transactions:", err);
          reject(err);
          return;
        }
        resolve();
      });
    });
  } catch (error) {
    console.error("Error deleting transactions:", error);
    throw error;
  }
}
type Params_Update = Params_Transaction & {
  modification_time?: string;
};
// 批量修改
export async function updateTransactions(
  ids: number[],
  params: Params_Update,
): Promise<void> {
  try {
    const db = await getDbInstance();

    // Create a string of placeholders for the SQL query
    const placeholders = ids.map(() => "?").join(",");
    // Add modification_time to track when the record was last updated
    const sql = `UPDATE transactions SET ${Object.keys(params)
      .map((key) => `${key} = ?`)
      .join(
        ",",
      )}, modification_time = datetime('now', '+8 hours') WHERE id IN (${placeholders})`;

    // Execute the SQL query to update the transactions
    await new Promise<void>((resolve, reject) => {
      db.run(sql, [...Object.values(params), ...ids], (err) => {
        if (err) {
          console.error("Error updating transactions:", err);
          reject(err);
          return;
        }
        resolve();
      });
    });
  } catch (error) {
    console.error("Error updating transactions:", error);
    throw error;
  }
}
// 批量插入
export async function batchInsertTransactions(
  list: I_Transaction[],
): Promise<void> {
  try {
    const db = await getDbInstance();
    const sql = `INSERT INTO transactions (
      amount, category, description, payee, account_type, 
      payment_type, consumer, flow_type, tag, 
      account_name,
      trans_time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    for (const transaction of list) {
      await new Promise<void>((resolve, reject) => {
        db.run(
          sql,
          [
            transaction.amount,
            transaction.category,
            transaction.description,
            transaction.payee,
            transaction.account_type,
            transaction.payment_type,
            transaction.consumer,
            transaction.flow_type,
            transaction.tag,
            transaction.account_name || '',
            transaction.trans_time,

          ],
          (err) => {
            if (err) reject(err);
            else resolve();
          },
        );
      });
    }
  } catch (error) {
    console.error("Error inserting transactions:", error);
    throw error;
  }
}
// 计算两个日期之间的月份差
export function getMonthsDiff(startDate: string, endDate: string): number {
  try {
    // 处理输入参数
    if (!startDate || !endDate) {
      console.warn('getMonthsDiff: Invalid date inputs', { startDate, endDate });
      return 0;
    }

    // 解析日期，确保使用 UTC 避免时区问题
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 检查日期有效性
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.warn('getMonthsDiff: Invalid date format', { startDate, endDate });
      return 0;
    }

    // 确保结束日期不早于开始日期
    if (end < start) {
      console.warn('getMonthsDiff: End date is earlier than start date', { startDate, endDate });
      return 0;
    }

    // 计算年差和月差
    const yearDiff = end.getFullYear() - start.getFullYear();
    const monthDiff = end.getMonth() - start.getMonth();

    // 计算总月差
    let totalMonths = yearDiff * 12 + monthDiff;

    // 处理月内天数的边界情况
    // 如果结束日期的天数小于开始日期的天数，且不是月末，则不计入完整一个月
    if (end.getDate() < start.getDate()) {
      // 检查是否是月末（例如，2月28日到3月30日应该算作整月）
      const endMonth = new Date(end.getFullYear(), end.getMonth() + 1, 0);
      if (end.getDate() < endMonth.getDate()) {
        totalMonths -= 1;
      }
    }

    // 加1是为了包含起始月，例如1月到2月应该算2个月
    return totalMonths + 1;
  } catch (error) {
    console.error('Error in getMonthsDiff:', error);
    return 0; // 发生错误时返回默认值
  }
}

// 更精确的月份差计算方法（可选，适用于需要按天比例计算的场景）
export function getPreciseMonthsDiff(startDate: string, endDate: string): number {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 检查日期有效性
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 0;
    }

    // 基础月差计算
    const yearDiff = end.getFullYear() - start.getFullYear();
    const monthDiff = end.getMonth() - start.getMonth();
    let totalMonths = yearDiff * 12 + monthDiff;

    // 计算天数比例
    const startDaysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
    const endDaysInMonth = new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate();

    // 计算开始日期在月中的天数比例
    const startDayRatio = (startDaysInMonth - start.getDate() + 1) / startDaysInMonth;

    // 计算结束日期在月中的天数比例
    const endDayRatio = end.getDate() / endDaysInMonth;

    // 综合计算，加上按天比例的部分
    return totalMonths + endDayRatio + startDayRatio;
  } catch (error) {
    console.error('Error in getPreciseMonthsDiff:', error);
    return 0;
  }
}

// 获取category 的 group by
export async function getCategoryTotal(
  params: Params_Transaction,
): Promise<
  { category: string; total: number; avg: number; percent: number }[]
> {
  try {
    const db = await getDbInstance();
    if (!params.trans_time) {
      return [];
    }

    const monthsDiff = getMonthsDiff(
      params.trans_time[0],
      params.trans_time[1],
    );
    const { whereClause } = generateWhereClause(params);

    const sql = `
      WITH total_sum AS (
        SELECT SUM(amount) as grand_total
        FROM transactions
        ${whereClause}
      )
      SELECT 
        category, 
        SUM(amount) as total,
        SUM(amount)/${monthsDiff} as avg,
        (SUM(amount) * 100.0 / (SELECT grand_total FROM total_sum)) as percent
      FROM transactions 
      ${whereClause}
      GROUP BY category
      ORDER BY total DESC
    `;

    const rows = await new Promise<
      { category: string; total: number; avg: number; percent: number }[]
    >((resolve, reject) => {
      db.all(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    return rows;
  } catch (error) {
    console.log()
    console.error("Error getting category total by date:", error);
    throw error;
  }
}

// 新增单条交易记录
export async function insertTransaction(
  transaction: Partial<I_Transaction>,
): Promise<{ id: number; success: boolean; message: string }> {
  try {
    const db = await getDbInstance();

    // 修复SQL语句：添加missing字段(creation_time, modification_time)并调整字段数量
    const sql = `INSERT INTO transactions (
      amount, category, description, payee, account_type, 
      payment_type, consumer, flow_type, tag, account_name,
      trans_time, creation_time, modification_time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '+8 hours'), datetime('now', '+8 hours'))`;

    // 数据验证
    if (transaction.amount === undefined || transaction.amount === null) {
      return { id: 0, success: false, message: '金额不能为空' };
    }

    // 获取插入的ID和执行结果
    const result = await new Promise<{ lastID: number; changes: number }>((resolve, reject) => {
      db.run(
        sql,
        [
          transaction.amount,
          transaction.category || '[100000,100003]',
          transaction.description || '',
          transaction.payee || '',
          transaction.account_type || '',
          transaction.payment_type || '',
          transaction.consumer || '',
          transaction.flow_type || '',
          transaction.tag || '',
          transaction.account_name || '',
          transaction.trans_time || datetime('now', '+8 hours'), // 使用上海时区
        ],
        function (err) {
          if (err) {
            console.error('Error inserting transaction:', err);
            reject(err);
            return;
          }
          // this.lastID 包含新插入记录的ID
          // this.changes 包含受影响的行数
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      );
    });

    console.log(`Transaction inserted successfully with ID: ${result.lastID}`);
    return {
      id: result.lastID,
      success: true,
      message: `交易记录已成功添加，ID: ${result.lastID}`
    };
  } catch (error) {
    console.error('Error inserting transaction:', error);
    return {
      id: 0,
      success: false,
      message: error instanceof Error ? error.message : '添加交易记录时发生未知错误'
    };
  }
}

// 帮助函数：获取上海时区的日期时间
function datetime(modifier: string, timezone: string): string {
  const date = new Date();
  if (timezone === '+8 hours') {
    // 调整为中国上海时区 (UTC+8)
    date.setHours(date.getHours() + 8);
  }
  return date.toISOString().replace('T', ' ').split('.')[0];
}

// 查询transaction 的所有数据，并且返回 [{date: '2022-02', total: 111}]
export async function getTransactionsByMonth(
  params: Params_Transaction,
): Promise<{ date: string; total: number }[]> {
  try {
    const db = await getDbInstance();

    if (!params.trans_time || params.trans_time.length !== 2) {
      return [];
    }

    const [startDate, endDate] = params.trans_time;
    const { whereClause } = generateWhereClause(params);

    const sql = `
      WITH RECURSIVE
      date_range(date) AS (
        SELECT date(?, 'start of month')
        UNION ALL
        SELECT date(date, '+1 month')
        FROM date_range
        WHERE strftime('%Y-%m', date) < strftime('%Y-%m', date(?))
      ),
      monthly_totals AS (
        SELECT 
          strftime('%Y-%m', trans_time) as month,
          SUM(amount) as total
        FROM transactions
        ${whereClause}
        GROUP BY strftime('%Y-%m', trans_time)
      )
      SELECT 
        strftime('%Y-%m', date_range.date) as date,
        COALESCE(monthly_totals.total, 0) as total
      FROM date_range
      LEFT JOIN monthly_totals ON strftime('%Y-%m', date_range.date) = monthly_totals.month
      ORDER BY date ASC
    `;

    const rows = await new Promise<{ date: string; total: number }[]>(
      (resolve, reject) => {
        db.all(sql, [startDate, endDate], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      },
    );

    return rows;
  } catch (error) {
    console.error("Error getting transactions by month:", error);
    throw error;
  }
}

// 按消费者分组统计
export async function getConsumerTotal(
  params: Params_Transaction,
): Promise<{ item: string; total: number }[]> {
  try {
    const db = await getDbInstance();

    const { whereClause } = generateWhereClause(params);

    const sql = `
      SELECT 
        consumer as item, 
        SUM(amount) as total
      FROM transactions 
      ${whereClause}
      GROUP BY consumer
      ORDER BY total DESC
    `;

    const rows = await new Promise<{ item: string; total: number }[]>(
      (resolve, reject) => {
        db.all(sql, (err, rows) => {
          if (err) {
            console.error("Error getting consumer totals:", err);
            reject(err);
            return;
          }
          resolve(rows || []);
        });
      },
    );

    return rows;
  } catch (error) {
    console.error("Error getting consumer totals:", error);
    throw error;
  }
}

// 按账户类型和支付方式分组统计
export async function getAccountPaymentTotal(
  params: Params_Transaction,
): Promise<{ account_type: string; payment_type: string; total: number }[]> {
  try {
    const db = await getDbInstance();

    const { whereClause } = generateWhereClause(params);

    const sql = `
      SELECT 
        account_type,
        payment_type,
        SUM(amount) as total
      FROM transactions 
      ${whereClause}
      GROUP BY account_type, payment_type
      ORDER BY total DESC
    `;
    console.log(sql, 'sql=getAccountPaymentTotal===');
    const rows = await new Promise<
      { account_type: string; payment_type: string; total: number }[]
    >((resolve, reject) => {
      db.all(sql, (err, rows) => {
        if (err) {
          console.error("Error getting account and payment totals:", err);
          reject(err);
          return;
        }
        resolve(rows || []);
      });
    });

    return rows;
  } catch (error) {
    console.error("Error getting account and payment totals:", error);
    throw error;
  }
}

// 删除所有交易数据
export async function deleteAllTransactions(
  params: Params_Transaction,
): Promise<{ code: number; message: string; deletedCount: number }> {
  try {
    const db = await getDbInstance();

    const { whereClause } = generateWhereClause(params);
    console.log(whereClause, 'whereClause');

    // 使用db.run的回调函数中的this.changes来获取删除的行数
    const deletedCount = await new Promise<number>((resolve, reject) => {
      db.run(`DELETE FROM transactions ${whereClause}`, function (err) {
        if (err) {
          console.error('Error deleting all transactions:', err);
          reject(err);
          return;
        }
        // this.changes包含受影响的行数
        resolve(this.changes);
      });
    });

    return {
      code: 200,
      message: `成功删除 ${deletedCount} 条交易数据`,
      deletedCount
    };
  } catch (error) {
    console.error('Error deleting all transactions:', error);
    return {
      code: 500,
      message: error instanceof Error ? error.message : '删除交易数据时发生未知错误',
      deletedCount: 0
    };
  }
}

// 获取所有交易记录

// 根据trans_time获取每天的amount,group by 天
export async function getDailyTransactionAmounts(
  params: Params_Transaction,
): Promise<{ date: string; total: number }[]> {
  try {
    const db = await getDbInstance();

    if (!params.trans_time) {
      return [];
    }

    const { whereClause } = generateWhereClause(params);

    const sql = `
      SELECT 
        strftime('%Y-%m-%d', trans_time) as date,
        SUM(amount) as total
      FROM transactions
      ${whereClause}
      GROUP BY strftime('%Y-%m-%d', trans_time)
      ORDER BY date ASC
    `;

    console.log("getDailyTransactionAmounts sql:", sql);

    const rows = await new Promise<{ date: string; total: number }[]>(
      (resolve, reject) => {
        db.all(sql, (err, rows) => {
          if (err) {
            console.error("Error getting daily transaction amounts:", err);
            reject(err);
            return;
          }
          resolve(rows || []);
        });
      },
    );

    return rows;
  } catch (error) {
    console.error("Error getting daily transaction amounts:", error);
    throw error;
  }
}
