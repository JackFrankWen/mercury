import { useState } from 'react';
import { getAccountType, getPaymentType } from 'src/renderer/const/web';
import { consumer_type } from 'src/renderer/const/web';
import { FormData } from './useFormData';

interface AccountPaymentData {
  account_type: string;
  total: number;
  payment_type: string;
}

interface ConsumerData {
  item: string;
  total: number;
}

/**
 * 管理右侧区域数据的 Hook
 * 包含账户信息和消费者图表的数据请求和状态管理
 */
export function useRightSectionData(formValue: FormData) {
  const [accountData, setAccountData] = useState<AccountPaymentData[]>([]);
  const [consumerData, setConsumerData] = useState<ConsumerData[]>([]);

  // 获取账户支出数据
  const fetchAccountData = async (obj: any) => {
    try {
      if (!obj) return;
      const res = await window.mercury.api.getAccountPaymentTotal(obj);
      setAccountData(res);
    } catch (error) {
      console.log(error);
    }
  };

  // 获取成员支出数据
  const fetchConsumerData = async (obj: any) => {
    try {
      if (!obj) return;
      const result = await window.mercury.api.getConsumerTotal(obj);
      setConsumerData(
        result.map((item) => ({
          item: consumer_type[Number(item.item)],
          total: item.total,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  };

  // 刷新所有数据
  const refreshRightSectionData = async () => {
    await Promise.all([
      fetchAccountData(formValue),
      fetchConsumerData(formValue),
    ]);
  };


  return {
    accountData,
    consumerData,
    refreshRightSectionData,
  };
}

