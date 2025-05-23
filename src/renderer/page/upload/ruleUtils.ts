import { message } from 'antd';
import { getCategoryString } from 'src/renderer/const/categroy';
import { MessageItem, openNotification } from 'src/renderer/components/notification';
import { RuleFormData } from '../../components/advancedRuleModal';
import { AdvancedRule } from 'src/main/sqlite3/advance-rules';
import { RuleItem, RuleItemList, RuleItemListList } from '../setting/advancedRuleFormItem';
import { I_Transaction } from 'src/main/sqlite3/transactions';
import { getConsumerType, getTagType } from 'src/renderer/const/web';
/**
 * Apply AI-based classification rules to transaction data
 */
export const ruleByAi = async (arr: any, api: any) => {
  try {
    const autoData = await window.mercury.api.getAllMatchAutoRule();
    const messageList = [];

    const newData = arr.map((obj: any, index: number) => {
      // 当description 和 payee 都和autoData的 description 和 payee 匹配时，则更新category
      const matchingRule = autoData.find(element => {
        return element.description === obj.description && element.payee === obj.payee;
      });

      if (matchingRule && matchingRule.category !== obj.category) {
        messageList.push({
          index,
          message: `第${index + 1}条:(${obj.payee})(${obj.description})`,
          changeContent: [
            {
              before: getCategoryString(obj.category),
              after: getCategoryString(matchingRule.category),
            },
          ],
        });
        return {
          ...obj,
          category: matchingRule.category,
        };
      }
      return obj;
    });

    openNotification(messageList, api);
    return newData;
  } catch (error) {
    message.error('分类失败');
    return arr;
  }
};
/*
  根据高级规则分类
  ruleFormDataList 高级规则列表
  arr 交易列表
*/
function matchRuleItem(transaction: I_Transaction, ruleItem: RuleItem): boolean {
  // console.log(ruleItem, "ruleItem");
  let transactionCategory = '';
  let ruleItemValue = '';
  if (ruleItem.condition === 'description' || ruleItem.condition === 'payee') {
    if (ruleItem.formula === 'like') {
      const reg = new RegExp(ruleItem.value);
      return reg.test(transaction[ruleItem.condition]);
    } else if (ruleItem.formula === 'eq') {
      return transaction[ruleItem.condition] === ruleItem.value;
    } else if (ruleItem.formula === 'notlike') {
      const reg = new RegExp(ruleItem.value);
      console.log(transaction[ruleItem.condition], 'transaction[ruleItem.condition] is not like');
      console.log(reg.test(transaction[ruleItem.condition]), 'reg.test(transaction[ruleItem.condition])');

      return !reg.test(transaction[ruleItem.condition]);
    }
  } else if (ruleItem.condition === 'amount') {
    const transactionAmount = Number(transaction.amount);
    const ruleValue = Number(ruleItem.value);

    switch (ruleItem.formula) {
      case 'gte':
        return transactionAmount >= ruleValue;
      case 'lt':
        return transactionAmount < ruleValue;
      case 'eq':
        return transactionAmount === ruleValue;
    }
  } else if (ruleItem.condition === 'account_type') {
    return `${transaction.account_type}` === `${ruleItem.value}`;
  } else if (ruleItem.condition === 'consumer') {
    switch (ruleItem.formula) {
      case 'eq':
        return `${transaction.consumer}` === `${ruleItem.value}`;
      case 'ne':
        return `${transaction.consumer}` !== `${ruleItem.value}`;
    }
  } else if (ruleItem.condition === 'category') {
    switch (ruleItem.formula) {
      case 'eq':
        transactionCategory =
          typeof transaction.category === 'string' ? transaction.category : JSON.stringify(transaction.category);
        ruleItemValue = typeof ruleItem.value === 'string' ? ruleItem.value : JSON.stringify(ruleItem.value);
        return transactionCategory === ruleItemValue;
      case 'ne':
        transactionCategory =
          typeof transaction.category === 'string' ? transaction.category : JSON.stringify(transaction.category);
        ruleItemValue = typeof ruleItem.value === 'string' ? ruleItem.value : JSON.stringify(ruleItem.value);

        return transactionCategory !== ruleItemValue;
    }
  }
  return false;
}
// 找到需要修改的列表
export function findMatchList(transactions: I_Transaction[], rules: AdvancedRule): I_Transaction[] {
  const matchList: I_Transaction[] = [];
  transactions.forEach((transaction, index) => {
    const ruleGroups: RuleItemListList = JSON.parse(rules.rule);
    const isMatch = ruleGroups.some(ruleGroup => {
      // All conditions within a group must match (AND condition)o
      console.log(ruleGroup, 'ruleGroup');

      return ruleGroup.every(ruleItem => matchRuleItem(transaction, ruleItem));
    });
    if (isMatch && rules.category !== transaction.category) {
      matchList.push(transaction);
    }
  });
  return matchList;
}

