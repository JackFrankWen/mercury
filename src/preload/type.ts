export type CategoryReturnType = {
  value: string;
  id: string;
  name: string;
  avg: string;
  category: string;
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
  account_type?: string | number | (string | number)[];
  payment_type?: string | number | (string | number)[];
  consumer?: string | number;
  tag?: string;
  trans_time?: [string, string];
  creation_time?: [string, string] | string;
  modification_time?: [string, string] | string;
  category?: string[][] | string;
  min_money?: number;
  max_money?: number;
  is_unclassified?: boolean; // 是否未分类
  flow_type?: string;
  upload_file_name?: string;
  all_flow_type?: boolean;
}
