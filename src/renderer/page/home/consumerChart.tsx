import React from 'react';
import PieChart from 'src/renderer/components/pieChart';
import { Card } from 'antd';
import { ConsumerData } from './types';

interface ConsumerChartProps {
  data: ConsumerData[];
  onRefresh?: () => void;
}

function ConsumerChart(props: ConsumerChartProps) {
  const { data } = props;

  return (
    <div className="mt8 mb16">
      <Card size="small" title="成员支出" bordered={false} hoverable>
        <PieChart data={data} />
      </Card>
    </div>
  );
}

export default ConsumerChart;
