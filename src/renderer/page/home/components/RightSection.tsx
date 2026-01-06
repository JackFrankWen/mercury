import React from 'react';
import { Col, Card } from 'antd';
import AccountInfo from '../accountInfo';
import ConsumerChart from '../consumerChart';
import DateSelector from './DateSelector';
import { FormData } from '../hooks/useFormData';
import { AccountPaymentData, ConsumerData } from '../types';

interface RightSectionProps {
  formValue: FormData;
  onFormChange: (val: FormData) => void;
  accountData: AccountPaymentData[];
  consumerData: ConsumerData[];
  onRefresh: () => void;
}

/**
 * 首页右侧内容区域
 * 包含日期选择器、账户信息和消费者图表
 */
function RightSection({
  formValue,
  onFormChange,
  accountData,
  consumerData,
  onRefresh
}: RightSectionProps): JSX.Element {
  return (
    <Col span={8} className="home-page-right mb16">
      <Card size="small" bordered={false} hoverable>
        <DateSelector value={formValue} onChange={onFormChange} />
      </Card>
      <AccountInfo data={accountData} onRefresh={onRefresh} />
      <ConsumerChart data={consumerData} onRefresh={onRefresh} />
    </Col>
  );
}

export default RightSection;

