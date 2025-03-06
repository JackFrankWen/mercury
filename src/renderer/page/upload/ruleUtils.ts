import { message } from 'antd';
import { getCategoryString } from 'src/renderer/const/categroy';
import { openNotification } from 'src/renderer/components/notification';

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