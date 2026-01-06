import React, { useState } from 'react';
import { Col } from 'antd';
import TableSection from '../reviewTable';
import Summarize from '../review-sum';
import YearBarChart from '../yearBarChart';
import CompanySummarize from '../companySummarize';
import AdvancedSearchModal from './AdvancedSearchModal';
import { FormData } from '../hooks/useFormData';
import ExtraControls from '../../../components/ExtraControls';
import { CategoryReturnType } from 'src/preload/type';

interface SummarizeData {
  income: number;
  cost: number;
  balance: number;
}

interface CompanySummarizeData {
  income: number;
  cost: number;
  balance: number;
  incomeTotal: number;
  costTotal: number;
  balanceTotal: number;
}

interface YearBarChartData {
  monthlyData: { date: string; total: number }[];
  dailyData: { date: string; total: number }[];
}

interface LeftSectionProps {
  formValue: FormData;
  extraState: any;
  summarizeData: SummarizeData;
  companySummarizeData: CompanySummarizeData;
  yearBarChartData: YearBarChartData;
  categoryData: CategoryReturnType;
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
  onRefresh,
}: LeftSectionProps): JSX.Element {
  const [visible, setVisible] = useState(false);

  const extraComponent = (
    <ExtraControls
      accountTypeCpt={extraState.AccountTypeCpt}
      consumerCpt={extraState.ConsumerCpt}
      hasSearchInModal={extraState.hasSearchInModal}
      onFilterClick={() => setVisible(true)}
    />
  );

  const { FlowTypeCpt, PaymentTypeCpt, TagCpt } = extraState;

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
        data={yearBarChartData}
        onRefresh={onRefresh}
      />

      <div className="mt8 mb16">
        <TableSection
          formValue={formValue}
          extraState={extraState}
          extraComponent={extraComponent}
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

