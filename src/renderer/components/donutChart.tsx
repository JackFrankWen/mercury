import React, { useEffect, useRef } from 'react';
import { DataView } from '@antv/data-set';
import { Chart } from '@antv/g2';
import { formatMoney } from './utils';
interface DataItem {
  value: number;
  type: string;
  name: string;
}

interface PieChartProps {
  data: DataItem[];
  height?: number;
}

const PieChart: React.FC<PieChartProps> = ({ data, height = 500 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart>();

  useEffect(() => {
    if (!containerRef.current) return;

    // 通过 DataSet 计算百分比
    const dv = new DataView();
    dv.source(data).transform({
      type: 'percent',
      field: 'value',
      dimension: 'type',
      as: 'percent',
    });

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height,
      padding: 0,
    });

    chart.data(dv.rows);
    chart.scale({
      percent: {
        formatter: val => {
          val = (val * 100).toFixed(2) + '%';
          return val;
        },
      },
    });
    chart.coordinate('theta', {
      radius: 0.5,
    });
    chart.tooltip({
      // showTitle: false,
      showMarkers: false,
      customItems: items => {
        return items.map(item => {
          return {
            ...item,
            name: `${formatMoney(item.data.value, '万')}`,
            value: `${Number(item.data.percent * 100).toFixed(1)}%`,
          };
        });
      },
    });
    chart.legend(false);
    chart
      .interval()
      .adjust('stack')
      .position('percent')
      .color('type')
      .label('type', {
        offset: -10,
        content: data => {
          if (data.percent < 0.05) return '';
          return `${data.type}\n${(data.percent * 100).toFixed(1)}%`;
        },
      })
      .tooltip('type*percent', (item, percent) => {
        percent = (percent * 100).toFixed(2) + '%';
        return {
          name: item,
          value: percent,
        };
      })
      .style({
        lineWidth: 1,
        stroke: '#fff',
      });

    const outterView = chart.createView();
    const dv1 = new DataView();
    dv1.source(data).transform({
      type: 'percent',
      field: 'value',
      dimension: 'name',
      as: 'percent',
    });

    outterView.data(dv1.rows);
    outterView.scale({
      percent: {
        formatter: val => {
          val = (val * 100).toFixed(2) + '%';
          return val;
        },
      },
    });
    outterView.coordinate('theta', {
      innerRadius: 0.5 / 0.75,
      radius: 0.75,
    });
    outterView
      .interval()
      .adjust('stack')
      .position('percent')
      .color('name', ['#BAE7FF', '#7FC9FE', '#71E3E3', '#ABF5F5', '#8EE0A1', '#BAF5C4'])
      .label('name', {
        content: data => {
          if (data.percent < 0.02) return '';
          return `${data.name}\n${(data.percent * 100).toFixed(1)}%`;
        },
      })
      .tooltip('name*percent', (item, percent) => {
        percent = (percent * 100).toFixed(2) + '%';
        return {
          name: item,
          value: percent,
        };
      })
      .style({
        lineWidth: 1,
        stroke: '#fff',
      });

    chart.interaction('element-highlight');
    chart.render();

    // 保存 chart 实例以便清理
    chartRef.current = chart;

    // 清理函数
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, height]);

  return <div ref={containerRef} />;
};

export default PieChart;
