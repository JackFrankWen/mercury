import { getDbInstance } from './connect';
import { RuleItemList } from '../../renderer/page/setting/advancedRuleFormItem';
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
export async function getAllAdvancedRules(params?: { nameOrRule?: string; active?: number }): Promise<AdvancedRule[]> {
  try {
    const db = await getDbInstance();
    
    return new Promise<AdvancedRule[]>((resolve, reject) => {
      const whereConditions = [];
      if (params?.nameOrRule) {
        whereConditions.push(`(rule LIKE '%${params.nameOrRule}%' OR name LIKE '%${params.nameOrRule}%')`);
      }
      if (params?.active !== undefined) {
        whereConditions.push(`active = ${params.active}`);
      }
      
      const where = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
      const sql = `SELECT * FROM advanced_rules ${where} ORDER BY category ASC`;
      
      db.all(sql, (err, rows: AdvancedRule[]) => {
        if (err) {
          console.error('Error getting advanced rules:', err);
          reject(err);
          return;
        }
        resolve(rows || []);
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
      
      db.run(sql, 
        [rule.name, rule.rule, rule.category, rule.consumer, rule.tag, rule.priority],
        function(err) {
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
export async function updateAdvancedRule(id: number, rule: AdvancedRule): Promise<{ code: number }> {
  try {
    const db = await getDbInstance();
    
    return new Promise<{ code: number }>((resolve, reject) => {
      const sql = `
        UPDATE advanced_rules
        SET name = ?, rule = ?, category = ?, consumer = ?, tag = ?, priority = ?, active = ?, modification_time = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      db.run(sql, 
        [rule.name, rule.rule, rule.category, rule.consumer, rule.tag, rule.priority, rule.active, id],
        function(err) {
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
      db.run('DELETE FROM advanced_rules WHERE id = ?', [id], function(err) {
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
