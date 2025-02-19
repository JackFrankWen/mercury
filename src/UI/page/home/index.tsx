import React   from "react";
import {Button, Card} from "antd";
import useReviewForm from "./useReviewForm";
function Index(): JSX.Element {
    const [formData, cpt] = useReviewForm()
    return (
        <div>
            
            <Card bordered={false} hoverable>
              {cpt}
            </Card>
        </div>
    );
}

export default Index;