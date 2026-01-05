import React, { useState } from 'react';
import { Row } from 'antd';
import { useFormData } from './hooks/useFormData';
import useExtraControls from '../../components/useExtraControls';
import LeftSection from './components/LeftSection';
import RightSection from './components/RightSection';
import './index.css';

/**
 * 首页主组件
 * 展示财务数据的概览和详细统计信息
 */
function Index(): JSX.Element {
  const [formValue, setFormValue] = useFormData();
  const [visible, setVisible] = useState(false);

  const [extraComponent, extraState] = useExtraControls({
    onFilterClick: () => setVisible(true),
  });

  return (
    <Row gutter={12} className="home-page">
      <LeftSection
        formValue={formValue}
        extraState={extraState}
        extraComponent={extraComponent}
        visible={visible}
        setVisible={setVisible}
      />
      <RightSection
        formValue={formValue}
        onFormChange={setFormValue}
      />
    </Row>
  );
}

export default Index;
