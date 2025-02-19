import React, { useEffect, useState }   from "react";
import {Button, Card} from "antd";
import useReviewForm from "./useReviewForm";
import CategoryTable from "./categoryTable";
function Index(): JSX.Element {
    const [formData, cpt] = useReviewForm()
    const [data, setData] = useState<any>([])
    useEffect(() => {
        const fetchData = async () => {
            const result = await window.mercury.api.getCategoryTotalByDate({start_date: '2024-01-01', end_date: '2024-12-31'})
            console.log(result)
            setData(result)
        }
        fetchData()
    }, [])
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