// global.d.ts
export {};

declare global {
    interface Window {
        mercury: {
            api: {
                // 批量插入自动规则
                batchInsertAutoRule: (list: MatchRule[]) => Promise<any>;
                // 获取所有自动规则
                getAllMatchAutoRule: () => Promise<MatchRule[]>;
                // 删除自动规则
                deleteMatchAutoRule: (id: number) => Promise<any>;
                // 获取所有匹配规则
                getALlMatchRule: () => Promise<MatchRule[]>;
                // 添加匹配规则
                addMatchRule: (rule: {
                    category: string,
                    rule: string,
                    consumer: number,
                    tag?: string,
                    abc_type?: number,
                    cost_type?: number
                }) => Promise<any>;
                // 生成规则
                generateRule: (pp?:Pick<Params_Transaction, 'trans_time'>) => Promise<any>;
                // 更新匹配规则
                updateMatchRule: ( id: number,rule: {
                    category: string,
                    rule: string,
                    consumer: number,
                    tag?: string,
                    abc_type?: number,
                    cost_type?: number
                }) => Promise<any>;
                // 删除匹配规则
                deleteMatchRule: (id: number) => Promise<any>;
                // 获取所有交易
                getTransactions: (params:Params_Transaction) => Promise<any>;
                // 删除交易
                deleteTransactions: (ids: number[]) => Promise<any>;
                // 更新交易
                updateTransactions: (ids: number[], params: Partial<Params_Transaction>) => Promise<any>;
                // 批量插入交易
                batchInsertTransactions: (list: Params_Transaction[]) => Promise<any>;
                // 插入交易
                insertTransaction: (transaction: {
                    amount: number;
                    category?: string;
                    description?: string;
                    payee?: string;
                    account_type?: string;
                    payment_type?: string;
                    consumer?: string;
                    flow_type?: string;
                    tag?: string;
                    abc_type?: string;
                    cost_type?: string;
                    trans_time?: string;
                }) => Promise<{ code: number }>;
                getCategoryTotalByDate: (params: Params_Transaction) => Promise<CategoryReturnType>;
                // 获取年月交易数据
                getTransactionsByMonth: (params: Params_Transaction) => Promise<{date: string, total: number}[]>
                // 按消费者分组统计
                getConsumerTotal: (params: Params_Transaction) => Promise<{item: string, total: number}[]>
                // 按账户类型和支付方式分组统计
                getAccountPaymentTotal: (params: Params_Transaction) => Promise<{account_type: string, payment_type: string, total: number}[]>
        };
    }

}
export type CategoryReturnType = {
    value: string
    id: string
    name: string
    avg: string
    child: {
      avg: string
      category: string
      id: string
      value: string
      name: string
    }[]
}[]

export interface Params_Transaction  {
    description?: string;
    account_type?: string;
    payment_type?: string; 
    consumer?: string;
    tag?: string;
    abc_type?: string;
    cost_type?: string;
    trans_time?: [string, string];
    creation_time?: [string, string];
    modification_time?: [string, string];
    min_money?: number;
    max_money?: number;
    is_unclassified?: boolean;
    flow_type?: string;
}