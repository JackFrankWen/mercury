import React, { useEffect, useState } from 'react';
import BarChart from 'src/renderer/components/barChart';
import { Card, Space } from 'antd';
import { useSelect } from '../../components/useSelect'
import { cpt_const, } from 'src/renderer/const/web'
import LunarCalendar from './luarCalendar';

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
    const cardTitle = () => {
        if (formValue.type === 'year') {
            return '年消费'
        } else {
            return '月度消费'
        }
    }   
    return (<div className="mt8">
                        <Card title={cardTitle()} bordered={false} hoverable extra={extra}>
                           {
                            formValue.type === 'year' ?
                                 <BarChart
                            data={data}
                            /> : <LunarCalendar />
                        }
                            
                        </Card>
                    </div>)
}

export default YearBarChart;
