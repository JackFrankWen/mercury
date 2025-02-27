import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

interface DataItem {
  item: string;
  count: number;
  percent: number;
}

interface DonutChartProps {
  data: DataItem[];
  height?: number;
  centerText?: {
    title: string;
    value: string;
    unit: string;
  };
}

const DonutChart: React.FC<DonutChartProps> = ({ 
  data, 
  height = 500,
  centerText = { title: '主机', value: '200', unit: '台' }
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize chart
    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: height,
    });

    // Save chart instance
    chartRef.current = chart;

    // Set data and configurations
    chart.data(data);
    chart.scale('percent', {
      formatter: (val) => val * 100 + '%',
    });

    chart.coordinate('theta', {
      radius: 0.75,
      innerRadius: 0.6,
    });

    chart.tooltip({
      showTitle: false,
      showMarkers: false,
      itemTpl: '<li class="g2-tooltip-list-item"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>',
    });

    // Center text annotations
    chart
      .annotation()
      .text({
        position: ['50%', '50%'],
        content: centerText.title,
        style: {
          fontSize: 14,
          fill: '#8c8c8c',
          textAlign: 'center',
        },
        offsetY: -20,
      })
      .text({
        position: ['50%', '50%'],
        content: centerText.value,
        style: {
          fontSize: 20,
          fill: '#8c8c8c',
          textAlign: 'center',
        },
        offsetX: -10,
        offsetY: 20,
      })
      .text({
        position: ['50%', '50%'],
        content: centerText.unit,
        style: {
          fontSize: 14,
          fill: '#8c8c8c',
          textAlign: 'center',
        },
        offsetY: 20,
        offsetX: 20,
      });

    chart
      .interval()
      .adjust('stack')
      .position('percent')
      .color('item')
      .label('percent', (percent) => ({
        content: (data) => `${data.item}: ${percent * 100}%`,
      }))
      .tooltip('item*percent', (item, percent) => ({
        name: item,
        value: percent * 100 + '%',
      }));

    chart.interaction('element-active');
    chart.legend(false);

    chart.render();

    // Cleanup
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, height, centerText]);

  return <div ref={containerRef} />;
};

export default DonutChart;