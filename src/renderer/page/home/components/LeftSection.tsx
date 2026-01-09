import React, { useState } from 'react';
import { Col } from 'antd';
import TableSection from '../reviewTable';
import Summarize from '../review-sum';
import YearBarChart from '../yearBarChart';
import CompanySummarize from '../companySummarize';
import AdvancedSearchModal from './AdvancedSearchModal';
import { FormData } from '../hooks/useFormData';
import { CategoryReturnType } from 'src/preload/type';
import { SummarizeData, CompanySummarizeData, YearBarChartData } from '../types';
import { ExtraControlsState } from '../hooks/useLeftSectionData';

interface LeftSectionProps {
  formValue: FormData;
  extraState: ExtraControlsState;
  summarizeData: SummarizeData;
  companySummarizeData: CompanySummarizeData;
  yearBarChartData: YearBarChartData;
  categoryData: CategoryReturnType;
  categoryVal: string[];
  setCategoryVal: (val: string[]) => void;
  onRefresh: () => void;
}

/**
 * 首页左侧内容区域
 * 包含汇总信息、图表和表格
 */
function LeftSection({
  formValue,
  extraState,
  summarizeData,
  companySummarizeData,
  yearBarChartData,
  categoryData,
  categoryVal,
  setCategoryVal,
  onRefresh,
}: LeftSectionProps): JSX.Element {
  const [visible, setVisible] = useState(false);

  return (
    <Col span={16} className="home-page-left mb16">
      <Summarize
        formValue={formValue}
        data={summarizeData}
        onRefresh={onRefresh}
      />
      <CompanySummarize
        formValue={formValue}
        data={companySummarizeData}
        onRefresh={onRefresh}
      />

      {visible && (
        <AdvancedSearchModal
          visible={visible}
          onClose={() => setVisible(false)}
          flowTypeVal={extraState.flowTypeVal}
          setFlowTypeVal={extraState.setFlowTypeVal}
          paymentTypeVal={extraState.paymentTypeVal}
          setPaymentTypeVal={extraState.setPaymentTypeVal}
          tagVal={extraState.tagVal}
          setTagVal={extraState.setTagVal}
        />
      )}

      <YearBarChart
        formValue={formValue}
        extraState={extraState}
        visible={visible}
        categoryVal={categoryVal}
        setCategoryVal={setCategoryVal}
        setVisible={setVisible}
        data={yearBarChartData}
        onRefresh={onRefresh}
      />

      <div className="mt8 mb16">
        <TableSection
          formValue={formValue}
          extraState={extraState}
          visible={visible}
          setVisible={setVisible}
          categoryData={categoryData}
          onRefresh={onRefresh}
        />
      </div>
    </Col>
  );
}

export default LeftSection;

