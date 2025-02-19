import React, { useState } from 'react'
import { Button, Form, Input, Radio } from 'antd'
import RangePickerWrap from 'src/UI/components/rangePickerWrap'
import dayjs from 'dayjs'

const useReviewForm = (): [any, React.ReactNode] => {
  const [form] = Form.useForm()
  const now = dayjs().subtract(1, 'month') // get the current date/time in Day.js format

  const firstDayOfYear = now.clone().startOf('month') // get the first day of the current month
  const lastDayOfYear = now.clone().endOf('month') // get the last day of the current month
  const initialValues = { type: 'month', date: [firstDayOfYear, lastDayOfYear] }
  const [formData, setFormData] = useState(initialValues)

  const onFormLayoutChange = (val: any) => {
    console.log(val)
  }
  const onFinish = (val: any) => {
    setFormData(val)
  }
  const cpt = (
    <Form
      layout="vertical"
      form={form}
      initialValues={initialValues}
      onFinish={onFinish}
      onValuesChange={onFormLayoutChange}
      style={{ maxWidth: 600 }}
    >
      <Form.Item label="时间" name="date">
        <RangePickerWrap bordered />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          复盘
        </Button>
      </Form.Item>
    </Form>
  )
  return [formData, cpt]
}
export default useReviewForm
