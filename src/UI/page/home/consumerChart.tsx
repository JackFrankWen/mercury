import React, { useEffect, useState } from 'react';
import PieChart from 'src/UI/components/donutChart';
import { Card } from 'antd';
import { consumer_type } from 'src/UI/const/web';


function ConsumerChart(props: {
    formValue: any
}) {
    const { formValue } = props;
    const [data, setData] = useState<{item: string, total: number}[]>([]);

    useEffect(() => {
        fetchData(formValue);
    }, [formValue]);

    const fetchData = async (obj) => {
        console.log(obj, 'obj====');
        if (!obj) return;
        console.log(obj,'====3333');
        
        const result = await window.mercury.api.getConsumerTotal(obj);
        console.log(result, '======');
         
        setData(result.map(item => ({
            item: consumer_type[Number(item.item)],
            total: item.total,
        })));
    }

    return (<div className="mt8">
                        <Card bordered={false} hoverable>
                            <PieChart 
                                data={data}
                            />
                        </Card>
                    </div>)
}

export default ConsumerChart;
