import React from 'react';
import { Col } from 'antd';
import TableSection from '../reviewTable';
import Summarize from '../review-sum';
import YearBarChart from '../yearBarChart';
import CompanySummarize from '../companySummarize';
import AdvancedSearchModal from './AdvancedSearchModal';
import { FormData } from '../hooks/useFormData';

interface LeftSectionProps {
  formValue: FormData;
  extraState: any;
  extraComponent: React.ReactNode;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

/**
 * 首页左侧内容区域
 * 包含汇总信息、图表和表格
 */
function LeftSection({
  formValue,
  extraState,
  extraComponent,
  visible,
  setVisible,
}: LeftSectionProps): JSX.Element {
  const { FlowTypeCpt, PaymentTypeCpt, TagCpt } = extraState;

  return (
    <Col span={16} className="home-page-left mb16">
      <Summarize formValue={formValue} />
      <CompanySummarize formValue={formValue} />

      {visible && (
        <AdvancedSearchModal
          visible={visible}
          onClose={() => setVisible(false)}
          flowTypeCpt={FlowTypeCpt}
          paymentTypeCpt={PaymentTypeCpt}
          tagCpt={TagCpt}
        />
      )}

      <YearBarChart
        formValue={formValue}
        extraState={extraState}
        extraComponent={extraComponent}
        visible={visible}
        setVisible={setVisible}
      />

      <div className="mt8 mb16">
        <TableSection
          formValue={formValue}
          extraState={extraState}
          extraComponent={extraComponent}
          visible={visible}
          setVisible={setVisible}
        />
      </div>
    </Col>
  );
}

export default LeftSection;

