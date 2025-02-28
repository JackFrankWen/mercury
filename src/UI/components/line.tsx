import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

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
    chart.scale('total', {
      nice: true,
    });

    chart.tooltip({
      showMarkers: false,
    });
    chart.interaction('active-region');

    chart
      .interval()
      .position('date*total')
      .style({ radius: [20, 20, 0, 0] });

    chart.render();

    // 清理函数
    return () => {
      chart.destroy();
    };
  }, [data]); // 空依赖数组，仅在组件挂载时执行

  return <div ref={containerRef}></div>;
};

export default LineChart;