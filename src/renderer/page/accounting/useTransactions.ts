import { useState, useEffect, useCallback } from 'react';
import { Params_Transaction } from 'src/preload/type';
import { I_FormValue } from './index';

/**
 * 转换表单参数为API参数
 */
function transformFormParams(formValue: I_FormValue): Params_Transaction {
  return {
    ...formValue,
    is_unclassified: formValue.chose_unclassified === 'unclassified',
  };
}

/**
 * 管理交易数据获取的自定义 Hook
 */
export function useTransactions(initialFormValue: I_FormValue) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formValue, setFormValue] = useState<I_FormValue>(initialFormValue);

  const getTransactions = useCallback((params: Params_Transaction) => {
    setLoading(true);

    window.mercury.api.getTransactions(params)
      .then((res) => {
        if (res) {
          setTransactions(res);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const refreshTransactions = useCallback(() => {
    const params = transformFormParams(formValue);
    getTransactions(params);
  }, [formValue, getTransactions]);

  useEffect(() => {
    refreshTransactions();
  }, [formValue]);

  return {
    transactions,
    loading,
    formValue,
    setFormValue,
    refreshTransactions,
    getTransactions,
  };
}

