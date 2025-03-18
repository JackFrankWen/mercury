import { getDbInstance } from "./connect";
import { MatchRule } from "./match-rules";

interface MatchAutoRule extends MatchRule {
  payee: string;
  description: string;
}

export const batchInsertAutoRule = async (
  list: MatchAutoRule[]
): Promise<{ code: number; message?: string }> => {
  // Input validation
  if (!Array.isArray(list) || list.length === 0) {
    return { code: 400, message: "Invalid input: empty or invalid array" };
  }

  const db = await getDbInstance();

  try {
    // Begin transaction
    await db.run("BEGIN TRANSACTION");

    const stmt = await db.prepare(
      `INSERT INTO match_rules_auto (category, payee, description, consumer, tag, abc_type, cost_type) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`
    );

    // Process each item
    for (const item of list) {
      await stmt.run([
        item.category,
        item.payee,
        item.description,
        item.consumer,
        item.tag,
        item.abc_type,
        item.cost_type,
      ]);
    }

    await stmt.finalize();
    await db.run("COMMIT");

    return { code: 200, message: "Rules inserted successfully" };
  } catch (error) {
    // Rollback on error
    await db.run("ROLLBACK");
    console.error("Error inserting auto rules:", error);
    return {
      code: 500,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// Get all match auto   rules
export const getAllMatchAutoRules = async (): Promise<MatchAutoRule[]> => {
  try {
    const db = await getDbInstance();
    const rows = await new Promise<MatchAutoRule[]>((resolve, reject) => {
      db.all("SELECT * FROM match_rules_auto", (err, rows: MatchAutoRule[]) => {
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

// Delete match auto rule
export const deleteMatchAutoRule = async (id: number) => {
  try {
    const db = await getDbInstance();
    await db.run("DELETE FROM match_rules_auto WHERE id = ?", [id]);
  } catch (error) {
    console.error("Error deleting auto rule:", error);
    throw error;
  }
};
