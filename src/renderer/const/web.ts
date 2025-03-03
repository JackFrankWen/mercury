export enum AccountType {
    HUSBAND = 1,
    WIFE = 2,
    GRANDPARENTS = 3,
}
export const account_type: { [key: number]: string } = {
    1: '老公账户',
    2: '老婆账户',
    3: '爷爷账户',
}
export const getAccountType = (type: number | string): string => {
    return account_type[Number(type)] || '未知账户';
}
export const payment_type: { [key: number]: string } = {
    1: '支付宝',
    2: '微信',
    3: '银行卡',
    4: '现金',
}
export const getPaymentType = (type: number | string): string => {
    return payment_type[Number(type)] || '未知支付方式';
}
export enum PaymentType {
    ALIPAY = 1,
    WECHAT = 2,
    BANK_CARD = 3,
    CASH = 4,
}
export const consumer_type: { [key: number]: string } = {
    1: '老公',
    2: '老婆',
    3: '家庭',
    4: '牧牧',
    5: '爷爷奶奶',
    6: '溪溪',
}
export enum ConsumerType {
    HUSBAND = 1,
    WIFE = 2,
    FAMILY = 3,
    MOO = 4,
    GRANDPARENTS = 5,
}
export const tag_type = {
    1: '日常支出',
    2: '变动支出',
    3: '固定支出',
    4: '牛单独',
}
export const abc_type = {
    1: '必要开支',
    2: '可有可无',
    3: '过度开支',
}
export const abc_type_budget = {
    1: 7000, // 基本
    2: 1000,
    3: 2000, // 奶茶电影
}
export const cost_type = {
    1: '生存开销', // 喝 贵一点牛奶算 5000， 好的牛奶 8000 进口
    2: '发展开销',
    3: '享受开销', // 奶茶电影
}
export const cost_type_budget = {
    1: 7000, // 基本
    2: 1000,
    3: 2000, // 奶茶电影
}
export const flow_type = {
    1: '支出',
    2: '收入',
}

export const transform = (obj: any) => {
    return Object.keys(obj).map((key) => ({
        label: obj[Number(key)],
        value: Number(key),
    }))
}

export const cpt_const = {
    account_type: transform(account_type),
    cost_type: transform(cost_type),
    abc_type: transform(abc_type),
    tag_type: transform(tag_type),
    consumer_type: transform(consumer_type),
    payment_type: transform(payment_type),
}
