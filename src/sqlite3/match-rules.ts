import { getDbInstance } from './connect'
import { getAllTransactions, I_Transaction } from './transactions'
interface MatchRule {
  id?: number
  category: string
  rule: string
  consumer: number
  tag?: string
  abc_type?: number
  cost_type?: number
}

// Get all match rules
export const getAllMatchRules = async (): Promise<MatchRule[]> => {
  try {
    const db = await getDbInstance()
    const rows = await new Promise<MatchRule[]>((resolve, reject) => {
      db.all('SELECT * FROM match_rules', (err, rows: MatchRule[]) => {
        if (err) reject(err)
        resolve(rows)
      })
    })
    console.log('=====rules', rows)
    return rows
  } catch (error) {
    console.error('Error getting match rules:', error)
    throw error
  }
}

// Add new match rule
export const addMatchRule = async (rule: MatchRule): Promise<{ code: number }> => {
  try {
    const db = await getDbInstance()
    await db.run(
      `INSERT INTO match_rules (category, rule, consumer, tag, abc_type, cost_type) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [rule.category, rule.rule, rule.consumer, rule.tag, rule.abc_type, rule.cost_type]
    )
    return { code: 200 }
  } catch (error) {
    console.error('Error adding match rule:', error)
    throw error
  }
}

// Update match rule
export const updateMatchRule = async (id: number, rule: MatchRule): Promise<{ code: number }> => {
  try {
    const db = await getDbInstance()
    await db.run(
      `UPDATE match_rules 
       SET category = ?, rule = ?, consumer = ?, tag = ?, abc_type = ?, cost_type = ?
       WHERE id = ?`,
      [rule.category, rule.rule, rule.consumer, rule.tag, rule.abc_type, rule.cost_type, id]
    )
    return { code: 200 }
  } catch (error) {
    console.error('Error updating match rule:', error)
    throw error
  }
}

// Delete match rule
export const deleteMatchRule = async (id: number): Promise<void> => {
  try {
    const db = await getDbInstance()
    await db.run('DELETE FROM match_rules WHERE id = ?', [id])
  } catch (error) {
    console.error('Error deleting match rule:', error)
    throw error
  }
}
// 获取数组中 同时满足 a.payee === b.payee 和 a.description === b.description c.category === b.category 的记录 只返回其中一条 
export const getPayeeAndDescription = (list: I_Transaction[]) => {
  return list.filter((a) => {
    return list.some((b) => {
      return a.payee === b.payee && a.description === b.description && a.category === b.category
    })
  })
}

// 去重复 去掉数组中重复的记录 payee 和 description 和 category 都相等
export const removeDuplicate = (list: I_Transaction[]) => {
  return list.filter((a, index, self) =>
    index === self.findIndex((t) => t.payee === a.payee && t.description === a.description && t.category === a.category)
  )
}

// 生成规则
export const generateRule = async (pp: Pick<Params_Transaction, 'trans_time'>): Promise<I_Transaction[]> => {
  try {
    const transactions = await getAllTransactions(pp)
    const changeTransactions = transactions.filter((item) => {
      return item.creation_time !== item.modification_time
    })
    // changeTransactions中找到 payee 和 description 同时相等并且出现两次以上的交易 返回一个数组
    const result = getPayeeAndDescription(changeTransactions)
    const uniqueResult = removeDuplicate(result)
    return uniqueResult

  } catch (error) {
    console.error('Error generating rule:', error)
    throw error
  }
}