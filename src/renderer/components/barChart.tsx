import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import { formatMoney } from './utils';
import emitter from '../events';
interface LineChartProps {
  data: {
    date: string;
    total: number;
  }[];
  height?: number;
  hasElementClick?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({ data, height = 150, hasElementClick = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: height,
    });

    chart.data(data);
    chart.scale('total', {
      nice: true,
    });

    // 配置 x 轴：将日期格式转换为"月"
    chart.axis('date', {
      label: {
        formatter: text => {
          return Number(text.split('-')[1]) + '月';
        },
      },
    });

    // 配置 y 轴：显示轴线但不显示刻度
    chart.axis('total', {
      line: null,
      tickLine: null,
      label: {
        formatter: text => {
          // 自动判断使用千或万
          if (Number(text) >= 10000) {
            return formatMoney(Number(text), '万', true);
          }
          return formatMoney(Number(text), '', true);
        },
      },
    });
    //tooltip 显示金额

    chart.tooltip({
      showMarkers: false,
      showTitle: true,
      customItems: items => {
        return items.map(item => {
          const value =
            item.data.total >= 10000
              ? formatMoney(item.data.total, '万', true)
              : formatMoney(item.data.total, '', true);
          return {
            ...item,
            value,
          };
        });
      },
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
        offset: 10,
        content: data => {
          if (data.total >= 10000) {
            return formatMoney(data.total, '万', true);
          }
          return formatMoney(data.total, '', true);
        },
        style: {
          fill: '#666',
          fontSize: 12,
        },
      });

    // 点击事件
    chart.on('element:click', event => {
      if (hasElementClick) {
        const date = event.data.data.date;
        const trans_time = [date + '-01-01 00:00:00', date + '-12-31 23:59:59'];
        const type = 'month';

        emitter.emit('updateDate', {
          date: date,
          trans_time: trans_time,
          type: type,
        });
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
