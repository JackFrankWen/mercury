import React, { useEffect, useState } from 'react';
import LineChart from 'src/UI/components/line';
import { Card, Space } from 'antd';
import { useSelect } from '../../components/useSelect'
import { cpt_const, } from 'src/UI/const/web'

function YearLineChart(props: {
    formValue: any
}) {
    const { formValue } = props;
    const [data, setData] = useState<{date: string, total: number}[]>([]);

    const [consumerVal, ConsumerCpt] = useSelect({
        options: cpt_const.consumer_type,
        placeholder: '消费者',
    })

   
  
    useEffect(() => {
        fetchData({
            ...formValue,
            consumer: consumerVal,
        });
    }, [formValue,
        consumerVal,

    ]);
    const extra = (
        <>
                {ConsumerCpt}
        </>
    )   
    const fetchData = async (obj) => {
        console.log(obj, 'obj====');
        if (!obj) return;
        console.log(obj,'====222');
        
        const result = await window.mercury.api.getTransactionsByMonth(obj);
        console.log(result, '======');
         
        setData(result);
    }

    return (<div className="mt8">
                        <Card title="年月消费" bordered={false} hoverable extra={extra}>
                            <LineChart 
                                data={data}
                            />
                        </Card>
                    </div>)
}

export default YearLineChart;
