import React, { useEffect, useState } from "react";
import { Button, Card, Row, Col } from "antd";
import useReviewForm from "./useReviewForm";
import TableSection from "./reviewTable";
import Summarize from "./review-sum";

import PieChart from "../../components/pieChart";
import { formatMoney } from "../../components/utils";
import YearBarChart from "./yearBarChart";
import ConsumerChart from "./consumerChart";
import AccountInfo from "./accountInfo";
import "./index.css";
function Index(): JSX.Element {
  const [formValue, cpt] = useReviewForm();
  console.log(formValue, "formValue====");

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
    <Row gutter={12} className="home-page">
      <Col span={16} className="home-page-left">
        <Summarize formValue={formValue} />
        <YearBarChart formValue={formValue} />
        <div className="mt8">
          <TableSection formValue={formValue} />
        </div>
      </Col>

      <Col span={8} className="home-page-right">
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
