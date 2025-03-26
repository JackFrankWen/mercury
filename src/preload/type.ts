export type CategoryReturnType = {
  value: string;
  id: string;
  name: string;
  avg: string;
  child: {
    avg: string;
    category: string;
    id: string;
    value: string;
    name: string;
  }[];
}[];

export interface Params_Transaction {
  description?: string;
  account_type?: string | number;
  payment_type?: string | number;
  consumer?: string | number;
  tag?: string;
  abc_type?: string;
  cost_type?: string;
  trans_time?: [string, string];
  creation_time?: [string, string];
  modification_time?: [string, string];
  category?: string;
  min_money?: number;
  max_money?: number;
  is_unclassified?: boolean; // 是否未分类
  flow_type?: string;
}
