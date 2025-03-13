import React, { useState } from 'react'
import { Card, Cascader, Col, message, Row, Space, Table } from 'antd'
import { Button, Form, Input, Radio } from 'antd'
import SelectWrap from '../../components/selectWrap'
import { cpt_const } from '../../const/web'
import { category_type } from '../../const/categroy'
import { toNumberOrUndefiend } from '../../components/utils'
import useLoadingButton from '../../components/useButton'
import { DefaultOptionType } from 'antd/es/cascader'
import AdvancedRuleFormItem, { RuleItemList } from './advancedRuleFormItem'

export type RuleFormData = {
  id?: number
  name?: string
  category?: string
  consumer?: string
  abc_type?: number
  cost_type?: number
  priority?: number
  rule: string // 需要解析成 RuleItemList
  tag?: string
}

const RuleForm = (props: {
  data?: RuleFormData 
  onCancel: () => void
  refresh: () => void
}) => {
  const [form] = Form.useForm()
  const   [LoadingBtn, , setLoadingFalse ] = useLoadingButton()

  const { data } = props
  const onFormLayoutChange = (value: { category: [number, number] }) => {
    console.log(value,'onFormLayoutChange');
    
    // if (category) {
    //   const found = category_type.find((val) => val.value === category[0])
    //   if (found) {
    //     // @ts-ignore
    //     const obj = found.children.find((val) => val.value === category[1])
    //     if (obj) {
    //       Object.keys(obj).forEach((key) => {
    //         console.log(key)
    //         if (!['value', 'label'].includes(key)) {
    //           form.setFieldValue(key, obj[key])
    //         }
    //       })
    //     }
    //   }
    // }
  }
  const submitRule = async () => {
    const { data, refresh } = props

    const formValue = form.getFieldsValue()
    let res: any
    try {
      console.log(formValue, 'formValue ')
      if (data?.id) {
        res = await window.mercury.api.updateAdvancedRule(data.id,{
            ...formValue,
            category: JSON.stringify(formValue.category),
            rule: JSON.stringify(formValue.rule),
        })
        console.log(res, 'res')
      } else {
        res = await window.mercury.api.addAdvancedRule({
            ...formValue,
            category: JSON.stringify(formValue.category),
            rule: JSON.stringify(formValue.rule),
        })
        console.log(res, 'res')
      }
      if (res?.code === 200) {
        message.success('操作成功')
        setLoadingFalse()
        refresh()
      }
      console.log(res)
    } catch (error) {
      console.log(error)
      message.error(error)
    }
  }
  console.log(data, 'data')

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={{
        name: data?.name,
        category: data?.category ? JSON.parse(data?.category) : undefined,
        abc_type: toNumberOrUndefiend(data?.abc_type),
        cost_type: toNumberOrUndefiend(data?.cost_type),
        tag: toNumberOrUndefiend(data?.tag),
        consumer: toNumberOrUndefiend(data?.consumer),
        rule: data?.rule ? JSON.parse(data?.rule) : [],
        priority: toNumberOrUndefiend(data?.priority) || 1,
      }}
      onValuesChange={onFormLayoutChange}
      style={{ maxWidth: 600 }}
    >
      <Form.Item name="category">
        <Cascader
          options={category_type}
          allowClear
          placeholder="请选择分类"
          showSearch={{
            filter: (inputValue: string, path: DefaultOptionType[]) =>
              path.some(
                (option) =>
                  (option.label as string)
                    .toLowerCase()
                    .indexOf(inputValue.toLowerCase()) > -1
              ),
          }}
        />
      </Form.Item>
      <Form.Item name="name">
        <Input placeholder="规则名称" />
      </Form.Item>
      <Form.Item name="tag">
        <SelectWrap placeholder="标签" options={cpt_const.tag_type} />
      </Form.Item>
      <Form.Item name="consumer">
        <SelectWrap placeholder="消费者" options={cpt_const.consumer_type} />
      </Form.Item>
      <Form.Item name="priority">
        <SelectWrap placeholder="优先级" options={cpt_const.priority_type} />
      </Form.Item>
     
      <Form.Item name="rule">
        <AdvancedRuleFormItem />
      </Form.Item>
      <Form.Item style={{textAlign: 'right'}}>
        <Space>
          <Button  onClick={() => {
            props.onCancel()
          }}>取消</Button>
          <LoadingBtn type="primary" onClick={submitRule}>
            提交
          </LoadingBtn>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default RuleForm
