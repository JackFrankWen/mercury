// global.d.ts
export {};

declare global {
    interface Window {
        mercury: {
            crawler: (param: {
                web: 'pinduoduo';
                action: 'open' | 'getList';
            }) => Promise<any>;
            getWebpageContent: (a: string) => Promise<any>;
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
            };
        };
    }

}
export interface Params_Transaction {
    description?: string;
    account_type?: string;
    payment_type?: string; 
    consumer?: string;
    tag?: string;
    abc_type?: string;
    cost_type?: string;
    trans_time?: [string, string];
    createdAt?: [string, string];
    min_money?: number;
    max_money?: number;
    is_unclassified?: boolean;
}