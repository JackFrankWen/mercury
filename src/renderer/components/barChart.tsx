import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import { formatMoney } from './utils';
import emitter from '../events';
import { EXPENSE_COLOR, INCOME_COLOR } from '../const/colors';
interface LineChartProps {
  data: {
    date: string;
    total: number;
  }[];
  height?: number;
  hasElementClick?: boolean;
  flowTypeVal: number;
  setYear?: (year: string) => void;
}

const LineChart: React.FC<LineChartProps> = ({ flowTypeVal, data, height = 150, hasElementClick = false, setYear }) => {
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
            return formatMoney(Number(text), '万', true, 1);
          }
          return formatMoney(Number(text), '', true, 0);
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
              : formatMoney(item.data.total, '', true, 0);
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
      .color(flowTypeVal === 1 ? EXPENSE_COLOR : INCOME_COLOR) // 支出为红色，收入为绿色
      .style({ radius: [20, 20, 0, 0] })
      .label('total', {
        offset: 5,
        content: data => {
          if (data.total >= 10000) {
            return formatMoney(data.total, '万', true, 1);
          }
          return formatMoney(data.total, '', true, 0);
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
        const trans_time = [date + '-01 00:00:00', date + '-31 23:59:59'];
        const type = 'month';

        emitter.emit('updateDate', {
          date: date,
          trans_time,
          type: type,
        });
        // 2002-12 替换 -12
        setYear(date.split('-')[0]);
      }
    });

    chart.render();

    // 清理函数
    return () => {
      chart.destroy();
    };

  }, [data, flowTypeVal]); // 当数据或流类型变化时重新渲染

  return <div ref={containerRef}></div>;
};

export default LineChart;
