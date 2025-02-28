import React, { useEffect, useState }   from "react";
import {Button, Card,Row,Col} from "antd";
import useReviewForm from "./useReviewForm";
import TableSection from "./reviewTable";
import Summarize from "./review-sum";

import PieChart from '../../components/donutChart';
import { formatMoney } from '../../components/utils';
import YearLineChart from './yearLineChart';

function Index(): JSX.Element {
    const [formValue, cpt] = useReviewForm()
    console.log(formValue, 'formValue====');
    
    // const fetchData = async (data?: Params_Transaction) => {
    //     const {trans_time} = formData
    //     const start_date = trans_time?.[0]?.format('YYYY-MM-DD 00:00:00')
    //     const end_date = trans_time?.[1]?.format('YYYY-MM-DD 23:59:59')
        
    //     const result = await window.mercury.api.getCategoryTotalByDate({
    //         trans_time: [start_date, end_date],
    //         ...data,
    //     })
    //     console.log(formData)
    //     setData(result)
    // }
    // useEffect(() => {
       
    //     fetchData()
    // }, [formData])
    // const refreshTable = (params: Params_Transaction) => {
    //     fetchData(params)
    // }
    const data = [
        { item: '家庭', total: 4000, percent: 0.4 },
        { item: '老公', total: 2100, percent: 0.21 },
        { item: '牧牧', total: 1700, percent: 0.17 },
        { item: '嘻嘻', total: 1300, percent: 0.13 },
        { item: '老婆', total: 1300, percent: 0.13 },
    ];

    return (
        <Row gutter={12}>
            
            <Col span={16}>
                    <Summarize formValue={formValue} />
                    <YearLineChart formValue={formValue} />
                    <div className="mt8">
                        <TableSection formValue={formValue} />
                    </div>
                   
            </Col>
         
            <Col span={8}>
                <Card bordered={false} hoverable>
                    {cpt}
                </Card>
                
                <Card  size="small" bordered={false} hoverable className="mt8">
                    <PieChart 
                        data={data} 
                        height={200}
                        centerText={{
                            title: '总支出',
                            value: formatMoney(data.reduce((sum, item) => sum + item.total, 0)),
                            unit: '元'
                        }}
                    />
                </Card>
            </Col>
        </Row>
    );
}

export default Index;