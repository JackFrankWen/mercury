import React, { useEffect, useState } from 'react';
import { EllipsisOutlined, FilterFilled } from '@ant-design/icons';
import BarChart from 'src/renderer/components/barChart';
import { Card, Flex, message, Modal, Space, theme, Typography } from 'antd';
import LunarCalendar from './lunarCalendar';
import { FormData } from './useReviewForm';
import emitter from 'src/renderer/events';
import { YearBarChartData } from './types';
import ChartCardTitle from 'src/renderer/components/ChartCardTitle';
import ChartSummary from 'src/renderer/components/ChartSummary';
import BackToYearButton from 'src/renderer/components/BackToYearButton';
import CategoryFilter from 'src/renderer/components/CategoryFilter';

function YearBarChart(props: {
  formValue: FormData;
  extraState: any;
  extraComponent: React.ReactNode;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  data: YearBarChartData;
  onRefresh?: () => void;
}) {
  const { formValue, extraState, extraComponent, data: propsData, onRefresh } = props;
  const [year, setYear] = useState('');
  const [categoryVal, setCategoryVal] = useState<string[]>([]);

  const { accountTypeVal, consumerVal, paymentTypeVal, tagVal, PaymentTypeCpt, TagCpt, FlowTypeCpt, flowTypeVal } =
    extraState;

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
      {extraComponent}
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
                category: categoryVal.join(','),
                flow_type: flowTypeVal,
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
