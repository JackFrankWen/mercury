import React, { useEffect, useState } from 'react';
import BarChart from 'src/renderer/components/barChart';
import { Card, message, Space } from 'antd';
import { useSelect } from '../../components/useSelect';
import { cpt_const } from 'src/renderer/const/web';
import LunarCalendar from './lunarCalendar';
import { FormData } from './useReviewForm';
import { useFresh } from 'src/renderer/components/useFresh';

function YearBarChart(props: { formValue: FormData }) {
  const { formValue } = props;
  const [data, setData] = useState<{ date: string; total: number }[]>([]);
  const [daliyData, setDaliyData] = useState<{ date: string; total: number }[]>(
    [],
  );

  const [consumerVal, ConsumerCpt] = useSelect({
    options: cpt_const.consumer_type,
    placeholder: '消费者',
  });
  const [accountTypeVal, AccountTypeCpt] = useSelect({
    options: cpt_const.account_type,
    placeholder: '账户类型',
  });
  const [paymentTypeVal, PaymentTypeCpt] = useSelect({
    options: cpt_const.payment_type,
    placeholder: '支付方式',
  });

  useFresh(() => {
    if (formValue.type === 'year') {
      fetchData({
        ...formValue,
        consumer: consumerVal,
        account_type: accountTypeVal,
        payment_type: paymentTypeVal,
      });
    } else {
      fetchDailyAmount({
        ...formValue,
        consumer: consumerVal,
        account_type: accountTypeVal,
        payment_type: paymentTypeVal,
      });
    }
  }, [formValue, consumerVal, accountTypeVal, paymentTypeVal]);

  const extra = (
    <Space>
      {AccountTypeCpt}
      {ConsumerCpt}
      {PaymentTypeCpt}
    </Space>
  );
  const fetchData = async (obj) => {
    if (!obj) return;

    try {
      const result = await window.mercury.api.getTransactionsByMonth(obj);
      setData(result);
    } catch (error) {
      message.error(error);
    }
  };
  const fetchDailyAmount = async (obj) => {
    try {
      const result = await window.mercury.api.getDailyTransactionAmounts(obj);
      console.log(result, 'fetchDailyAmount');
      setDaliyData(result);
    } catch (error) {
      message.error(error);
    }
  };
  const cardTitle = () => {
    if (formValue.type === 'year') {
      return '年消费';
    } else if (formValue.type === 'month') {
      return '月度消费';
    }
  };
  return (
    <div className="mt8">
      <Card title={cardTitle()} bordered={false} hoverable extra={extra}>
        {formValue.type === 'year' ? (
          <BarChart data={data} hasElementClick={true} />
        ) : (
          <LunarCalendar
            formValue={{
              ...formValue,
              consumer: consumerVal,
              account_type: accountTypeVal,
              payment_type: paymentTypeVal,
            }}
            data={daliyData}
            refresh={() =>
              fetchDailyAmount({
                ...formValue,
                consumer: consumerVal,
                account_type: accountTypeVal,
                payment_type: paymentTypeVal,
              })
            }
          />
        )}
      </Card>
    </div>
  );
}

export default YearBarChart;
