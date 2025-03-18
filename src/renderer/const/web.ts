export enum AccountType {
  HUSBAND = 1,
  WIFE = 2,
  GRANDPARENTS = 3,
}
export const account_type: { [key: number]: string } = {
  1: "老公账户",
  2: "老婆账户",
  3: "爷爷账户",
};
export const getAccountType = (type: number | string): string => {
  return account_type[Number(type)] || "未知账户";
};
export const payment_type: { [key: number]: string } = {
  1: "支付宝",
  2: "微信",
  3: "银行卡",
  4: "现金",
};
export const getPaymentType = (type: number | string): string => {
  return payment_type[Number(type)] || "未知支付方式";
};
export enum PaymentType {
  ALIPAY = 1,
  WECHAT = 2,
  BANK_CARD = 3,
  CASH = 4,
}
export const getConsumerType = (type: number | string): string => {
  return consumer_type[Number(type)] || "未知消费者";
};
export const consumer_type: { [key: number]: string } = {
  1: "老公",
  2: "老婆",
  3: "家庭",
  4: "牧牧",
  5: "爷爷奶奶",
  6: "溪溪",
};
export enum ConsumerType {
  HUSBAND = 1,
  WIFE = 2,
  FAMILY = 3,
  MOO = 4,
  GRANDPARENTS = 5,
}
export const getTagType = (type: number | string): string => {
  return tag_type[Number(type)] || "未知标签";
};
export const tag_type = {
  1: "日常支出",
  2: "变动支出",
  3: "固定支出",
  4: "牛单独",
};
export const abc_type = {
  1: "必要开支",
  2: "可有可无",
  3: "过度开支",
};
export const abc_type_budget = {
  1: 7000, // 基本
  2: 1000,
  3: 2000, // 奶茶电影
};
export const cost_type = {
  1: "生存开销", // 喝 贵一点牛奶算 5000， 好的牛奶 8000 进口
  2: "发展开销",
  3: "享受开销", // 奶茶电影
};
export const cost_type_budget = {
  1: 7000, // 基本
  2: 1000,
  3: 2000, // 奶茶电影
};
export const flow_type = {
  1: "支出",
  2: "收入",
};

export const transform = (obj: any) => {
  // 如果key不是数字则不需要number
  return Object.keys(obj).map((key) => {
    if (isNaN(Number(key))) {
      return {
        label: obj[key],
        value: key,
      };
    }
    return {
      label: obj[Number(key)],
      value: Number(key),
    };
  });
};

export const formula_type: { [key: string]: string } = {
  eq: "等于",
  gte: "大于等于",
  lte: "小于等于",
  like: "包含",
  gt: "大于",
  lt: "小于",
  ne: "不等于",
  in: "在范围内",
  notLike: "不包含",
};
export const getFormulaType = (type: number | string): string => {
  return formula_type[type] || "未知公式";
};
export const condition_type = {
  account_type: "账户",
  // consumer: '消费者',
  // payment_type: '支付方式',
  // abc_type: 'ABC分类',
  // tag_type: '标签类型',
  // flow_type: '收支类型',
  description: "描述",
  payee: "交易对象",
  // transaction_time: '交易时间',
  amount: "金额",
};
export const getConditionType = (type: number | string): string => {
  return condition_type[type] || "未知条件";
};
export const priority_type = {
  1: "p3",
  10: "p2",
  100: "p1",
};
export const getPriorityType = (type: number | string): string => {
  return priority_type[Number(type)] || "未知优先级";
};
export const cpt_const = {
  account_type: transform(account_type),
  cost_type: transform(cost_type),
  abc_type: transform(abc_type),
  tag_type: transform(tag_type),
  consumer_type: transform(consumer_type),
  payment_type: transform(payment_type),
  formula_type: transform(formula_type),
  condition_type: transform(condition_type),
  priority_type: transform(priority_type),
};
