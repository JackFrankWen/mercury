import React from 'react';
import { Row } from 'antd';
import { useFormData } from './hooks/useFormData';
import { useRightSectionData } from './hooks/useRightSectionData';
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

  return (
    <Row gutter={12} className="home-page">
      <LeftSection formValue={formValue} />
      <RightSection
        formValue={formValue}
        onFormChange={setFormValue}
        accountData={accountData}
        consumerData={consumerData}
        onRefresh={refreshRightSectionData}
      />
    </Row>
  );
}

export default Index;

