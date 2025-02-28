import React, { useState } from 'react'
import { Col, Typography, Row, theme } from 'antd'
import dayjs from 'dayjs'
import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons'
const useReviewForm = (): [any, React.ReactNode] => {
  const now = dayjs()
  const lastYear = now.subtract(1, 'year').format('YYYY')
  const [date, setDate] = useState(lastYear)

  const [formData, setFormData] = useState({
    trans_time: [lastYear + '-01-01 00:00:00', lastYear + '-12-31 23:59:59'],
    type: 'year'
  })


  const cpt = (
    <IconDate value={date} onChange={(val) => {
      setDate(val)
      setFormData({
        ...formData,
        trans_time: [val + '-01-01 00:00:00', val + '-12-31 23:59:59']
      })
    }} />
  )
  return [formData, cpt]
}
const IconDate = (props: {
  value: string
  onChange: (val: string) => void
}) => {
  return <Row>
    <Col span={8} style={{textAlign: 'left'}}>
      <LeftCircleFilled style={{
        fontSize: 20,
        color: theme.useToken().token.colorPrimary,
        cursor: 'pointer'
      }} onClick={() => props.onChange(dayjs(props.value).subtract(1, 'year').format('YYYY'))} />
    </Col>
    <Col span={8} style={{textAlign: 'center'}}>
      <Typography.Text>{props.value}</Typography.Text>
    </Col>
    <Col span={8} style={{textAlign: 'right'}}>
      <RightCircleFilled style={{
        fontSize: 20,
        cursor: 'pointer',
        color: theme.useToken().token.colorPrimary
      }} onClick={() => props.onChange(dayjs(props.value).add(1, 'year').format('YYYY'))} />
    </Col>
  </Row>
}
export default useReviewForm
