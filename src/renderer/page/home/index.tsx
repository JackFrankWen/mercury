import React, { useEffect, useState } from 'react';
import { Button, Card, Row, Col } from 'antd';
import useReviewForm from './useReviewForm';
import TableSection from './reviewTable';
import Summarize from './review-sum';

import PieChart from '../../components/pieChart';
import { formatMoney } from '../../components/utils';
import YearBarChart from './yearBarChart';
import ConsumerChart from './consumerChart';
import AccountInfo from './accountInfo';
import './index.css';
import { useSearchParams } from 'react-router-dom';
function Index(): JSX.Element {

  const [formValue, cpt] = useReviewForm();
  const [searchParams] = useSearchParams();
  console.log(searchParams.get('year'), '===== home year');

  return (
    <Row gutter={12} className="home-page">
      <Col span={16} className="home-page-left mb16">
        <Summarize formValue={formValue} />
        <YearBarChart formValue={formValue} />
        <div className="mt8 mb16">
          <TableSection formValue={formValue} />
        </div>
      </Col>

      <Col span={8} className="home-page-right  mb16">
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
