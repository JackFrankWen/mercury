import { getAllTransactions } from "../sqlite3/transactions";
import { Params_Transaction } from "../../preload";
import { I_Transaction } from "../sqlite3/transactions";

// 获取数组中 同时满足 a.payee === b.payee 和 a.description === b.description c.category === b.category 的记录 只返回其中一条
export const getPayeeAndDescription = (list: I_Transaction[]) => {
  return list.filter((a) => {
    return list.some((b) => {
      return a.payee === b.payee && a.description === b.description && a.category === b.category;
    });
  });
};

// 去重复 去掉数组中重复的记录 payee 和 description 和 category 都相等
export const removeDuplicate = (list: I_Transaction[]) => {
  return list.filter(
    (a, index, self) =>
      index ===
      self.findIndex(
        (t) => t.payee === a.payee && t.description === a.description && t.category === a.category
      )
  );
};

// 生成规则
export const generateRule = async (
  pp: Pick<Params_Transaction, "trans_time">
): Promise<I_Transaction[]> => {
  try {
    const transactions = await getAllTransactions(pp);
    const changeTransactions = transactions.filter((item) => {
      return item.creation_time !== item.modification_time;
    });
    // changeTransactions中找到 payee 和 description 同时相等并且出现两次以上的交易 返回一个数组
    const result = getPayeeAndDescription(changeTransactions);
    const uniqueResult = removeDuplicate(result);
    return uniqueResult;
  } catch (error) {
    console.error("Error generating rule:", error);
    throw error;
  }
};
