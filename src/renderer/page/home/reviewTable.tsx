import { Card, Space, Select, theme } from 'antd';
import React, { useState } from 'react';
import { EllipsisOutlined, FilterFilled } from '@ant-design/icons';
import emitter from 'src/renderer/events';
import { CategoryReturnType } from 'src/preload/type';
import CategoryChartTab from './components/CategoryChartTab';
import CategoryDataTab from './components/CategoryDataTab';
import { cpt_const } from 'src/renderer/const/web';
import { ExtraControlsState } from './hooks/useLeftSectionData';

interface TableSectionProps {
  formValue: any;
  extraState: ExtraControlsState;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  categoryData: CategoryReturnType;
  onRefresh?: () => void;
}

function TableSection(props: TableSectionProps) {
  const { formValue, extraState, visible, setVisible, categoryData, onRefresh } = props;
  const { token } = theme.useToken();

  // 从 extraState 中解构出需要的状态
  const {
    accountTypeVal,
    setAccountTypeVal,
    consumerVal,
    setConsumerVal,
    paymentTypeVal,
    tagVal,
    flowTypeVal,
    hasSearchInModal
  } = extraState;

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
    tag: tagVal,
    flow_type: flowTypeVal,
  };

  // 控制组件
  const extraControls = (
    <Space>
      <Select
        allowClear
        value={accountTypeVal}
        onChange={setAccountTypeVal}
        placeholder="账户类型"
        options={cpt_const.account_type}
        style={{ minWidth: 100 }}
        mode="multiple"
      />
      <Select
        allowClear
        value={consumerVal}
        onChange={setConsumerVal}
        placeholder="消费者"
        options={cpt_const.consumer_type}
        style={{ minWidth: 100 }}
        mode="multiple"
      />
      {hasSearchInModal ? (
        <FilterFilled
          style={{
            color: token.colorPrimary,
            fontSize: 16,
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onClick={() => setVisible(true)}
        />
      ) : (
        <EllipsisOutlined
          style={{
            color: '#999',
            fontSize: 16,
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onClick={() => setVisible(true)}
        />
      )}
    </Space>
  );

  // 定义标签页内容
  const contentList: Record<'tab1' | 'tab2', React.ReactElement> = {
    tab1: <CategoryChartTab category={categoryData} formValue={fullFormValue} refreshTable={refreshTable} />,
    tab2: <CategoryDataTab category={categoryData} formValue={fullFormValue} refreshTable={refreshTable} />,
  };

  return (
    <Card
      hoverable
      bordered={false}
      tabBarExtraContent={extraControls}
      tabList={tabList}
      activeTabKey={activeTabKey}
      onTabChange={handleTabChange}
    >
      {contentList[activeTabKey]}
    </Card>
  );
}

export default TableSection;
