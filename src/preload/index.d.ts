// global.d.ts
export { };

import { CategoryReturnType, Params_Transaction } from "./type";
import { MatchRule } from "../main/sqlite3/match-rules";
import { AdvancedRule } from "../main/sqlite3/advance-rules";
import { I_Transaction } from "../main/sqlite3/transactions";
declare global {
  interface Window {
    mercury: {
      store: {
        getEnvironment: () => Promise<string>;
        setEnvironment: (environment: string) => Promise<void>;
        getUploadFileList: () => Promise<{ fileName: string; fileType: string; createTime: string }[]>;
        setUploadFileList: (uploadFileList: { fileName: string; fileType: string; createTime: string }[]) => Promise<void>;
      };
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
          category: string;
          rule: string;
          consumer: number;
          tag?: string;
        }) => Promise<any>;
        // 生成规则
        generateRule: (pp?: Pick<Params_Transaction, "trans_time">) => Promise<any>;
        // 更新匹配规则
        updateMatchRule: (
          id: number,
          rule: {
            category: string;
            rule: string;
            consumer: number;
            tag?: string;
          }
        ) => Promise<any>;
        // 删除匹配规则
        deleteMatchRule: (id: number) => Promise<any>;
        // 获取所有交易
        getTransactions: (params: Params_Transaction) => Promise<any>;
        // 删除交易
        deleteTransactions: (ids: number[]) => Promise<any>;
        // 更新交易
        updateTransactions: (ids: number[], params: Partial<Params_Transaction>) => Promise<any>;
        // 批量插入交易
        batchInsertTransactions: (list: Params_Transaction[]) => Promise<any>;
        // 批量替换交易
        batchReplaceTransactions: (list: I_Transaction[]) => Promise<any>;
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
          trans_time?: string;
        }) => Promise<{ code: number }>;
        getCategoryTotalByDate: (params: Params_Transaction) => Promise<CategoryReturnType>;
        // 获取年月交易数据
        getTransactionsByMonth: (
          params: Params_Transaction
        ) => Promise<{ date: string; total: number }[]>;
        // 按消费者分组统计
        getConsumerTotal: (
          params: Params_Transaction
        ) => Promise<{ item: string; total: number }[]>;
        // 按账户类型和支付方式分组统计
        getAccountPaymentTotal: (
          params: Params_Transaction
        ) => Promise<{ account_type: string; payment_type: string; total: number }[]>;
        // 获取每日交易金额统计
        getDailyTransactionAmounts: (
          params: Params_Transaction
        ) => Promise<{ date: string; total: number }[]>;
        // 导出csv
        exportToCsv: () => Promise<{ code: number; message: string }>;
        // 导出json
        exportToJson: () => Promise<{ code: number; message: string }>;
        // 高级规则 API 类型
        getAllAdvancedRules: (rule?: {
          nameOrRule?: string;
          active?: number;
        }) => Promise<AdvancedRule[]>;
        addAdvancedRule: (rule: AdvancedRule) => Promise<{ code: number; id?: number }>;
        // 批量插入高级规则
        batchInsertAdvancedRule: (list: AdvancedRule[]) => Promise<any>;
        // 更新高级规则 
        updateAdvancedRule: (id: number, rule: AdvancedRule) => Promise<{ code: number }>;
        // 删除高级规则
        deleteAdvancedRule: (id: number) => Promise<{ code: number }>;
        // 删除所有交易数据
        deleteAllTransactions: (params: Params_Transaction) => Promise<{ code: number; message: string }>;
      };
    };
  }
}
