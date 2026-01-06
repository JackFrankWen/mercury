import React from 'react';

interface ChartCardTitleProps {
  flowTypeVal: number;
  type: string;
}

function ChartCardTitle({ flowTypeVal, type }: ChartCardTitleProps) {
  const flowType = flowTypeVal === 1 ? '支出' : '收入';
  if (type === 'year') {
    return <>年{flowType}</>;
  } else if (type === 'month') {
    return <>月度{flowType}</>;
  }
  return <>{flowType}</>;
}

export default ChartCardTitle;
