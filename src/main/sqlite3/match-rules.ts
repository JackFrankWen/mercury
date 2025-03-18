import { getDbInstance } from "./connect";
export interface MatchRule {
  id?: number;
  category: string;
  rule: string;
  consumer: number;
  tag?: string;
  abc_type?: number;
  cost_type?: number;
}

// Get all match rules
export const getAllMatchRules = async (): Promise<MatchRule[]> => {
  try {
    const db = await getDbInstance();
    const rows = await new Promise<MatchRule[]>((resolve, reject) => {
      db.all("SELECT * FROM match_rules", (err, rows: MatchRule[]) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
    console.log("=====rules", rows);
    return rows;
  } catch (error) {
    console.error("Error getting match rules:", error);
    throw error;
  }
};

// Add new match rule
export const addMatchRule = async (rule: MatchRule): Promise<{ code: number }> => {
  try {
    const db = await getDbInstance();
    await db.run(
      `INSERT INTO match_rules (category, rule, consumer, tag, abc_type, cost_type) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [rule.category, rule.rule, rule.consumer, rule.tag, rule.abc_type, rule.cost_type]
    );
    return { code: 200 };
  } catch (error) {
    console.error("Error adding match rule:", error);
    throw error;
  }
};

// Update match rule
export const updateMatchRule = async (id: number, rule: MatchRule): Promise<{ code: number }> => {
  try {
    const db = await getDbInstance();
    await db.run(
      `UPDATE match_rules 
       SET category = ?, rule = ?, consumer = ?, tag = ?, abc_type = ?, cost_type = ?
       WHERE id = ?`,
      [rule.category, rule.rule, rule.consumer, rule.tag, rule.abc_type, rule.cost_type, id]
    );
    return { code: 200 };
  } catch (error) {
    console.error("Error updating match rule:", error);
    throw error;
  }
};

// Delete match rule
export const deleteMatchRule = async (id: number): Promise<void> => {
  try {
    const db = await getDbInstance();
    await db.run("DELETE FROM match_rules WHERE id = ?", [id]);
  } catch (error) {
    console.error("Error deleting match rule:", error);
    throw error;
  }
};
