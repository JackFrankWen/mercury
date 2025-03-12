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
function applyRule(arr: I_Transaction[], ruleFormDataList: AdvancedRule [], messageList: any[]) {
  // const newData = obj.map((item: AdvancedRule, index: number) => {
  //   const rule: RuleItemList = JSON.parse(item.rule)
  const newData = arr.map((item: I_Transaction, index: number) => {

    for (const ruleFormData of ruleFormDataList) {
      // 最外层
      const ruleList: RuleItemListList = JSON.parse(ruleFormData.rule)

      let isMatch = false
      for (const [index, ruleItemList] of ruleList.entries()) {
        // 或者
        let isAllMatch = true
        for (const ruleItem of ruleItemList) {
          // 且 必须满足ruleItemList中的所有ruleItem
          if (
            ruleItem.condition === 'description' 
            || ruleItem.condition === 'payee'
          ) {
            if (ruleItem.formula === 'like') {
              const reg = new RegExp(ruleItem.value);
              if (reg.test(item[ruleItem.condition])) {
                isMatch = true
                break
              } else {
                isAllMatch = false
              }
            } else if (ruleItem.formula === 'eq') {
              if (item.description === ruleItem.value) {
                isMatch = true
                break
              } else {
                isAllMatch = false
              }
            }
          }
        }

        if (isAllMatch) {
          isMatch = true
          break
        }
      }
      if (isMatch) {
        messageList.push({
          index: index,
          message: `第${index + 1}条:(${item.payee})(${item.description})`,
          before: getCategoryString(item.category),
          after: getCategoryString(ruleFormData.category),
          extra: ruleFormData,
        })
        return { 
          ...item,
          tag: ruleFormData.tag ? ruleFormData.tag : item.tag,
          category: ruleFormData.category 
        }
      }
    }
    return item
  })
  return {
    newData,
    messageList
  }
}

export const ruleByAdvanced = async (arr:I_Transaction[] , api: any) => {
 try {      
  const rules: AdvancedRule[] = await window.mercury.api.getAllAdvancedRules();
  const messageList = [];
  const p1Rules = rules.filter((item: any) => item.priority === 1);
  const p10Rules = rules.filter((item: any) => item.priority === 10);
  const p100Rules = rules.filter((item: any) => item.priority === 100);
  
  const { newData, messageList: p1MessageList } = applyRule(arr, p1Rules, messageList)
  const { newData: p10NewData, messageList: p10MessageList } = applyRule(newData, p10Rules, p1MessageList)
  const { newData: p100NewData, messageList: p100MessageList } = applyRule(p10NewData, p100Rules, p10MessageList)
  openNotification([...p1MessageList, ...p10MessageList, ...p100MessageList], api)
  return p100NewData;
  
 } catch (error) {
  message.error('分类失败');
  return arr;
 }
  
}
