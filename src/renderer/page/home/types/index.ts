/**
 * 首页相关的类型定义
 */

// 汇总数据
export type SummarizeData = {
  income: number;
  cost: number;
  balance: number;
};

// 公司汇总数据
export type CompanySummarizeData = {
  income: number;
  cost: number;
  balance: number;
  incomeTotal: number;
  costTotal: number;
  balanceTotal: number;
};

// 年度图表数据
export type YearBarChartData = {
  monthlyData: { date: string; total: number }[];
  dailyData: { date: string; total: number }[];
};

// 账户支付数据
export type AccountPaymentData = {
  account_type: string;
  total: number;
  payment_type: string;
};

// 消费者数据
export type ConsumerData = {
  item: string;
  total: number;
};

// 日期数据
export type DateData = {
  date: string;
  total: number;
};

