import React, { useEffect, useState } from 'react';
import LineChart from 'src/UI/components/line';
import { Card } from 'antd';


function YearLineChart(props: {
    formValue: any
}) {
    const { formValue } = props;
    const [data, setData] = useState<{date: string, total: number}[]>([]);

    useEffect(() => {
        fetchData(formValue);
    }, [formValue]);

    const fetchData = async (obj) => {
        console.log(obj, 'obj====');
        if (!obj) return;
        console.log(obj,'====222');
        
        const result = await window.mercury.api.getTransactionsByMonth(obj);
        console.log(result, '======');
         
        setData(result);
    }

    return (<div className="mt8">
                        <Card bordered={false} hoverable>
                            <LineChart 
                                data={data}
                            />
                        </Card>
                    </div>)
}

export default YearLineChart;
