import { getDbInstance } from './connect';
import { RuleItemList } from '../../renderer/page/setting/advancedRuleFormItem';
import { getCategoryTypeByLabel } from 'src/renderer/const/categroy';
export interface AdvancedRule {
  id?: number;
  name: string;
  rule: string;
  category: string;
  consumer: string;
  tag?: string;
  priority: number;
  creation_time?: string;
  modification_time?: string;
  active: number;
}

// 获取所有高级规则
export async function getAllAdvancedRules(params?: {
  nameOrRule?: string;
  active?: number;
}): Promise<AdvancedRule[]> {
  try {
    const db = await getDbInstance();

    // 创建参数数组和 WHERE 子句片段
    const whereConditions = [];
    const queryParams: any[] = [];

    // 处理名称或规则搜索
    if (params?.nameOrRule) {
      // 尝试使用 getCategoryTypeByLabel 查找分类
      const categoryMatch = getCategoryTypeByLabel(params.nameOrRule);

      if (categoryMatch && categoryMatch.length > 0) {
        // 如果找到分类匹配
        if (categoryMatch.length === 1) {
          whereConditions.push(
            `(json_extract(category, '$[0]') = ? OR rule LIKE ? OR name LIKE ?)`
          );
          queryParams.push(categoryMatch[0], `%${params.nameOrRule}%`, `%${params.nameOrRule}%`);
        } else if (categoryMatch.length === 2) {
          whereConditions.push(`(category = ? OR rule LIKE ? OR name LIKE ?)`);
          queryParams.push(
            JSON.stringify(categoryMatch),
            `%${params.nameOrRule}%`,
            `%${params.nameOrRule}%`
          );
        }
      } else {
        // 常规搜索
        whereConditions.push(`(rule LIKE ? OR name LIKE ?)`);
        queryParams.push(`%${params.nameOrRule}%`, `%${params.nameOrRule}%`);
      }
    }

    // 处理活动状态参数
    if (params?.active !== undefined) {
      whereConditions.push(`active = ?`);
      queryParams.push(params.active);
    }

    // 构建 WHERE 子句
    const where = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM advanced_rules ${where} ORDER BY  category ASC , priority DESC`;


    return new Promise<AdvancedRule[]>((resolve, reject) => {
      db.all(sql, queryParams, (err, rows: AdvancedRule[]) => {
        if (err) {
          console.error('Error getting advanced rules:', err);
          reject(err);
          return;
        }

        // 添加简单的结果处理
        const results = rows || [];
        console.log(`Found ${results.length} advanced rules matching criteria`);
        resolve(results);
      });
    });
  } catch (error) {
    console.error('Error in getAllAdvancedRules:', error);
    throw error;
  }
}

// 添加高级规则
export async function addAdvancedRule(rule: AdvancedRule): Promise<{ code: number; id?: number }> {
  try {
    const db = await getDbInstance();

    return new Promise<{ code: number; id?: number }>((resolve, reject) => {
      const sql = `
        INSERT INTO advanced_rules (name, rule, category, consumer, tag, priority)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.run(
        sql,
        [rule.name, rule.rule, rule.category, rule.consumer, rule.tag, rule.priority],
        function (err) {
          if (err) {
            console.error('Error adding advanced rule:', err);
            reject({ code: 500, error: err.message });
            return;
          }
          resolve({ code: 200, id: this.lastID });
        }
      );
    });
  } catch (error) {
    console.error('Error in addAdvancedRule:', error);
    throw error;
  }
}

// 更新高级规则
export async function updateAdvancedRule(
  id: number,
  rule: AdvancedRule
): Promise<{ code: number }> {
  try {
    const db = await getDbInstance();

    return new Promise<{ code: number }>((resolve, reject) => {
      const sql = `
        UPDATE advanced_rules
        SET name = ?, rule = ?, category = ?, consumer = ?, tag = ?, priority = ?, active = ?, modification_time = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      db.run(
        sql,
        [
          rule.name,
          rule.rule,
          rule.category,
          rule.consumer,
          rule.tag,
          rule.priority,
          rule.active,
          id,
        ],
        function (err) {
          if (err) {
            console.error('Error updating advanced rule:', err);
            reject({ code: 500, error: err.message });
            return;
          }

          if (this.changes === 0) {
            resolve({ code: 404 }); // 没有找到记录
          } else {
            resolve({ code: 200 });
          }
        }
      );
    });
  } catch (error) {
    console.error('Error in updateAdvancedRule:', error);
    throw error;
  }
}

// 删除高级规则
export async function deleteAdvancedRule(id: number): Promise<{ code: number }> {
  try {
    const db = await getDbInstance();

    return new Promise<{ code: number }>((resolve, reject) => {
      db.run('DELETE FROM advanced_rules WHERE id = ?', [id], function (err) {
        if (err) {
          console.error('Error deleting advanced rule:', err);
          reject({ code: 500, error: err.message });
          return;
        }

        if (this.changes === 0) {
          resolve({ code: 404 }); // 没有找到记录
        } else {
          resolve({ code: 200 });
        }
      });
    });
  } catch (error) {
    console.error('Error in deleteAdvancedRule:', error);
    throw error;
  }
}

// 批量插入高级规则
export async function batchInsertAdvancedRule(
  rules: AdvancedRule[]
): Promise<{ code: number; message?: string }> {
  try {
    if (!rules || rules.length === 0) {
      return { code: 400, message: '没有可插入的规则' };
    }

    const db = await getDbInstance();

    return new Promise<{ code: number; message?: string }>((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        const stmt = db.prepare(`
          INSERT INTO advanced_rules (name, rule, category, consumer, tag, priority, active)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        let hasError = false;
        for (const rule of rules) {
          stmt.run(
            [
              rule.name,
              rule.rule,
              rule.category,
              rule.consumer,
              rule.tag || null,
              rule.priority,
              rule.active !== undefined ? rule.active : 1,
            ],
            err => {
              if (err) {
                console.error('Error inserting advanced rule:', err);
                hasError = true;
              }
            }
          );
        }

        stmt.finalize();

        if (hasError) {
          db.run('ROLLBACK', () => {
            reject({ code: 500, message: '批量插入高级规则失败' });
          });
        } else {
          db.run('COMMIT', () => {
            resolve({ code: 200, message: `成功插入${rules.length}条高级规则` });
          });
        }
      });
    });
  } catch (error) {
    console.error('Error in batchInsertAdvancedRule:', error);
    return {
      code: 500,
      message: error instanceof Error ? error.message : '批量插入高级规则时发生未知错误',
    };
  }
}
