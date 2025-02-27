import React, { useEffect, useState }   from "react";
import {Button, Card,Row,Col} from "antd";
import useReviewForm from "./useReviewForm";
import TableSection from "./reviewTable";
import Summarize from "./review-sum";

import PieChart from '../../components/Chart';

function Index(): JSX.Element {
    const [formValue, cpt] = useReviewForm()
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
        { item: '事例一', count: 40, percent: 0.4 },
        { item: '事例二', count: 21, percent: 0.21 },
        { item: '事例三', count: 17, percent: 0.17 },
        { item: '事例四', count: 13, percent: 0.13 },
        { item: '事例五', count: 9, percent: 0.09 }
    ];

    return (
        <Row gutter={12}>
            
            <Col span={16}>
                    <Summarize formValue={formValue} />
                    <div className="mt8">
                        <TableSection formValue={formValue} />
                    </div>
            </Col>
         
            <Col span={8}>
                <Card bordered={false} hoverable>
                    {cpt}
                </Card>
                <Card bordered={false} hoverable>
                    <PieChart data={data} />
                </Card>
            </Col>
        </Row>
    );
}

export default Index;