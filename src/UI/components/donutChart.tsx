import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import { formatMoney } from './utils';

interface DataItem {
  item: string;
  total: number;
}

interface DonutChartProps {
  data: DataItem[];
  height?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ 
  data, 
  height = 700,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Calculate total and percentages
    const total = data.reduce((sum, item) => sum + item.total, 0);
    const chartData = data.map(item => ({
      ...item,
      percent: item.total / total
    }));

    // Initialize chart
    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: height,
    });

    // Save chart instance
    chartRef.current = chart;

    // Set data and configurations
    chart.data(chartData);
    chart.scale('percent', {
      formatter: (val) => `${(val * 100).toFixed(1)}%`,
    });

    chart.coordinate('theta', {
      radius: 0.85,
    });
    chart.tooltip({
      showTitle: false,
      showMarkers: false,
    });

  

    chart
      .interval()
      .adjust('stack')
      .position('percent')
      .color('item')
      .label('percent', {
        offset: -30,
        content: (data) => {
          return `${(data.percent * 100).toFixed(1)}%`;
        },
        style: {
          textAlign: 'center',
          fontSize: 12,
        },
      })
      

    chart.interaction('element-active');
    chart.legend(false);

    chart.render();

    // Cleanup
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, height]);

  return <div ref={containerRef} />;
};

export default DonutChart;