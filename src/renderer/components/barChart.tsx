import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import { formatMoney } from './utils';
interface LineChartProps {
    data: {
        date: string,
        total: number
    }[]
    height?: number
}

const LineChart: React.FC<LineChartProps> = ({ data, height = 150 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;


    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: height,
    });

    chart.data(data);

    // 配置 y 轴：显示轴线但不显示刻度
    chart.axis('total', {
      label: null,  // 使用 null 而不是 false
      line: null,   // 使用 null 而不是 false
      tickLine: null  // 使用 null 而不是 false
    });
    //tooltip 显示金额

    chart.tooltip({
      showMarkers: false,
      showTitle: true,
      customItems: (items) => {
        return items.map(item => {
          return {
            ...item,
            value: `${formatMoney(item.data.total, '万')}`
          }
        })
      }
      // customContent: (title, items) => {
      //   const item = items[0];
      //   if (!item) return '';
      //   return `${formatMoney(item.data.total, '万')}`;
      // }
    });
    chart.interaction('active-region');

    chart
      .interval()
      .position('date*total')
      .style({ radius: [20, 20, 0, 0] })
      .label('total', {
        offset: 5,
        content: (data) => {
         
          return `${formatMoney(data.total, '万')}`;
        },
        style: {
          fill: '#666',
          fontSize: 12
        }
      });

    chart.render();

    // 清理函数
    return () => {
      chart.destroy();
    };
  }, [data]); // 空依赖数组，仅在组件挂载时执行

  return <div ref={containerRef}></div>;
};

export default LineChart;