import { log } from "node:console";
import { getDbInstance } from "./connect";
import { Params_Transaction } from "src/preload/type";
import { generateWhereClause } from "./common";
export interface I_Transaction {
  id: number;
  amount: number;
  category: string;
  description: string;
  payee: string; // trading partner
  account_type: string;
  payment_type: string;
  consumer: string;
  flow_type: string;
  tag: string;
  abc_type: string;
  cost_type: string;
  trans_time: Date;
  creation_time: Date;
  modification_time: Date;
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
      tag, abc_type, cost_type, trans_time, 
      creation_time, modification_time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
                transaction.abc_type,
                transaction.cost_type,
                transaction.trans_time,
                transaction.creation_time,
                transaction.modification_time,
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

    console.log("sql===", sql);
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
      )}, modification_time = CURRENT_TIMESTAMP WHERE id IN (${placeholders})`;

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
      payment_type, consumer, flow_type, tag, abc_type, 
      cost_type, trans_time, creation_time, modification_time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

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
            transaction.abc_type,
            transaction.cost_type,
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
// 帮我写个方法，计算'2001-11-1'到'2002-12-1' 之间的月份差
export function getMonthsDiff(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return (
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth()) +
    1
  );
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
    console.error("Error getting category total by date:", error);
    throw error;
  }
}

// 新增单条交易记录
export async function insertTransaction(
  transaction: Partial<I_Transaction>,
): Promise<void> {
  try {
    const db = await getDbInstance();
    const sql = `INSERT INTO transactions (
      amount, category, description, payee, account_type, 
      payment_type, consumer, flow_type, tag, abc_type, 
      cost_type, trans_time, creation_time, modification_time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

    await new Promise<void>((resolve, reject) => {
      db.run(
        sql,
        [
          transaction.amount,
          transaction.category || "[100000,100003]",
          transaction.description,
          transaction.payee,
          transaction.account_type,
          transaction.payment_type,
          transaction.consumer,
          transaction.flow_type,
          transaction.tag,
          transaction.abc_type,
          transaction.cost_type,
          transaction.trans_time || new Date().toISOString(),
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        },
      );
    });
  } catch (error) {
    console.error("Error inserting transaction:", error);
    throw error;
  }
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
): Promise<{ code: number; message: string }> {
  try {
    const db = await getDbInstance();

    const { whereClause } = generateWhereClause(params);

    await new Promise<void>((resolve, reject) => {
      db.run(`DELETE FROM transactions ${whereClause}`, (err) => {
        if (err) {
          console.error("Error deleting all transactions:", err);
          reject(err);
          return;
        }
        resolve();
      });
    });

    return { code: 200, message: "所有交易数据已成功删除" };
  } catch (error) {
    console.error("Error deleting all transactions:", error);
    return {
      code: 500,
      message:
        error instanceof Error ? error.message : "删除交易数据时发生未知错误",
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
