import React from 'react';
import { Row } from 'antd';
import { useFormData } from './hooks/useFormData';
import { useRightSectionData } from './hooks/useRightSectionData';
import { useLeftSectionData } from './hooks/useLeftSectionData';
import LeftSection from './components/LeftSection';
import RightSection from './components/RightSection';
import './index.css';

/**
 * 首页主组件
 * 展示财务数据的概览和详细统计信息
 */
function Index(): JSX.Element {
  const [formValue, setFormValue] = useFormData();

  const { accountData, consumerData, refreshRightSectionData } = useRightSectionData(formValue);
  const {
    summarizeData,
    companySummarizeData,
    yearBarChartData,
    categoryData,
    categoryVal,
    setCategoryVal,
    refreshLeftSectionData,
    extraState,
  } = useLeftSectionData(formValue);


  const onRefresh = () => {
    refreshLeftSectionData();
    refreshRightSectionData();
  };
  return (
    <Row gutter={12} className="home-page">
      <LeftSection
        formValue={formValue}
        extraState={extraState}
        summarizeData={summarizeData}
        companySummarizeData={companySummarizeData}
        yearBarChartData={yearBarChartData}
        categoryData={categoryData}
        categoryVal={categoryVal}
        setCategoryVal={setCategoryVal}

        onRefresh={onRefresh}
      />
      <RightSection
        formValue={formValue}
        onFormChange={setFormValue}
        accountData={accountData}
        consumerData={consumerData}
        onRefresh={onRefresh}
      />
    </Row>
  );
}

export default Index;

