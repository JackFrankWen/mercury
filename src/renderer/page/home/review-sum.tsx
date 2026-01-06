import { Card, Col, Row, Statistic } from 'antd';
import React from 'react';
import { formatMoneyObj } from 'src/renderer/components/utils';

interface StaticData {
  income: number; // 总收入
  cost: number; // 总支出
  balance: number; // 结余
}

interface SummarizeProps {
  formValue: any;
  data: StaticData;
  onRefresh?: () => void;
}

export default function Summarize(props: SummarizeProps) {
  const { data } = props;

  return (
    <>
      <Row className="home-section mb8" justify="space-between" gutter={12}>
        <Col span={8}>
          <Card hoverable size="small">
            <Statistic
              title="总收入"
              prefix="¥"
              value={formatMoneyObj({
                amount: data.income,
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
                amount: data.cost,
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
                amount: data.balance,
                decimalPlaces: 0,
              })}
            />


          </Card>

        </Col>

      </Row>
    </>
  );
}
