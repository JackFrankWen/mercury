// global.d.ts
export {};

declare global {
    interface Window {
        mercury: {
            api: {
                getALlMatchRule: () => Promise<any>;
                addMatchRule: (rule: {
                    category: string,
                    rule: string,
                    consumer: number,
                    tag?: string,
                    abc_type?: number,
                    cost_type?: number
                }) => Promise<any>;
                updateMatchRule: ( id: number,rule: {
                    category: string,
                    rule: string,
                    consumer: number,
                    tag?: string,
                    abc_type?: number,
                    cost_type?: number
                }) => Promise<any>;
                deleteMatchRule: (id: number) => Promise<any>;
                getTransactions: (params:Params_Transaction) => Promise<any>;
                deleteTransactions: (ids: number[]) => Promise<any>;
                updateTransactions: (ids: number[], params: Partial<Params_Transaction>) => Promise<any>;
                batchInsertTransactions: (list: Params_Transaction[]) => Promise<any>;
                getCategoryTotalByDate: (params: {start_date: string, end_date: string}) => Promise<CategoryReturnType>;
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
    trans_time: [string, string];
    creation_time?: [string, string];
    modification_time?: [string, string];
    min_money?: number;
    max_money?: number;
    is_unclassified?: boolean;
}