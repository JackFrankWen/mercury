import React, { useEffect, useState } from 'react';
import { EllipsisOutlined, FilterFilled } from '@ant-design/icons';
import BarChart from 'src/renderer/components/barChart';
import { Card, Cascader, Flex, message, Modal, Space, theme, Typography } from 'antd';
import LunarCalendar from './lunarCalendar';
import { FormData } from './useReviewForm';
import { useFresh } from 'src/renderer/components/useFresh';
import emitter from 'src/renderer/events';
import { category_type } from 'src/renderer/const/categroy';
import { DefaultOptionType } from 'antd/es/cascader';
import { renderIcon } from 'src/renderer/components/FontIcon';
import { formatMoney } from 'src/renderer/components/utils';
import { EXPENSE_COLOR, INCOME_COLOR } from 'src/renderer/const/colors';
function YearBarChart(props: {
  formValue: FormData;
  extraState: any;
  extraComponent: React.ReactNode;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  const { formValue, extraState, extraComponent, visible, setVisible } = props;
  const [data, setData] = useState<{ date: string; total: number }[]>([]);
  const [daliyData, setDaliyData] = useState<{ date: string; total: number }[]>([]);
  const [year, setYear] = useState('');
  const [categoryVal, setCategoryVal] = useState<string[]>([]);
  const [monthlyAverage, setMonthlyAverage] = useState<number>(0);

  const { accountTypeVal, consumerVal, paymentTypeVal, tagVal, PaymentTypeCpt, TagCpt, FlowTypeCpt, flowTypeVal } =
    extraState;

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
          flow_type: flowTypeVal,
        });
      } else {
        fetchDailyAmount({
          ...formValue,
          consumer: consumerVal,
          account_type: accountTypeVal,
          payment_type: paymentTypeVal,
          tag: tagVal,
          category: categoryVal,
          flow_type: flowTypeVal,
        });
      }
    },
    [formValue, consumerVal, accountTypeVal, paymentTypeVal, tagVal, categoryVal, flowTypeVal],
    'transaction'
  );

  useEffect(() => {
    if (data.length > 0) {
      const totolMonth = data.filter(item => item.total > 0);
      const total = data.reduce((sum, item) => sum + item.total, 0);
      const average = total / totolMonth.length;
      setMonthlyAverage(average);
    }
  }, [data]);

  const fetchData = async (obj: any) => {
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
    const flowType = flowTypeVal === 1 ? '支出' : '收入';
    if (formValue.type === 'year') {
      return `年${flowType}`;
    } else if (formValue.type === 'month') {
      return `月度${flowType}`;
    }
  };

  const refresh = () => {
    emitter.emit('refresh', 'transaction');
  };
  const extra = (
    <Space>
      <Cascader
        options={category_type}
        allowClear
        multiple
        value={categoryVal}
        style={{ width: '100px' }}
        onChange={val => setCategoryVal(val as string[])}
        placeholder="分类"
        showSearch={{
          filter: (inputValue: string, path: DefaultOptionType[]) =>
            path.some(
              option =>
                (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1
            ),
        }}
      />
      {extraComponent}
    </Space>
  );
  return (
    <div className="mt8">
      <Card title={cardTitle()} bordered={false} hoverable extra={extra}>
        {/* {visible && (
          <Modal title="高级搜索" open={visible} onCancel={() => setVisible(false)} footer={null}>
            <Flex vertical gap={16}>
              {PaymentTypeCpt}
              {TagCpt}
              {FlowTypeCpt}
            </Flex>
          </Modal>
        )} */}
        {formValue.type === 'year' ? (
          <>
            <BarChart flowTypeVal={flowTypeVal} data={data} hasElementClick={true} setYear={setYear} />
            {data.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '8px', marginBottom: '-8px' }}>
                <Typography.Text type="secondary">
                  {
                    flowTypeVal === 1 ? '月均支出' : '月均收入'
                  }
                  ¥{formatMoney(monthlyAverage)}
                </Typography.Text>
              </div>
            )}
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
                flow_type: flowTypeVal,
              }}
              data={daliyData}
              refresh={refresh}
            />
            {daliyData.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '8px', marginBottom: '-8px' }}>
                <Typography.Text type="secondary" style={{ marginRight: '8px' }}>
                  本月{flowTypeVal === 1 ? '支出' : '收入'}：¥{formatMoney(daliyData.reduce((sum, item) => sum + item.total, 0))}
                </Typography.Text>
                <Typography.Text type="secondary">
                  日均{flowTypeVal === 1 ? '支出' : '收入'}：¥
                  {formatMoney(
                    daliyData.reduce((sum, item) => sum + item.total, 0) / daliyData.length
                  )}
                </Typography.Text>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

export default YearBarChart;
