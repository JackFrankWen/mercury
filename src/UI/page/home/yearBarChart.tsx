import React, { useEffect, useState } from 'react';
import BarChart from 'src/UI/components/barChart';
import { Card, Space } from 'antd';
import { useSelect } from '../../components/useSelect'
import { cpt_const, } from 'src/UI/const/web'

function YearBarChart(props: {
    formValue: any
}) {
    const { formValue } = props;
    const [data, setData] = useState<{date: string, total: number}[]>([]);

    const [consumerVal, ConsumerCpt] = useSelect({
        options: cpt_const.consumer_type,
        placeholder: '消费者',
    })
    const [accountTypeVal, AccountTypeCpt] = useSelect({
        options: cpt_const.account_type,
        placeholder: '账户类型',
    })
    const [paymentTypeVal, PaymentTypeCpt] = useSelect({
        options: cpt_const.payment_type,
        placeholder: '支付方式',
    })

   
  
    useEffect(() => {
        fetchData({
            ...formValue,
            consumer: consumerVal,
            account_type: accountTypeVal,
            payment_type: paymentTypeVal,
        });
    }, [formValue,
        consumerVal,
        accountTypeVal,
        paymentTypeVal,

    ]);
    const extra = (
        <Space>
                {AccountTypeCpt}
                {ConsumerCpt}
                {PaymentTypeCpt}
        </Space>
    )   
    const fetchData = async (obj) => {
        if (!obj) return;
        
        const result = await window.mercury.api.getTransactionsByMonth(obj);
         
        setData(result);
    }

    return (<div className="mt8">
                        <Card title="年月消费" bordered={false} hoverable extra={extra}>
                            <BarChart 
                                data={data}
                            />
                        </Card>
                    </div>)
}

export default YearBarChart;
