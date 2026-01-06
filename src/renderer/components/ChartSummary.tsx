import React from 'react';
import { Typography } from 'antd';
import { formatMoney } from './utils';

interface ChartSummaryProps {
  data: { total: number }[];
  flowTypeVal: number;
  type: 'monthly' | 'daily';
}

function ChartSummary({ data, flowTypeVal, type }: ChartSummaryProps) {
  if (data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + item.total, 0);
  const flowType = flowTypeVal === 1 ? '支出' : '收入';

  if (type === 'monthly') {
    const validMonths = data.filter(item => item.total > 0);
    const average = total / validMonths.length;
    return (
      <div className="chart-summary">
        <Typography.Text type="secondary">
          月均{flowType} ¥{formatMoney(average)}
        </Typography.Text>
      </div>
    );
  } else if (type === 'daily') {
    const dailyAverage = total / data.length;
    return (
      <div className="chart-summary">
        <Typography.Text type="secondary" style={{ marginRight: '8px' }}>
          本月{flowType}：¥{formatMoney(total)}
        </Typography.Text>
        <Typography.Text type="secondary">
          日均{flowType}：¥{formatMoney(dailyAverage)}
        </Typography.Text>
      </div>
    );
  }

  return null;
}

export default ChartSummary;
