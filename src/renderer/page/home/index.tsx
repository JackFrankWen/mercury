import React, { useEffect, useState } from 'react';
import { Button, Card, Row, Col, Modal, Flex } from 'antd';
import useReviewForm from './useReviewForm';
import TableSection from './reviewTable';
import Summarize from './review-sum';
import PieChart from '../../components/pieChart';
import { formatMoney } from '../../components/utils';
import YearBarChart from './yearBarChart';
import ConsumerChart from './consumerChart';
import AccountInfo from './accountInfo';
import CompanySummarize from './companySummarize';
import './index.css';
import { useSearchParams } from 'react-router-dom';
import useExtraControls from '../../components/useExtraControls';
import { category_type } from '../../const/categroy';

function Index(): JSX.Element {
  const [formValue, cpt] = useReviewForm();
  const [visible, setVisible] = useState(false);

  // 在父组件中调用 useExtraControls 并将结果传递给子组件
  const [extraComponent, extraState] = useExtraControls({
    category_type,
    onFilterClick: () => setVisible(true),
  });
  const { FlowTypeCpt, PaymentTypeCpt, TagCpt } = extraState;

  return (
    <Row gutter={12} className="home-page">
      <Col span={16} className="home-page-left mb16">
        <Summarize formValue={formValue} />
        <CompanySummarize formValue={formValue} />

        {/* 传递 extraState 和 visible 状态给子组件 */}
        {visible && (
          <Modal title="高级搜索" open={visible} onCancel={() => setVisible(false)} footer={null}>
            <Flex vertical gap={16}>
              {FlowTypeCpt}
              {PaymentTypeCpt}
              {TagCpt}
            </Flex>
          </Modal>
        )}
        <YearBarChart
          formValue={formValue}
          extraState={extraState}
          extraComponent={extraComponent}
          visible={visible}
          setVisible={setVisible}
        />

        <div className="mt8 mb16">
          <TableSection
            formValue={formValue}
            extraState={extraState}
            extraComponent={extraComponent}
            visible={visible}
            setVisible={setVisible}
          />
        </div>
      </Col>

      <Col span={8} className="home-page-right mb16">
        <Card size="small" bordered={false} hoverable>
          {cpt}
        </Card>
        <AccountInfo formValue={formValue} />
        <ConsumerChart formValue={formValue} />
      </Col>
    </Row>
  );
}

export default Index;
