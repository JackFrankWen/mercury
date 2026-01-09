import React, { useState, useMemo } from 'react';
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

  // 额外控制状态
  const [accountTypeVal, setAccountTypeVal] = useState<number[]>();
  const [consumerVal, setConsumerVal] = useState<number[]>();
  const [paymentTypeVal, setPaymentTypeVal] = useState<number>();
  const [flowTypeVal, setFlowTypeVal] = useState<number>(1);
  const [tagVal, setTagVal] = useState<number>();

  const hasSearchInModal = useMemo(() => {
    if (!paymentTypeVal && !tagVal) {
      return false;
    }
    return true;
  }, [paymentTypeVal, tagVal]);

  const extraState = {
    accountTypeVal,
    setAccountTypeVal,
    consumerVal,
    setConsumerVal,
    paymentTypeVal,
    setPaymentTypeVal,
    flowTypeVal,
    setFlowTypeVal,
    tagVal,
    setTagVal,
    hasSearchInModal,
  };

  const { accountData, consumerData, refreshRightSectionData } = useRightSectionData(formValue);
  const {
    summarizeData,
    companySummarizeData,
    yearBarChartData,
    categoryData,
    categoryVal,
    setCategoryVal,
    refreshLeftSectionData
  } = useLeftSectionData(formValue, extraState);


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

