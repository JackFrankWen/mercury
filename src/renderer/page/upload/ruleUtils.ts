import { message } from 'antd';
import { getCategoryString } from 'src/renderer/const/categroy';
import { openNotification } from 'src/renderer/components/notification';
import { RuleFormData } from '../setting/advancedRuleModal';
import { AdvancedRule } from 'src/main/sqlite3/advance-rules';
import { RuleItem, RuleItemList, RuleItemListList } from '../setting/advancedRuleFormItem';
import { I_Transaction } from 'src/main/sqlite3/transactions';
/**
 * Apply user-defined classification rules to transaction data
 */
export const ruleByUser = async (arr: any, api: any) => {
  const rules = await window.mercury.api.getAllMatchRule();
  const messageList = [];

  const newData = arr.map((obj: any, index: number) => {
    // Get the text to match against (description or payee)
    const matchText = `${obj.description || ''} ${obj.payee || ''}`.trim();

    // Find the first matching rule
    const matchingRule = rules.find(element => {
      const reg = new RegExp(element.rule);
      return reg.test(matchText);
    });

    // If a rule matches, update the category and notify
    if (matchingRule && matchingRule.category !== obj.category) {
      messageList.push({
        index,
        message: `第${index + 1}条:(${obj.payee})(${obj.description})`,
        before: getCategoryString(obj.category),
        after: getCategoryString(matchingRule.category)
      });
      return {
        ...obj,
        category: matchingRule.category
      };
    }

    return obj;
  });
  
  openNotification(messageList, api);
  return newData;
};

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
          before: getCategoryString(obj.category),
          after: getCategoryString(matchingRule.category)
        });
        return {
          ...obj,
          category: matchingRule.category
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
  if (ruleItem.condition === 'description' || ruleItem.condition === 'payee') {
    if (ruleItem.formula === 'like') {
      const reg = new RegExp(ruleItem.value);
      return reg.test(transaction[ruleItem.condition]);
    } else if (ruleItem.formula === 'eq') {
      return transaction[ruleItem.condition] === ruleItem.value;
    } else if (ruleItem.formula === 'notlike') {
      const reg = new RegExp(ruleItem.value);
      return !reg.test(transaction[ruleItem.condition]);
    }
  } else if (ruleItem.condition === 'amount') {
    const transactionAmount = Number(transaction.amount);
    const ruleValue = Number(ruleItem.value);
    
    switch (ruleItem.formula) {
      case 'gte': return transactionAmount >= ruleValue;
      case 'lt': return transactionAmount < ruleValue;
      case 'eq': return transactionAmount === ruleValue;
    }
  } else if (ruleItem.condition === 'account_type') {
    return transaction.account_type === ruleItem.value;
  }
  return false;
}
// 找到需要修改的列表
export function findMatchList(transactions: I_Transaction[], rules: AdvancedRule): I_Transaction[] {
  const matchList: I_Transaction[] = [];
  transactions.forEach((transaction, index) => {
    const ruleGroups: RuleItemListList = JSON.parse(rules.rule);
    const isMatch = ruleGroups.some(ruleGroup => 
      // All conditions within a group must match (AND condition)
      ruleGroup.every(ruleItem => matchRuleItem(transaction, ruleItem))
    );
    if (isMatch && rules.category !== transaction.category) {
      matchList.push(transaction);
    }
  });
  return matchList;
}

function applyRule(transactions: I_Transaction[], rules: AdvancedRule[]) {
  const messageList: any[] = [];
  
  const newData = transactions.map((transaction, index) => {
    for (const rule of rules) {
      const ruleGroups: RuleItemListList = JSON.parse(rule.rule);
      
      // Check if any rule group matches (OR condition between groups)
      const isMatch = ruleGroups.some(ruleGroup => 
        // All conditions within a group must match (AND condition)
        ruleGroup.every(ruleItem => matchRuleItem(transaction, ruleItem))
      );

      if (isMatch && rule.category !== transaction.category) {
        messageList.push({
          index,
          message: `第${index + 1}条:(${transaction.payee})(${transaction.description})`,
          before: getCategoryString(transaction.category),
          after: getCategoryString(rule.category),
          extra: rule,
        });
        
        return {
          ...transaction,
          tag: rule.tag || transaction.tag,
          consumer: rule.consumer || transaction.consumer,
          category: rule.category
        };
      }
    }
    return transaction;
  });

  return {
    newData,
    messageList
  };
}

export const ruleByAdvanced = async (arr:I_Transaction[] , api: any) => {
 try {      
  const rules: AdvancedRule[] = await window.mercury.api.getAllAdvancedRules({
    active: 1
  });
  const p1Rules = rules.filter((item: any) => item.priority === 1);
  const p10Rules = rules.filter((item: any) => item.priority === 10);
  const p100Rules = rules.filter((item: any) => item.priority === 100);
  
  const { newData, messageList: p1MessageList } = applyRule(arr, p1Rules)
  const { newData: p10NewData, messageList: p10MessageList } = applyRule(newData, p10Rules)
  const { newData: p100NewData, messageList: p100MessageList } = applyRule(p10NewData, p100Rules)
 
  if (p1MessageList.length > 0) {
    openNotification(p1MessageList, api, '规则【P3】')
  }
  if (p10MessageList.length > 0) {
    openNotification(p10MessageList, api, '规则【P2】')
  }
  if (p100MessageList.length > 0) {
    openNotification(p100MessageList, api, '规则【P1】')
  }
  
  
  return p100NewData;
  
 } catch (error) {
  message.error('分类失败');
  console.log(error);
  
  return arr;
 }
  
}
