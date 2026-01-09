import React from 'react';
import { Col, Card } from 'antd';
import AccountInfo from '../accountInfo';
import ConsumerChart from '../consumerChart';
import CompanySummarize from '../companySummarize';
import DateSelector from './DateSelector';
import { FormData } from '../hooks/useFormData';
import { AccountPaymentData, ConsumerData, CompanySummarizeData } from '../types';

interface RightSectionProps {
  formValue: FormData;
  onFormChange: (val: FormData) => void;
  accountData: AccountPaymentData[];
  consumerData: ConsumerData[];
  companySummarizeData: CompanySummarizeData;
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
  companySummarizeData,
  onRefresh
}: RightSectionProps): JSX.Element {
  return (
    <Col span={8} className="home-page-right mb16">
      <Card size="small" bordered={false} hoverable className='mb8'>
        <DateSelector value={formValue} onChange={onFormChange} />
      </Card>
      <CompanySummarize
        formValue={formValue}
        data={companySummarizeData}
        onRefresh={onRefresh}
      />
      <AccountInfo data={accountData} onRefresh={onRefresh} />
      <ConsumerChart data={consumerData} onRefresh={onRefresh} />
    </Col>
  );
}

export default RightSection;

