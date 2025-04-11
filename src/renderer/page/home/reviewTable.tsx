import { Card, Col, Row, Space, Flex, Tabs, Modal, message } from 'antd';
import React, { useState, useCallback } from 'react';
import CategoryTable from './categoryTable';
import { cpt_const } from 'src/renderer/const/web';
import DonutChart from 'src/renderer/components/donutChart';
import CategoryCollaspe from './categoryCollaspe';
import { useFresh } from 'src/renderer/components/useFresh';
import emitter from 'src/renderer/events';
import { category_type } from 'src/renderer/const/categroy';
import useExtraControls from 'src/renderer/components/useExtraControls';
import { CategoryReturnType } from 'src/preload/type';
import { log } from 'node:console';
import BarChart from 'src/renderer/components/barChart';
import { ModalContent } from './ModalContent';

// 写一个方法  CategoryReturnType中 child 每一条数据    转化成 PieChart 的 data 用reduce
// 转化 {value: item.child.value, name: item.child.name, type: item.    value}

function convertCategoryReturnTypeToPieChartData(category: CategoryReturnType) {
  console.log(category, '====category');

  return category.reduce((acc: any, item: any) => {
    item.child.forEach((child: any) => {
      acc.push({
        value: Number(child.value),
        name: child.name,
        type: item.name,
        category: child.category,
      });
    });
    return acc;
  }, []);
}

// 交易详情模态框组件
const TransactionModal = (props: {
  visible: boolean;
  category: string;
  formValue: any;
  onClose: () => void;
  refreshTable: () => void;
}) => {
  const { visible, category, formValue, onClose, refreshTable } = props;
  const [modalData, setModalData] = useState<any>([]);
  const [barData, setBarData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 获取交易详情数据
  const getTransactionDetails = async (data: any, category: string) => {
    if (!category) return;

    setLoading(true);
    try {
      const { trans_time } = data;
      const params = {
        ...data,
        category,
        trans_time,
      };

      const res = await window.mercury.api.getTransactions(params);
      if (res) {
        setModalData(res);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      message.error('获取交易数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取按月份统计数据（用于年度视图）
  const fetchBarData = async (obj: any) => {
    if (!obj) return;

    try {
      const result = await window.mercury.api.getTransactionsByMonth(obj);
      setBarData(result);
    } catch (error) {
      message.error(error);
    }
  };

  // 当modal显示且有选择的category时，获取数据
  useFresh(() => {
    if (category && visible) {
      getTransactionDetails(formValue, category);
    }
    if (formValue.type === 'year' && visible) {
      fetchBarData({
        category: category,
        trans_time: formValue.trans_time,
      });
    }
  }, [formValue, category, visible], 'transaction');

  // 刷新表格数据
  const refresh = () => {
    refreshTable();
    if (category) {
      getTransactionDetails(formValue, category);
    }
  };

  return (
    <Modal
      width={1000}
      closable={true}
      footer={null}
      open={visible}
      onCancel={onClose}
      title="交易详情"
    >
      {formValue.type === 'year' && <BarChart data={barData} />}
      {modalData.length > 0 && (
        <ModalContent
          loading={loading}
          onCancel={onClose}
          modalData={modalData}
          refresh={refresh}
        />
      )}
    </Modal>
  );
};

// 使用共享Modal的Tab1内容组件
const Tab2Content = ({ category, formValue, refreshTable }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const showModal = (category: string) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <DonutChart data={convertCategoryReturnTypeToPieChartData(category)} />
      <CategoryTable
        refreshTable={refreshTable}
        data={category}
        formValue={formValue}
        showModal={showModal}
        useSharedModal={true}
      />
      {modalVisible && (
        <TransactionModal
          visible={modalVisible}
          category={selectedCategory}
          formValue={formValue}
          onClose={closeModal}
          refreshTable={refreshTable}
        />
      )}
    </>
  );
};

// 使用共享Modal的Tab2内容组件
const Tab1Content = ({ category, formValue, refreshTable }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const showModal = (category: string) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div style={{ minHeight: '400px' }}>
      <CategoryCollaspe
        refreshTable={refreshTable}
        data={category}
        formValue={formValue}
        showModal={showModal}
        useSharedModal={true}
      />
      {modalVisible && (
        <TransactionModal
          visible={modalVisible}
          category={selectedCategory}
          formValue={formValue}
          onClose={closeModal}
          refreshTable={refreshTable}
        />
      )}
    </div>
  );
};

// 添加新的 props 类型定义
function TableSection(props: {
  formValue: any;
  extraState: any;
  extraComponent: React.ReactNode;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  const { formValue, extraState, extraComponent, visible, setVisible } = props;

  // 从 extraState 中解构出需要的状态
  const { categoryVal, accountTypeVal, consumerVal, paymentTypeVal, tagVal, PaymentTypeCpt, TagCpt } = extraState;

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
      console.log(result, '====result');

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
        payment_type: paymentTypeVal,
        category: categoryVal,
        tag: tagVal,
      });
    },
    [formValue, consumerVal, accountTypeVal, paymentTypeVal, categoryVal, tagVal],
    'transaction'
  );

  const refreshTable = () => {
    emitter.emit('refresh', 'transaction');
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

  // 定义标签页内容
  const contentList = {
    tab1: (
      <Tab1Content
        category={category}
        formValue={{
          ...formValue,
          consumer: consumerVal,
          account_type: accountTypeVal,
          payment_type: paymentTypeVal,
          category: categoryVal,
          tag: tagVal,
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
          payment_type: paymentTypeVal,
          category: categoryVal,
          tag: tagVal,
        }}
        refreshTable={refreshTable}
      />
    ),
  };

  return (
    <>
      {visible && (
        <Modal title="高级搜索" open={visible} onCancel={() => setVisible(false)} footer={null}>
          <Flex vertical gap={16}>
            {PaymentTypeCpt}
            {TagCpt}
          </Flex>
        </Modal>
      )}
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
    </>
  );
}

export default TableSection;
