import { Card } from 'antd';
import React, { useState } from 'react';
import emitter from 'src/renderer/events';
import { CategoryReturnType } from 'src/preload/type';
import CategoryChartTab from './components/CategoryChartTab';
import CategoryDataTab from './components/CategoryDataTab';

// 添加新的 props 类型定义
function TableSection(props: {
  formValue: any;
  extraState: any;
  extraComponent: React.ReactNode;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  categoryData: CategoryReturnType;
  onRefresh?: () => void;
}) {
  const { formValue, extraState, extraComponent, visible, setVisible, categoryData, onRefresh } = props;

  // 从 extraState 中解构出需要的状态
  const { categoryVal, accountTypeVal, consumerVal, paymentTypeVal, tagVal, PaymentTypeCpt, TagCpt, FlowTypeCpt, flowTypeVal, } = extraState;

  const [activeTabKey, setActiveTabKey] = useState<'tab1' | 'tab2'>('tab1');

  const handleTabChange = (key: string) => {
    setActiveTabKey(key as 'tab1' | 'tab2');
  };

  const refreshTable = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      emitter.emit('refresh', 'transaction');
    }
  };

  // 定义标签页配置
  const tabList = [
    {
      key: 'tab1',
      tab: '图表',
    },
    {
      key: 'tab2',
      tab: '数据',
    },
  ];

  // 构建完整的 formValue 对象
  const fullFormValue = {
    ...formValue,
    consumer: consumerVal,
    account_type: accountTypeVal,
    payment_type: paymentTypeVal,
    category: categoryVal,
    tag: tagVal,
    flow_type: flowTypeVal,
  };

  // 定义标签页内容
  const contentList: Record<'tab1' | 'tab2', React.ReactElement> = {
    tab1: <CategoryChartTab category={categoryData} formValue={fullFormValue} refreshTable={refreshTable} />,
    tab2: <CategoryDataTab category={categoryData} formValue={fullFormValue} refreshTable={refreshTable} />,
  };

  return (
    <Card
      hoverable
      bordered={false}
      tabBarExtraContent={extraComponent}
      tabList={tabList}
      activeTabKey={activeTabKey}
      onTabChange={handleTabChange}
    >
      {contentList[activeTabKey]}
    </Card>
  );
}

export default TableSection;
