import { useState } from 'react';
import { message } from 'antd';
import { useFresh } from 'src/renderer/components/useFresh';

/**
 * 管理交易详情模态框数据的 Hook
 */
export function useTransactionModal(formValue: any, category: string, visible: boolean) {
  const [modalData, setModalData] = useState<any>([]);
  const [barData, setBarData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 获取交易详情数据
  const getTransactionDetails = async (data: any, category: string) => {
    if (!category) return;

    setLoading(true);
    try {
      const { trans_time } = data;
      const params = {
        ...data,
        category,
        trans_time,
      };

      const res = await window.mercury.api.getTransactions(params);
      if (res) {
        setModalData(res);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      message.error('获取交易数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取按月份统计数据（用于年度视图）
  const fetchBarData = async (obj: any) => {
    if (!obj) return;

    try {
      const result = await window.mercury.api.getTransactionsByMonth(obj);
      setBarData(result);
    } catch (error) {
      message.error(error);
    }
  };

  // 当modal显示且有选择的category时，获取数据
  useFresh(
    () => {
      if (category && visible) {
        getTransactionDetails(formValue, category);
      }
      if (formValue.type === 'year' && visible) {
        fetchBarData({
          ...formValue,
          category: category,
          trans_time: formValue.trans_time,
        });
      }
    },
    [formValue, category, visible],
    'transaction'
  );

  return {
    modalData,
    barData,
    loading,
    getTransactionDetails,
  };
}