function applyRule(
  transactions: I_Transaction[],
  rules: AdvancedRule[]
): {
  newData: I_Transaction &
  {
    isChanged: true;
    ruleInfo: AdvancedRule;
  }[];
  messageList: MessageItem[];
}[] {
  const messageList: any[] = [];

  const newData = transactions.map((transaction, index) => {
    for (const rule of rules) {
      const ruleGroups: RuleItemListList = JSON.parse(rule.rule);

      // Check if any rule group matches (OR condition between groups)
      const isMatch = ruleGroups.some(ruleGroup =>
        // All conditions within a group must match (AND condition)
        ruleGroup.every(ruleItem => matchRuleItem(transaction, ruleItem))
      );
      const categoryMatch = rule.category && rule.category !== transaction.category
      const tagMatch = rule.tag && rule.tag !== transaction.tag
      const consumerMatch = rule.consumer && rule.consumer !== transaction.consumer
      if (
        isMatch &&
        (categoryMatch ||
          tagMatch ||
          consumerMatch)
      ) {
        const changeContent = [];

        if (categoryMatch) {
          changeContent.push({
            before: getCategoryString(transaction.category),
            after: getCategoryString(rule.category),
          });
        }
        if (tagMatch) {
          changeContent.push({
            before: getTagType(transaction.tag),
            after: getTagType(rule.tag),
          });
        }
        if (consumerMatch) {
          changeContent.push({
            before: getConsumerType(transaction.consumer),
            after: getConsumerType(rule.consumer),
          });
        }
        console.log(changeContent, 'changeContent');

        messageList.push({
          index,
          message: `第${index + 1}条:${transaction.payee}【${transaction.description}】金额：${transaction.amount}元`,
          changeContent,
          extra: rule,
        });

        return {
          ...transaction,
          tag: tagMatch ? rule.tag : transaction.tag,
          consumer: consumerMatch ? rule.consumer : transaction.consumer,
          category: categoryMatch ? rule.category : transaction.category,
          isChanged: true,
          ruleInfo: rule,
        };
      }
    }
    return transaction;
  });

  return {
    newData,
    messageList,
  };
}

export const ruleByAdvanced = async (arr: I_Transaction[], rules: AdvancedRule[], api: any) => {
  try {
    const p1Rules = rules.filter((item: any) => item.priority === 1);
    const p10Rules = rules.filter((item: any) => item.priority === 10);
    const p100Rules = rules.filter((item: any) => item.priority === 100);

    const { newData, messageList: p1MessageList } = applyRule(arr, p1Rules);
    const { newData: p10NewData, messageList: p10MessageList } = applyRule(newData, p10Rules);
    const { newData: p100NewData, messageList: p100MessageList } = applyRule(p10NewData, p100Rules);
    console.log(p1MessageList, 'p1MessageList');
    console.log(p10MessageList, 'p10MessageList');
    console.log(p100MessageList, 'p100MessageList');

    if (p1MessageList.length > 0) {
      openNotification(p1MessageList, api, '规则【P3】');
    }
    if (p10MessageList.length > 0) {
      openNotification(p10MessageList, api, '规则【P2】');
    }
    if (p100MessageList.length > 0) {
      openNotification(p100MessageList, api, '规则【P1】');
    }
    if (p1MessageList.length === 0 && p10MessageList.length === 0 && p100MessageList.length === 0) {
      message.info('没有符合条件的交易');
    }

    return p100NewData;
  } catch (error) {
    message.error('分类失败');
    console.log(error);

    return arr;
  }
};
