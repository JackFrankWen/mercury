import React, { useEffect, useState }   from "react";
import {Button, Card} from "antd";
import useReviewForm from "./useReviewForm";
import TableSection from "./reviewTable";
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
    return (
        <div>
            
            <Card bordered={false} hoverable>
              {cpt}
            </Card>
            <TableSection formValue={formValue} />
        </div>
    );
}

export default Index;