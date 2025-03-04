import React, { useState } from 'react'
import { Card, Cascader, message } from 'antd'
import { Button, Form, Input, Radio } from 'antd'
import SelectWrap from '../../components/selectWrap'
import { cpt_const } from '../../const/web'
import { category_type } from '../../const/categroy'
import { toNumberOrUndefiend } from '../../components/utils'
import useLoadingButton from '../../components/useButton'
import { DefaultOptionType } from 'antd/es/cascader'

const RuleForm = (props: {
  data?: {
    id: number
    rule: string
    category?: string
    consumer?: string
    abc_type?: number
    cost_type?: number
    tag?: string
  }
  refresh: () => void
}) => {
  const [form] = Form.useForm()
  const   [LoadingBtn, , setLoadingFalse ] = useLoadingButton()

  const { data } = props
  const onFormLayoutChange = ({ category }: { category: [number, number] }) => {
    if (category) {
      const found = category_type.find((val) => val.value === category[0])
      if (found) {
        // @ts-ignore
        const obj = found.children.find((val) => val.value === category[1])
        if (obj) {
          Object.keys(obj).forEach((key) => {
            console.log(key)
            if (!['value', 'label'].includes(key)) {
              form.setFieldValue(key, obj[key])
            }
          })
        }
      }
    }
  }
  const submitRule = async () => {
    const { data, refresh } = props

    const formValue = form.getFieldsValue()
    let res: any
    try {
      console.log(formValue, 'formValue ')
      if (data?.id) {
        res = await window.mercury.api.updateMatchRule(data.id,{
            ...formValue,
            category: JSON.stringify(formValue.category),
        })
        console.log(res, 'res')
      } else {
        res = await window.mercury.api.addMatchRule({
            ...formValue,
            category: JSON.stringify(formValue.category),
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
        category: data?.category ? JSON.parse(data?.category) : undefined,
        abc_type: toNumberOrUndefiend(data?.abc_type),
        rule: data?.rule,
        cost_type: toNumberOrUndefiend(data?.cost_type),
        tag: toNumberOrUndefiend(data?.tag),
        consumer: toNumberOrUndefiend(data?.consumer),
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
      <Form.Item name="tag">
        <SelectWrap placeholder="标签" options={cpt_const.tag_type} />
      </Form.Item>
      <Form.Item name="consumer">
        <SelectWrap placeholder="消费者" options={cpt_const.consumer_type} />
      </Form.Item>
      <Form.Item name="cost_type">
        <SelectWrap placeholder="消费目的" options={cpt_const.cost_type} />
      </Form.Item>
      <Form.Item name="abc_type">
        <SelectWrap placeholder="ABC分类" options={cpt_const.abc_type} />
      </Form.Item>
      {data?.id ? (
        <Form.Item name="rule">
          <Input.TextArea
            rows={6}
            // disabled={data?.m_id ? true : false}
            placeholder="规则"
          />
        </Form.Item>
      ) : (
        <Form.Item name="rule">
          <Input disabled={data?.id ? true : false} placeholder="规则" />
        </Form.Item>
      )}
      <Form.Item>
        <LoadingBtn type="primary" onClick={submitRule}>
          提交
        </LoadingBtn>
      </Form.Item>
    </Form>
  )
}

export default RuleForm
