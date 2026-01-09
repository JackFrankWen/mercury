import { useState, useEffect } from 'react';
import { message } from 'antd';
import { FormData } from './useFormData';
import { CategoryReturnType } from 'src/preload/type';
import { SummarizeData, CompanySummarizeData, YearBarChartData } from '../types';

const FLOW_TYPE_COST = 1; // 支出
const FLOW_TYPE_INCOME = 2; // 收入
const COMPANY_ACCOUNT_TYPE = 4; // 公司账户

/**
 * 管理左侧区域数据的 Hook
 * 包含汇总、公司汇总、图表和分类数据的请求和状态管理
 */
export function useLeftSectionData(formValue: FormData, extraState: any) {
  const [summarizeData, setSummarizeData] = useState<SummarizeData>({
    income: 0,
    cost: 0,
    balance: 0,
  });

  const [companySummarizeData, setCompanySummarizeData] = useState<CompanySummarizeData>({
    income: 0,
    cost: 0,
    balance: 0,
    incomeTotal: 0,
    costTotal: 0,
    balanceTotal: 0,
  });
  const [categoryVal, setCategoryVal] = useState<string[]>([]);

  const [yearBarChartData, setYearBarChartData] = useState<YearBarChartData>({
    monthlyData: [],
    dailyData: [],
  });

  const [categoryData, setCategoryData] = useState<CategoryReturnType>([]);

  const { accountTypeVal, consumerVal, paymentTypeVal, tagVal, flowTypeVal } = extraState;

  // 获取汇总数据（总收入、总支出、结余）
  const fetchSummarizeData = async (obj: any) => {
    try {
      if (!obj) return;

      const [costRes, incomeRes] = await Promise.all([
        window.mercury.api.getAccountTotal({
          ...obj,
          flow_type: FLOW_TYPE_COST,
        }),
        window.mercury.api.getAccountTotal({
          ...obj,
          flow_type: FLOW_TYPE_INCOME,
        }),
      ]);

      const calculateTotal = (data: any[]): number => {
        if (!Array.isArray(data)) {
          console.warn('数据格式不正确，期望数组格式');
          return 0;
        }

        return data.reduce((acc: number, item: any) => {
          if (!item || typeof item.total === 'undefined') {
            return acc;
          }
          const total = Number(item.total) || 0;
          acc += Math.floor(total);
          return acc;
        }, 0);
      };

      const totalIncome = calculateTotal(incomeRes);
      const totalCost = calculateTotal(costRes);
      const balance = totalIncome - totalCost;

      setSummarizeData({
        income: totalIncome,
        cost: totalCost,
        balance: balance,
      });
    } catch (error) {
      console.error('获取汇总数据失败:', error);
    }
  };

  // 获取公司汇总数据
  const fetchCompanySummarizeData = async (obj: any) => {
    try {
      if (!obj) return;

      const baseParams = {
        ...obj,
        account_type: COMPANY_ACCOUNT_TYPE,
      };

      const [currentCostRes, currentIncomeRes, totalCostRes, totalIncomeRes] = await Promise.all([
        window.mercury.api.getAccountTotal({
          ...baseParams,
          flow_type: FLOW_TYPE_COST,
        }),
        window.mercury.api.getAccountTotal({
          ...baseParams,
          flow_type: FLOW_TYPE_INCOME,
        }),
        window.mercury.api.getAccountTotal({
          ...baseParams,
          flow_type: FLOW_TYPE_COST,
          trans_time: ['2020-01-01', '2099-01-01'],
        }),
        window.mercury.api.getAccountTotal({
          ...baseParams,
          flow_type: FLOW_TYPE_INCOME,
          trans_time: ['2020-01-01', '2099-01-01'],
        }),
      ]);

      const calculateTotal = (data: any[], accountType: number): number => {
        if (!Array.isArray(data)) {
          console.warn('数据格式不正确，期望数组格式');
          return 0;
        }

        return data.reduce((acc: number, item: any) => {
          if (
            !item ||
            typeof item.account_type === 'undefined' ||
            typeof item.total === 'undefined'
          ) {
            return acc;
          }

          if (Number(item.account_type) === accountType) {
            const total = Number(item.total) || 0;
            acc += Math.floor(total);
          }
          return acc;
        }, 0);
      };

      const currentIncome = calculateTotal(currentIncomeRes, COMPANY_ACCOUNT_TYPE);
      const currentCost = calculateTotal(currentCostRes, COMPANY_ACCOUNT_TYPE);
      const totalIncome = calculateTotal(totalIncomeRes, COMPANY_ACCOUNT_TYPE);
      const totalCost = calculateTotal(totalCostRes, COMPANY_ACCOUNT_TYPE);

      setCompanySummarizeData({
        income: currentIncome,
        cost: currentCost,
        balance: currentIncome - currentCost,
        incomeTotal: totalIncome,
        costTotal: totalCost,
        balanceTotal: totalIncome - totalCost,
      });
    } catch (error) {
      console.error('获取公司汇总数据失败:', error);
    }
  };

  // 获取月度图表数据
  const fetchMonthlyData = async (obj: any) => {
    if (!obj) return;

    try {
      const result = await window.mercury.api.getTransactionsByMonth(obj);
      setYearBarChartData(prev => ({ ...prev, monthlyData: result }));
    } catch (error) {
      message.error(error);
    }
  };

  // 获取日度图表数据
  const fetchDailyData = async (obj: any) => {
    try {
      if (!obj) return;
      const result = await window.mercury.api.getDailyTransactionAmounts(obj);
      setYearBarChartData(prev => ({ ...prev, dailyData: result }));
    } catch (error) {
      message.error(error);
    }
  };

  // 获取分类数据
  const fetchCategoryData = async (obj: any) => {
    try {
      if (!obj) return;
      const result = await window.mercury.api.getCategoryTotalByDate(obj);
      setCategoryData(result);
    } catch (error) {
      console.error(error);
    }
  };

  // 刷新所有数据
  const refreshLeftSectionData = async () => {
    const params = {
      ...formValue,
      consumer: consumerVal,
      account_type: accountTypeVal,
      payment_type: paymentTypeVal,
      tag: tagVal,
      flow_type: flowTypeVal,
      category: categoryVal,
    };

    await Promise.all([
      fetchSummarizeData(formValue),
      fetchCompanySummarizeData(formValue),
      formValue.type === 'year' ? fetchMonthlyData(params) : fetchDailyData(params),
      fetchCategoryData(params),
    ]);
  };

  // 监听依赖变化
  useEffect(() => {
    refreshLeftSectionData();
  }, [formValue, consumerVal, accountTypeVal, paymentTypeVal, tagVal, flowTypeVal, categoryVal]);


  return {
    summarizeData,
    companySummarizeData,
    yearBarChartData,
    categoryData,
    refreshLeftSectionData,
    categoryVal,
    setCategoryVal
  };
}

