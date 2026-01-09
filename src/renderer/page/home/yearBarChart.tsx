import React, { useEffect, useState } from 'react';
import { EllipsisOutlined, FilterFilled } from '@ant-design/icons';
import BarChart from 'src/renderer/components/barChart';
import { Card, Flex, message, Modal, Space, theme, Typography, Select } from 'antd';
import LunarCalendar from './lunarCalendar';
import { FormData } from './useReviewForm';
import emitter from 'src/renderer/events';
import { YearBarChartData } from './types';
import ChartCardTitle from 'src/renderer/components/ChartCardTitle';
import ChartSummary from 'src/renderer/components/ChartSummary';
import BackToYearButton from 'src/renderer/components/BackToYearButton';
import CategoryFilter from 'src/renderer/components/CategoryFilter';
import { cpt_const } from 'src/renderer/const/web';

interface YearBarChartProps {
  formValue: FormData;
  extraState: any;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  data: YearBarChartData;
  categoryVal: string[];
  setCategoryVal: (val: string[]) => void;
  onRefresh?: () => void;
}

function YearBarChart(props: YearBarChartProps) {
  const { formValue, extraState, data: propsData, categoryVal, setCategoryVal, onRefresh, visible, setVisible } = props;
  const [year, setYear] = useState('');
  const { token } = theme.useToken();

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

  const data = propsData.monthlyData;
  const daliyData = propsData.dailyData;

  const refresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      emitter.emit('refresh', 'transaction');
    }
  };

  const extra = (
    <Space>
      <CategoryFilter value={categoryVal} onChange={setCategoryVal} />
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
  return (
    <div className="mt8">
      <Card
        title={<ChartCardTitle flowTypeVal={flowTypeVal} type={formValue.type} />}
        bordered={false}
        hoverable
        extra={extra}
      >

        {formValue.type === 'year' ? (
          <>
            <BarChart flowTypeVal={flowTypeVal} data={data} hasElementClick={true} setYear={setYear} />
            <ChartSummary data={data} flowTypeVal={flowTypeVal} type="monthly" />
          </>
        ) : (
          <>
            <BackToYearButton
              year={year}
              onClick={() => {
                setYear('');
                emitter.emit('updateDate', {
                  date: year,
                  trans_time: [`${year}-01-01 00:00:00`, `${year}-12-31 23:59:59`],
                  type: 'year',
                });
              }}
            />

            <LunarCalendar
              formValue={{
                ...formValue,
                consumer: consumerVal,
                account_type: accountTypeVal,
                payment_type: paymentTypeVal,
                flow_type: flowTypeVal,
                category: categoryVal,
              }}
              data={daliyData}
              refresh={refresh}
            />
            <ChartSummary data={daliyData} flowTypeVal={flowTypeVal} type="daily" />
          </>
        )}
      </Card>
    </div>
  );
}

export default YearBarChart;
