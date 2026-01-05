import { message } from 'antd';
import { I_Transaction } from 'src/main/sqlite3/transactions';

/**
 * 管理交易的批量操作（删除、更新）
 */
export function useTransactionOperations(
  selectedRowKeys: React.Key[],
  onSuccess: () => void,
  clearSelection: () => void
) {
  const handleDelete = () => {
    window.mercury.api
      .deleteTransactions(selectedRowKeys as number[])
      .then(() => {
        clearSelection();
        message.success('删除成功');
        onSuccess();
      })
      .catch((error: any) => {
        console.error('删除失败:', error);
        message.error('删除失败');
      });
  };

  const handleUpdate = (params: Partial<I_Transaction>) => {
    const obj = {
      ...params,
    };
    
    if (params.category) {
      obj.category = JSON.stringify(params.category);
    }

    window.mercury.api
      .updateTransactions(selectedRowKeys as number[], obj)
      .then(() => {
        clearSelection();
        message.success('修改成功');
        onSuccess();
      })
      .catch((error: any) => {
        console.error('修改失败:', error);
        message.error('修改失败');
      });
  };

  return {
    handleDelete,
    handleUpdate,
  };
}

