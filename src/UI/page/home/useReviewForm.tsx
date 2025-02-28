import React, { useState } from 'react'
import { Button, Form, Input, Radio } from 'antd'
import RangePickerWrap from 'src/UI/components/rangePickerWrap'
import dayjs from 'dayjs'

const useReviewForm = (): [any, React.ReactNode] => {
  const [form] = Form.useForm()
  const now = dayjs()
  const lastYear = now.subtract(1, 'year') // 先获取去年的时间

  const firstDayOfYear = lastYear.startOf('year') // 获取去年1月1日
  const lastDayOfYear = lastYear.endOf('year') // 获取去年12月31日
  const initialValues = { trans_time: [firstDayOfYear, lastDayOfYear], type: 'year' }
  const [formData, setFormData] = useState({
    ...initialValues,
    trans_time: [initialValues.trans_time[0].format('YYYY-MM-DD 00:00:00'), initialValues.trans_time[1].format('YYYY-MM-DD 23:59:59')]
  })

  const onFormLayoutChange = (val: any) => {
    console.log(val)
    setFormData({
      ...val,
      trans_time: [val.trans_time[0].format('YYYY-MM-DD 00:00:00'), val.trans_time[1].format('YYYY-MM-DD 23:59:59')]
    })
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
      <Form.Item label="时间" name="trans_time">
        <RangePickerWrap bordered />
      </Form.Item>
      <Form.Item label="类型" name="type">
        <Radio.Group
          block
          options={[{ label: '年账单', value: 'year' },
          { label: '月账单', value: 'month' },
          { label: '季度', value: 'quater' }
          ]}
          defaultValue="year"
          optionType="button"
          buttonStyle="solid"
        />
      </Form.Item>
    </Form>
  )
  return [formData, cpt]
}
export default useReviewForm
