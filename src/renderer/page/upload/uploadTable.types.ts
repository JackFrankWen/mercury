export interface DataType {
  id: string;
  amount: string;
  // 下方字段是运行时存在但未在原始类型中声明的字段，保持与旧逻辑一致
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  category: string | null;
  description: string | null;
  account_type: number;
  payment_type: number;
  consumer: string;
  flow_type: string;
  creation_time: Date;
  trans_time: Date;
  modification_time: Date;
  tag: string | null;
}

export interface TableHeader {
  name: string;
  date: string;
  account_type: number;
  fileName: string;
  titleCostLabel: string;
  titleCost: string;
  titleIncome: string;
  titleIncomeLabel: string;
}

export type GetColumnSearchProps = (dataIndex: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterDropdown: (props: any) => React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilter: (value: string, record: any) => boolean;
  filteredValue: string[] | null;
};


