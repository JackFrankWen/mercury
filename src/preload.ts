// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { Params_Transaction } from './preload/type';
import { I_Transaction } from './main/sqlite3/transactions';
import { MatchRule } from './main/sqlite3/match-rules';
import { AdvancedRule } from './main/sqlite3/advance-rules';

contextBridge.exposeInMainWorld('mercury', {
  // 获取环境
  store: {
    getEnvironment: () => ipcRenderer.invoke('get-environment'),
    setEnvironment: (environment: 'production' | 'test') =>
      ipcRenderer.invoke('set-environment', environment),
    getUploadFileList: () => ipcRenderer.invoke('get-uploadFileList'),
    setUploadFileList: (
      uploadFileList: { fileName: string; fileType: 'wechat' | 'alipay'; createTime: string }[]
    ) => ipcRenderer.invoke('set-uploadFileList', uploadFileList),
  },
  api: {
    // 获取所有匹配规�?
    getAllMatchRule: () => ipcRenderer.invoke('match-rules:getAll'),
    // 添加匹配规则
    addMatchRule: (rule: {
      category: string;
      rule: string;
      consumer: number;
      tag?: string;

    }) => ipcRenderer.invoke('match-rules:add', rule),
    // 更新匹配规则
    updateMatchRule: (
      id: number,
      rule: {
        category: string;
        rule: string;
        consumer: number;
        tag?: string;
      }
    ) => ipcRenderer.invoke('match-rules:update', id, rule),
    // 批量插入自动规则
    batchInsertAutoRule: (list: MatchRule[]) =>
      ipcRenderer.invoke('match-rules:batchInsertAuto', list),
    // 获取所有自动规�?
    getAllMatchAutoRule: () => ipcRenderer.invoke('match-rules:getAllAuto'),
    // 删除自动规则
    deleteMatchAutoRule: (id: number) => ipcRenderer.invoke('match-rules:deleteAuto', id),
    //生成规则
    generateRule: (pp: Pick<Params_Transaction, 'trans_time'>) =>
      ipcRenderer.invoke('match-rules:generate', pp),
    // 删除匹配规则
    deleteMatchRule: (id: number) => ipcRenderer.invoke('match-rules:delete', id),
    // 根据条件获取所有交�?
    getTransactions: (params: Params_Transaction) =>
      ipcRenderer.invoke('transactions:getAll', params),
    // 删除交易
    deleteTransactions: (ids: number[]) => ipcRenderer.invoke('transactions:delete', ids),
    // 批量修改
    updateTransactions: (ids: number[], params: Params_Transaction) =>
      ipcRenderer.invoke('transactions:update', ids, params),
    // 批量插入
    batchInsertTransactions: (list: Params_Transaction[]) =>
      ipcRenderer.invoke('transactions:batchInsert', list),
    // 批量替换数据
    batchReplaceTransactions: (list: Params_Transaction[]) =>
      ipcRenderer.invoke('transactions:batchReplace', list),
    // 获取category
    getCategoryTotalByDate: (params: { start_date: string; end_date: string }) =>
      ipcRenderer.invoke('transactions:getCategoryTotalByDate', params),
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
    }) => ipcRenderer.invoke('transactions:insert', transaction),
    // 获取年月交易数据
    getTransactionsByMonth: (params: Params_Transaction) =>
      ipcRenderer.invoke('transactions:getTransactionsByMonth', params),
    // 按消费者分组统�?
    getConsumerTotal: (params: Params_Transaction) =>
      ipcRenderer.invoke('transactions:getConsumerTotal', params),
    // 按账户类型和支付方式分组统计
    getAccountPaymentTotal: (params: Params_Transaction) =>
      ipcRenderer.invoke('transactions:getAccountPaymentTotal', params),
    // 获取账户统计
    getAccountTotal: (params: Params_Transaction) =>
      ipcRenderer.invoke('transactions:getAccountTotal', params),
    // 获取每日交易金额统计
    getDailyTransactionAmounts: (params: Params_Transaction) =>
      ipcRenderer.invoke('transactions:getDailyAmounts', params),
    // 导出csv
    exportToCsv: () => ipcRenderer.invoke('export:csv'),
    // 导出json
    exportToJson: () => ipcRenderer.invoke('export:json'),
    // 高级规则 API
    getAllAdvancedRules: (params?: { nameOrRule?: string; active?: number }) =>
      ipcRenderer.invoke('advanced-rules:getAll', params),
    // 添加高级规则
    addAdvancedRule: (rule: AdvancedRule) => ipcRenderer.invoke('advanced-rules:add', rule),
    // 批量插入高级规则
    batchInsertAdvancedRule: (rules: AdvancedRule[]) =>
      ipcRenderer.invoke('advanced-rules:batchInsert', rules),
    // 更新高级规则
    updateAdvancedRule: (id: number, rule: AdvancedRule) =>
      ipcRenderer.invoke('advanced-rules:update', id, rule),
    // 删除高级规则
    deleteAdvancedRule: (id: number) => ipcRenderer.invoke('advanced-rules:delete', id),
    // 删除所有交易数�?
    deleteAllTransactions: (params: Params_Transaction) =>
      ipcRenderer.invoke('transactions:deleteAll', params),
    // 爬取京东订单
    crawlJDOrders: () => ipcRenderer.invoke('crawl-jd-orders'),
    // 爬取瓶多多订�?
    crawlPDDOrders: () => ipcRenderer.invoke('crawl-pdd-orders'),
  },
  window: {
    minimize: () => ipcRenderer.send('minimize-window'),
    maximize: () => ipcRenderer.send('maximize-window'),
    close: () => ipcRenderer.send('close-window'),
  },

  // we can also expose variables, not just functions
});

