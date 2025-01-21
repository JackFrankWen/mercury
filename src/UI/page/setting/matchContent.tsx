import { Drawer, Form, Input, message, Space, Table, Tag, Button } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React, { useEffect, useState } from 'react'
import { getCategoryString } from '../../const/categroy'
import useLoadingButton from '../../components/useButton'
import { abc_type, cost_type, tag_type } from '../../const/web'
interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}

const RuleTable = () => {
  const [ruleData, setRuleData] = useState<any>()
  const [isUpdate, setIsUpdate] = useState<boolean>()
  const { LoadingBtn, setLoadingFalse } = useLoadingButton()
  const getRuleData = async () => {
    // try {
    //   const res = await $api.getALlMatchRule()
    //   console.log(res, 'rule')
    //   if (res) {
    //     setRuleData(res)
    //   }
    // } catch (error) {
    //   console.log(error)
    // }
  }
  const columns: ColumnsType<DataType> = [
    {
      title: '分类',
      dataIndex: 'category',
      width: 120,
      render: (val: string) => {
        const list = val ? JSON.parse(val) : []

        return list.length > 0 ? getCategoryString(list) : ''
      },
    },
    {
      title: '规则',
      dataIndex: 'rule',
      render: (ru: string) => {
        if (ru && ru.includes('|')) {
          const arr = ru.split('|')
          return arr.map((str: string, key: number) => {
            return <Tag key={key}>{str}</Tag>
          })
        }
        return ru
      },
    },
    {
      title: '对象',
      width: 80,
      dataIndex: 'consumer',
      key: 'consumer',
      render: (val: number) => {
        const consumer_type = {
          1: '老公',
          2: '老婆',
          3: '家庭',
          4: '牧牧',
        }
        if (val === 1) {
          return <Tag color="cyan">{consumer_type[val]}</Tag>
        } else if (val === 2) {
          return <Tag color="magenta">{consumer_type[val]}</Tag>
        } else if (val === 3) {
          return <Tag color="geekblue">{consumer_type[val]}</Tag>
        } else if (val === 4) {
          return <Tag color="orange">{consumer_type[val]}</Tag>
        }
      },
    },

    {
      title: '标签',
      dataIndex: 'tag',
      width: 90,
      render: (val: string) => (val ? tag_type[val] : ''),
    },
    {
      title: 'ABC类',
      dataIndex: 'abc_type',
      width: 100,
      render: (val: number) => (val ? abc_type[val] : ''),
    },
    {
      title: '消费方式',
      dataIndex: 'cost_type',
      width: 100,
      render: (val: number) => (val ? cost_type[val] : ''),
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              setVisiable(true)
              setIsUpdate(false)
              setRecord(record)
              console.log(record)
            }}
          >
            新增
          </a>
          <a
            onClick={() => {
              setVisiable(true)
              setIsUpdate(true)
              setRecord(record)
              console.log(record)
            }}
          >
            修改
          </a>
        </Space>
      ),
    },
  ]
  useEffect(() => {
    getRuleData()
  }, [])
  const [visiable, setVisiable] = useState(false)
  const [input, setInput] = useState<string>('')
  const [record, setRecord] = useState<any>()
  const onSubmit = async () => {
    if (!input) {
      message.info('比天')
      return
    }
    try {
      const res: any = await $api.UpdateOne({
        filter: { _id: record.m_id },
        update: {
          rule: record.rule.concat(`|${input}`),
        },
      })
      if (res.code === 200) {
        setVisiable(false)
        setLoadingFalse()
        getRuleData()
        message.success('修改成功')
      }
    } catch (error) {
      console.log(error)
    }
  }
  const refresh = () => {
    setVisiable(false)
    getRuleData()
  }
  return (
    <>
      <Table
        columns={columns}
        dataSource={ruleData}
        // pagination={{
        //   defaultPageSize: 10,
        //   pageSizeOptions: [10, 20, 50],
        //   showSizeChanger: true,
        // }}
        pagination={false}
      />
      {/* {visiable && (
        <Drawer
          title="Basic Drawer"
          placement="right"
          open={visiable}
          onClose={() => setVisiable(false)}
        >
          {isUpdate ? (
            <RuleForm data={record} refresh={refresh} />
          ) : (
            <Form>
              <Form.Item>
                <Input
                  placeholder="输入规则"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                  }}
                />
              </Form.Item>
              <Form.Item>
                <LoadingBtn type="primary" onClick={onSubmit}>
                  提交
                </LoadingBtn>
              </Form.Item>
            </Form>
          )}
        </Drawer>
      )} */}
    </>
  )
}
export default RuleTable
