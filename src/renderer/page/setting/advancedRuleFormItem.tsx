import { Col, Row, Space, Table, Button, Input } from "antd"
import React from "react"
import { PlusOutlined, MinusOutlined, PlusCircleFilled, MinusCircleFilled } from "@ant-design/icons"
import SelectWrap from "../../components/selectWrap"
import { cpt_const } from "../../const/web"


type RuleItem = {
    condition: string
    formula: string
    value: string
}
export type RuleItemList = RuleItem[][]
function AdvancedRuleFormItem(props: {
    value: RuleItemList,
    onChange: (value: RuleItemList) => void
}) {
    const { value, onChange } = props
    return (
        <div>
            {
                value.map((item, index) => {
                    return (
                        <Row key={index}>
                            {
                                index > 0 && <Col span={24} style={{ textAlign: 'left' }}>或</Col>
                            }
                            <Col span={24}>
                                <AdvancedRuleItem data={item}
                                    rowKey={index}
                                    onChange={(newValue) => {
                                        onChange(value.map((item, i) => {
                                            if (i === index) {
                                                return newValue
                                            }
                                            return item
                                        }))
                                    }} 
                                    onDelete={() => {
                                        onChange(value.filter((_, i) => i !== index))
                                    }} 
                                    onAdd={() => {
                                        onChange([...value, [{ condition: '', formula: '', value: '' }]])
                                    }} />
                            </Col>
                        </Row>
                    )
                })
            }
            <Button
            className="mt8"
            icon={<PlusOutlined />} 
            onClick={() => {
                onChange([...value, [{ condition: '', formula: '', value: '' }]])
            }}>添加规则</Button>
        </div>
    )

}
function AdvancedRuleItem(props: {
    onDelete: () => void
    onAdd: () => void
    onChange: (newValue: RuleItem[]) => void
    rowKey: number
    data: RuleItem[]
}) {
    const { data, onDelete, onAdd, onChange, rowKey } = props

    /*
    [
      {
          "comType": 1,
          "condition": "expireDate",
          "formula": "=",
          "id": 48,
          "rowKey": "1741671545950",
          "value": "33"
      },
      {
          "comType": 1,
          "condition": "application",
          "formula": "=",
          "id": 49,
          "rowKey": "1741671546994",
          "value": "cw"
      },
      {
          "comType": 1,
          "condition": "application",
          "formula": "=",
          "id": 50,
          "rowKey": "1741671547975",
          "value": "cw"
      },
      {
          "comType": 2,
          "condition": "isAdmin",
          "formula": "=",
          "id": 51,
          "rowKey": "1741671571119",
          "value": "true"
      },
      {
          "comType": 3,
          "condition": "isAdmin",
          "formula": "=",
          "id": 52,
          "rowKey": "1741671969887",
          "value": "true"
      }
  ]
    */

    const columns = [
        {
            title: '操作',
            dataIndex: 'action',
            render: (text: string) => {
                return <Space>
                    <PlusCircleFilled onClick={() => {
                        onChange([...data, { condition: '', formula: '', value: '' }])
                    }} />
                    <MinusCircleFilled onClick={() => {
                        onChange(data.filter((_, i) => i !== rowKey))
                    }} />
                </Space>
            }
        },
        {
            title: '条件',
            dataIndex: 'condition',
            render: (text: string, record: any, index: number) => {
                return <SelectWrap placeholder="条件" options={cpt_const.condition_type}
                value={record.condition}
                 onChange={(value) => {
                    console.log(value,'value');
                    onChange(data.map((item, i) => {
                        if (i === index) {
                            return { ...item, condition: value }
                        }
                        return item
                    }))
                }} />
            }
        },
        {
            title: '公式',
            dataIndex: 'formula',
            render: (text: string, record: any, index: number) => {
                return <SelectWrap placeholder="公式" options={cpt_const.formula_type}
                value={record.formula}
                 onChange={(value) => {
                    console.log(value,'value');
                    onChange(data.map((item, i) => {
                        if (i === index) {
                            return { ...item, formula: value }
                        }
                        return item
                    }))
                }} />
            }
        },
        {
            title: '值',
            dataIndex: 'value',
            render: (text: string, record: any, index: number) => {
                return <Input placeholder="值"
                 value={record.value}
                 onChange={(e) => {
                    console.log(e.target.value,'value');
                    onChange(data.map((item, i) => {
                        if (i === index) {
                            return { ...item, value: e.target.value }
                        }
                        return item
                    }))
                }} />
            }
        },
    ]
    return (
        <Row align="middle" style={{ backgroundColor: '#f5f5f5', padding: 10 }} gutter={10}>
            <Col span={1} style={{ textAlign: 'center' }}>且</Col>
            <Col flex="1"><Table
                columns={columns}
                dataSource={data}
                pagination={false}
                size="small"
                bordered
            />
            </Col>
            <Col span={1} style={{ textAlign: 'center' }}><MinusOutlined onClick={onDelete} /> </Col>
        </Row>
    )

}
export default AdvancedRuleFormItem