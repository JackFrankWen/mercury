import React, { useEffect }   from "react";
import {Button, Card} from "antd";
import useReviewForm from "./useReviewForm";
function Index(): JSX.Element {
    const [formData, cpt] = useReviewForm()
    useEffect(() => {
        const fetchData = async () => {
            const result = await window.mercury.api.getCategoryTotalByDate({start_date: '2024-01-01', end_date: '2024-12-31'})
            console.log(result)
        }
        fetchData()
    }, [])
    return (
        <div>
            
            <Card bordered={false} hoverable>
              {cpt}
            </Card>
            
        </div>
    );
}

export default Index;