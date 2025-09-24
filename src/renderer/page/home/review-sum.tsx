import { Card, Col, Row, Statistic } from 'antd';
import React, { useState } from 'react';
import { formatMoneyObj } from 'src/renderer/components/utils';
import { useFresh } from 'src/renderer/components/useFresh';

const FLOW_TYPE_COST = 1; // 支出
const FLOW_TYPE_INCOME = 2; // 收入

interface StaticData {
  income: number; // 总收入
  cost: number; // 总支出
  balance: number; // 结余
}

interface SummarizeProps {
  formValue: any;
}

export default function Summarize(props: SummarizeProps) {
  const { formValue } = props;
  const [staticData, setStaticData] = useState<StaticData>({
    income: 0,
    cost: 0,
    balance: 0,
  });

  const getSummarize = async (obj: any) => {
    try {
      // 并行获取收入和支出数据
      const [costRes, incomeRes] = await Promise.all([
        // 支出
        window.mercury.api.getAccountTotal({
          ...obj,
          flow_type: FLOW_TYPE_COST,
        }),
        // 收入
        window.mercury.api.getAccountTotal({
          ...obj,
          flow_type: FLOW_TYPE_INCOME,
        }),
      ]);

      // 通用计算函数
      const calculateTotal = (data: any[]): number => {
        if (!Array.isArray(data)) {
          console.warn('数据格式不正确，期望数组格式');
          return 0;
        }

        return data.reduce((acc: number, item: any) => {
          if (!item || typeof item.total === 'undefined') {
            return acc;
          }
          const total = Number(item.total) || 0;
          acc += Math.floor(total);
          return acc;
        }, 0);
      };

      // 计算各项数据
      const totalIncome = calculateTotal(incomeRes);
      const totalCost = calculateTotal(costRes);
      const balance = totalIncome - totalCost;

      setStaticData({
        income: totalIncome,
        cost: totalCost,
        balance: balance,
      });
    } catch (error) {
      console.error('获取汇总数据失败:', error);
    }
  };

  useFresh(
    () => {
      getSummarize(formValue);
    },
    [formValue],
    'transaction'
  );

  return (
    <>
      <Row className="home-section mb8" justify="space-between" gutter={12}>
        <Col span={8}>
          <Card hoverable size="small">
            <Statistic
              title="总收入"
              prefix="¥"
              value={formatMoneyObj({
                amount: staticData.income,
                decimalPlaces: 0,
              })}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable size="small">
            <Statistic
              title="总支出"
              prefix="¥"
              value={formatMoneyObj({
                amount: staticData.cost,
                decimalPlaces: 0,
              })}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable size="small">
            <Statistic
              title="结余"
              prefix="¥"
              value={formatMoneyObj({
                amount: staticData.balance,
                decimalPlaces: 0,
              })}
            />


          </Card>

        </Col>

      </Row>
    </>
  );
}
