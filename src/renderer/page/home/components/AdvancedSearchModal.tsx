import React from 'react';
import { Modal, Flex, Radio, Select } from 'antd';
import { cpt_const } from '../../../const/web';

interface AdvancedSearchModalProps {
  visible: boolean;
  onClose: () => void;
  flowTypeVal: number;
  setFlowTypeVal: (val: number) => void;
  paymentTypeVal: number | undefined;
  setPaymentTypeVal: (val: number | undefined) => void;
  tagVal: number | undefined;
  setTagVal: (val: number | undefined) => void;
}

/**
 * 高级搜索模态框组件
 */
function AdvancedSearchModal({
  visible,
  onClose,
  flowTypeVal,
  setFlowTypeVal,
  paymentTypeVal,
  setPaymentTypeVal,
  tagVal,
  setTagVal,
}: AdvancedSearchModalProps): JSX.Element {
  return (
    <Modal
      title="高级搜索"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Flex vertical gap={16}>
        <Radio.Group
          value={flowTypeVal}
          onChange={(e) => setFlowTypeVal(e.target.value)}
          block
          buttonStyle="solid"
        >
          {cpt_const.flow_type.map((option) => (
            <Radio.Button key={option.value} value={option.value}>
              {option.label}
            </Radio.Button>
          ))}
        </Radio.Group>
        
        <Select
          allowClear
          value={paymentTypeVal}
          onChange={setPaymentTypeVal}
          placeholder="支付方式"
          options={cpt_const.payment_type}
        />
        
        <Select
          allowClear
          value={tagVal}
          onChange={setTagVal}
          placeholder="标签"
          options={cpt_const.tag_type}
        />
      </Flex>
    </Modal>
  );
}

export default AdvancedSearchModal;

