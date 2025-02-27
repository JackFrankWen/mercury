import React, { useEffect, useState } from 'react'
import { cpt_const } from 'src/UI/const/web'
import { category_type } from 'src/UI/const/categroy'
import SelectWrap from './selectWrap'
import {  toNumberOrUndefiend } from './utils'
import {
  Cascader,
  Form,
  InputNumber,
  Input,
  Space,
} from 'antd'
import type { DefaultOptionType } from 'antd/es/cascader'


const BatchUpdateArea = (props: {
  formValues: any,
  setFormValues: (values: any) => void
}) => {
  const [form] = Form.useForm()
  const onFinish = (values: any) => {
    if (values.amount || values.description) {
      form.resetFields()
    }
  }
  return (
    <Form
      form={form}
      initialValues={props.formValues}
      onValuesChange={(changedValues, allValues) => {
        props.setFormValues(allValues)
      }}
      className="batch-update-area"
      layout="inline"
    >
    <Space.Compact block>
        
      <Form.Item name="category" className='no-margin'>
        <Cascader
          style={{ minWidth: '100px' }}
          options={category_type}
          displayRender={(label:string []) => {
            
            if (label.length === 0) {
              return ''
            }
            
            return label[label.length - 1]
          }}  
          showSearch={{
            filter: (inputValue: string, path: DefaultOptionType[]) =>
              path.some(
                (option) =>
                  (option.label as string)
                    .toLowerCase()
                    .indexOf(inputValue.toLowerCase()) > -1
              ),
          }}
          onChange={(category) => {
            if (category && category[0]) {
              const found = category_type.find(
                (val) => val.value === category[0]
              )
              if (found) {
                // @ts-ignore
                const obj: any = found?.children.find(
                  (val: any) => val.value === category[1]
                )

                form.setFieldsValue({
                  account_type: undefined,
                  payment_type: undefined,
                  tag: toNumberOrUndefiend(obj?.tag),
                  abc_type: toNumberOrUndefiend(obj?.abc_type),
                  consumer: toNumberOrUndefiend(obj?.consumer),
                  cost_type: toNumberOrUndefiend(obj?.cost_type),
                })
              }
            }
          }}
          allowClear
          placeholder="请选择分类"
        />
      </Form.Item>
      <Form.Item name="tag" className='no-margin'>
        <SelectWrap placeholder="标签" options={cpt_const.tag_type} />
      </Form.Item>
      <Form.Item name="payment_type" className='no-margin'>
        <SelectWrap placeholder="付款方式" options={cpt_const.payment_type} />
      </Form.Item>
      <Form.Item name="consumer" className='no-margin'>
        <SelectWrap placeholder="消费成员" options={cpt_const.consumer_type} />
      </Form.Item>
      <Form.Item name="amount" className='no-margin'>
        <InputNumber placeholder="金额" />
      </Form.Item>
      <Form.Item name="description" className='no-margin'>
        <Input placeholder="描述" />
      </Form.Item>
    </Space.Compact>
     
    </Form>
  )
}

export default BatchUpdateArea
