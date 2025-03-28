import { Card, Col, Row, Space, Flex, Tabs } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import CategoryTable from './categoryTable';
import { useSelect } from '../../components/useSelect';
import { cpt_const, payment_type } from 'src/renderer/const/web';
import DonutChart from 'src/renderer/components/donutChart';
import { CategoryReturnType } from 'src/preload/index';
import CategoryCollaspe from './categoryCollaspe';
import { useFresh } from 'src/renderer/components/useFresh';
import emitter from 'src/renderer/events';
// 写一个方法  CategoryReturnType中 child 每一条数据    转化成 PieChart 的 data 用reduce
// 转化 {value: item.child.value, name: item.child.name, type: item.    value}

function convertCategoryReturnTypeToPieChartData(category: CategoryReturnType) {
  return category.reduce((acc: any, item: any) => {
    item.child.forEach((child: any) => {
      acc.push({
        value: Number(child.value),
        name: child.name,
        type: item.name,
      });
    });
    return acc;
  }, []);
}

// Tab1内容组件
const Tab2Content = ({ category, formValue, refreshTable }) => {
  return (
    <>
      <CategoryTable refreshTable={refreshTable} data={category} formValue={formValue} />
      <DonutChart data={convertCategoryReturnTypeToPieChartData(category)} />
    </>
  );
};

// Tab2内容组件
const Tab1Content = ({ category, formValue, refreshTable }) => {
  return (
    <div style={{ minHeight: '400px' }}>
      <CategoryCollaspe refreshTable={refreshTable} data={category} formValue={formValue} />
    </div>
  );
};

function TableSection(props: { formValue: any }) {
  const { formValue } = props;
  const [consumerVal, ConsumerCpt] = useSelect({
    options: cpt_const.consumer_type,
    placeholder: '消费者',
  });

  const [accountTypeVal, accountTypeCpt] = useSelect({
    options: cpt_const.account_type,
    placeholder: '账户类型',
  });
  const [paymentVal, PaymentCpt] = useSelect({
    options: cpt_const.payment_type,
    placeholder: '支付方式',
  });

  const [category, setCategory] = useState<CategoryReturnType>([]);
  const [activeTabKey, setActiveTabKey] = useState('tab1');

  const handleTabChange = key => {
    setActiveTabKey(key);
  };

  const getCategory = async (data: any) => {
    const { trans_time } = formValue;

    try {
      const result = await window.mercury.api.getCategoryTotalByDate({
        ...data,
        trans_time,
      });

      setCategory(result);
    } catch (error) {
      console.error(error);
    }
  };
  useFresh(
    () => {
      getCategory({
        ...formValue,
        consumer: consumerVal,
        account_type: accountTypeVal,
        payment_type: paymentVal,
      });
    },
    [formValue, consumerVal, accountTypeVal, paymentVal],
    'transaction'
  );

  const extra = (
    <>
      <Space>
        {accountTypeCpt}
        {ConsumerCpt}
        {PaymentCpt}
      </Space>
    </>
  );
  const refreshTable = useCallback(() => {
    // getCategory({
    //   ...formValue,
    //   consumer: consumerVal,
    //   account_type: accountTypeVal,
    //   payment_type: paymentVal,
    // });
    emitter.emit('refresh', 'transaction');
  }, [formValue, consumerVal, accountTypeVal, paymentVal]);

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

  // 定义标签页内容
  const contentList = {
    tab1: (
      <Tab1Content
        category={category}
        formValue={{
          ...formValue,
          consumer: consumerVal,
          account_type: accountTypeVal,
          payment_type: paymentVal,
        }}
        refreshTable={refreshTable}
      />
    ),
    tab2: (
      <Tab2Content
        category={category}
        formValue={{
          ...formValue,
          consumer: consumerVal,
          account_type: accountTypeVal,
          payment_type: paymentVal,
        }}
        refreshTable={refreshTable}
      />
    ),
  };

  return (
    <Card
      hoverable
      bordered={false}
      tabBarExtraContent={extra}
      tabList={tabList}
      activeTabKey={activeTabKey}
      onTabChange={handleTabChange}
    >
      {contentList[activeTabKey]}
    </Card>
  );
}
export default TableSection;
