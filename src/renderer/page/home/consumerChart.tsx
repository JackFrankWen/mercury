import React, { useState } from 'react';
import PieChart from 'src/renderer/components/pieChart';
import { Card } from 'antd';
import { consumer_type } from 'src/renderer/const/web';
import { useFresh } from 'src/renderer/components/useFresh';
function ConsumerChart(props: { formValue: any }) {
  const { formValue } = props;
  const [data, setData] = useState<{ item: string; total: number }[]>([]);

  useFresh(() => {
    fetchData(formValue);
  }, [formValue]);

  const fetchData = async (obj) => {
    try {
      console.log(obj, 'obj====');
      if (!obj) return;

      const result = await window.mercury.api.getConsumerTotal(obj);

      setData(
        result.map((item) => ({
          item: consumer_type[Number(item.item)],
          total: item.total,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt8 mb16">
      <Card size="small" title="成员支出" bordered={false} hoverable>
        <PieChart data={data} />
      </Card>
    </div>
  );
}

export default ConsumerChart;
