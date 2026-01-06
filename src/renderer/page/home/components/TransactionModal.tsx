import React from 'react';
import { Modal } from 'antd';
import BarChart from 'src/renderer/components/barChart';
import { ModalContent } from '../ModalContent';
import { useTransactionModal } from '../hooks/useTransactionModal';

interface TransactionModalProps {
  visible: boolean;
  category: string;
  formValue: any;
  onClose: () => void;
  refreshTable: () => void;
}

/**
 * 交易详情模态框组件
 */
function TransactionModal(props: TransactionModalProps) {
  const { visible, category, formValue, onClose, refreshTable } = props;
  const { modalData, barData, loading, getTransactionDetails } = useTransactionModal(
    formValue,
    category,
    visible
  );

  // 刷新表格数据
  const refresh = () => {
    refreshTable();
    if (category) {
      getTransactionDetails(formValue, category);
    }
  };

  return (
    <Modal
      width={1000}
      closable={true}
      footer={null}
      open={visible}
      onCancel={onClose}
      title="交易详情"
    >
      {formValue.type === 'year' && <BarChart data={barData} flowTypeVal={formValue.flow_type} />}
      {modalData.length > 0 && (
        <ModalContent loading={loading} onCancel={onClose} modalData={modalData} refresh={refresh} />
      )}
    </Modal>
  );
}

export default TransactionModal;

