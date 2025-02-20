import React, { useEffect, useState }   from "react";
import {Button, Card} from "antd";
import useReviewForm from "./useReviewForm";
import CategoryTable from "./categoryTable";
function Index(): JSX.Element {
    const [formData, cpt] = useReviewForm()
    const [data, setData] = useState<any>([])
    useEffect(() => {
        const fetchData = async () => {
            const {trans_time} = formData
            const start_date = trans_time?.[0]?.format('YYYY-MM-DD 00:00:00')
            const end_date = trans_time?.[1]?.format('YYYY-MM-DD 23:59:59')
            
            const result = await window.mercury.api.getCategoryTotalByDate({
                trans_time: [start_date, end_date]
            })
            console.log(formData)
            setData(result)
        }
        fetchData()
    }, [formData])
    return (
        <div>
            
            <Card bordered={false} hoverable>
              {cpt}
            </Card>
            <Card bordered={false} hoverable>
                <CategoryTable data={data} formValue={formData} refreshTable={() => {}} />  
            </Card>
        </div>
    );
}

export default Index;