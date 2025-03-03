import React, { useEffect, useState }   from "react";
import {Button, Card,Row,Col} from "antd";
import useReviewForm from "./useReviewForm";
import TableSection from "./reviewTable";
import Summarize from "./review-sum";

import PieChart from '../../components/donutChart';
import { formatMoney } from '../../components/utils';
import YearLineChart from './yearLineChart';
import ConsumerChart from './consumerChart';
import AccountInfo from './accountInfo';
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
                <Card size="small" bordered={false} hoverable>
                    {cpt}
                </Card>
                <AccountInfo formValue={formValue} />
                
                <ConsumerChart formValue={formValue} />
            </Col>
        </Row>
    );
}

export default Index;