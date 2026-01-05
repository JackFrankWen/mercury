import React from 'react';
import { Modal, Flex } from 'antd';

interface AdvancedSearchModalProps {
  visible: boolean;
  onClose: () => void;
  flowTypeCpt: React.ReactNode;
  paymentTypeCpt: React.ReactNode;
  tagCpt: React.ReactNode;
}

/**
 * 高级搜索模态框组件
 */
function AdvancedSearchModal({
  visible,
  onClose,
  flowTypeCpt,
  paymentTypeCpt,
  tagCpt,
}: AdvancedSearchModalProps): JSX.Element {
  return (
    <Modal
      title="高级搜索"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Flex vertical gap={16}>
        {flowTypeCpt}
        {paymentTypeCpt}
        {tagCpt}
      </Flex>
    </Modal>
  );
}

export default AdvancedSearchModal;

