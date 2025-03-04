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