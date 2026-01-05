import { useState, useCallback } from 'react';
import { I_Transaction } from 'src/main/sqlite3/transactions';

/**
 * 计算选中行的总金额
 */
function calculateSelectedAmount(selectedKeys: React.Key[], data: I_Transaction[]): number {
  return selectedKeys.reduce((acc, key) => {
    const item = data.find(item => item.id === key);
    return acc + Number(item?.amount || 0);
  }, 0);
}

/**
 * 管理表格行选择的自定义 Hook
 */
export function useTableSelection(data: I_Transaction[]) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedAmount, setSelectedAmount] = useState(0);

  const onSelectChange = useCallback((newSelectedRowKeys: React.Key[], selectedRows: I_Transaction[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    const amount = selectedRows.reduce((acc, item) => acc + Number(item?.amount || 0), 0);
    setSelectedAmount(amount);
  }, []);

  const handleRowClick = useCallback((recordId: React.Key) => {
    const newSelectedRowKeys = selectedRowKeys.includes(recordId)
      ? selectedRowKeys.filter(id => id !== recordId)
      : [...selectedRowKeys, recordId];
    
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedAmount(calculateSelectedAmount(newSelectedRowKeys, data));
  }, [selectedRowKeys, data]);

  const clearSelection = useCallback(() => {
    setSelectedRowKeys([]);
    setSelectedAmount(0);
  }, []);

  return {
    selectedRowKeys,
    selectedAmount,
    onSelectChange,
    handleRowClick,
    clearSelection,
  };
}

