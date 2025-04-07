import React, { useEffect, useMemo, useState } from 'react';
import { EllipsisOutlined, FilterFilled } from '@ant-design/icons';
import BarChart from 'src/renderer/components/barChart';
import { Card, Cascader, Flex, message, Modal, Space, theme } from 'antd';
import { useSelect } from '../../components/useSelect';
import { cpt_const, payment_type } from 'src/renderer/const/web';
import LunarCalendar from './lunarCalendar';
import { FormData } from './useReviewForm';
import { useFresh } from 'src/renderer/components/useFresh';
import emitter from 'src/renderer/events';
import { category_type } from 'src/renderer/const/categroy';
import { DefaultOptionType } from 'antd/es/cascader';
import { renderIcon } from 'src/renderer/components/FontIcon';
import useExtraControls from 'src/renderer/components/useExtraControls';

function YearBarChart(props: { formValue: FormData }) {
  const { formValue } = props;
  const { token } = theme.useToken();
  const [data, setData] = useState<{ date: string; total: number }[]>([]);
  const [daliyData, setDaliyData] = useState<{ date: string; total: number }[]>([]);
  const [visible, setVisible] = useState(false);
  const [year, setYear] = useState('');

  const [
    extraComponent,
    { categoryVal, accountTypeVal, consumerVal, paymentTypeVal, tagVal, PaymentTypeCpt, TagCpt },
  ] = useExtraControls({
    category_type,
    onFilterClick: () => setVisible(true),
  });

  useFresh(
    () => {
      if (formValue.type === 'year') {
        fetchData({
          ...formValue,
          consumer: consumerVal,
          account_type: accountTypeVal,
          payment_type: paymentTypeVal,
          category: categoryVal,
          tag: tagVal,
        });
      } else {
        fetchDailyAmount({
          ...formValue,
          consumer: consumerVal,
          account_type: accountTypeVal,
          payment_type: paymentTypeVal,
          tag: tagVal,
          category: categoryVal,
        });
      }
    },
    [formValue, consumerVal, accountTypeVal, paymentTypeVal, tagVal, categoryVal],
    'transaction'
  );

  const fetchData = async obj => {
    if (!obj) return;

    try {
      const result = await window.mercury.api.getTransactionsByMonth(obj);
      setData(result);
    } catch (error) {
      message.error(error);
    }
  };
  const fetchDailyAmount = async (obj: any) => {
    try {
      const result = await window.mercury.api.getDailyTransactionAmounts(obj);
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
  const refresh = () => {
    emitter.emit('refresh', 'transaction');
  };
  console.log(visible, 'aaaa====');
  return (
    <div className="mt8">
      <Card title={cardTitle()} bordered={false} hoverable extra={extraComponent}>
        {visible && (
          <Modal title="高级搜索" open={visible} onCancel={() => setVisible(false)} footer={null}>
            <Flex vertical gap={16}>
              {PaymentTypeCpt}
              {TagCpt}
            </Flex>
          </Modal>
        )}
        {formValue.type === 'year' ? (
          <>
            <BarChart data={data} hasElementClick={true} setYear={setYear} />
          </>
        ) : (
          <>
            {year && (
              <Flex justify="center">
                <span
                  style={{
                    cursor: 'pointer',
                    padding: '4px 10px',
                    marginTop: -14,
                    borderRadius: 8,
                    background: '#f5f5f5',
                    color: '#888888',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  }}
                  onClick={() => {
                    setYear('');
                    emitter.emit('updateDate', {
                      date: year,
                      trans_time: [`${year}-01-01 00:00:00`, `${year}-12-31 23:59:59`],
                      type: 'year',
                    });
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = '#ececec')}
                  onMouseOut={e => (e.currentTarget.style.background = '#f5f5f5')}
                >
                  {renderIcon('fas fa-arrow-rotate-left', '#888888')}
                  返回年度
                </span>
              </Flex>
            )}

            <LunarCalendar
              formValue={{
                ...formValue,
                consumer: consumerVal,
                account_type: accountTypeVal,
                payment_type: paymentTypeVal,
                category: categoryVal,
                tag: tagVal,
              }}
              data={daliyData}
              refresh={refresh}
            />
          </>
        )}
      </Card>
    </div>
  );
}

export default YearBarChart;
