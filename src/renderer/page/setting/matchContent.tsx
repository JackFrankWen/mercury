import { Drawer, Form, Input, message, Space, Table, Tag, Modal } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React, { useEffect, useState } from 'react'
import { getCategoryString } from '../../const/categroy'
import useLoadingButton from '../../components/useButton'
import { abc_type, cost_type, tag_type } from '../../const/web'
import MatchContentDraw from './matchContentDraw'
// Add type declarations at the top
type TypeMap = { [key: string]: string }

interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
  id: number
}

const RuleTable = () => {
  const [ruleData, setRuleData] = useState<any>()
  const [isUpdate, setIsUpdate] = useState<boolean>()
  const [LoadingBtn,, setLoadingFalse ] = useLoadingButton()
  const getRuleData = async () => {
    window.mercury.api.getAllMatchRule().then((res: any) => {
      console.log(res, '====rule')
      if (res) {
        setRuleData(res)
      }
    })
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
      width: 100,
      fixed: 'left',
      render: (val: string) => {

        return <div>{getCategoryString(val)}</div>
      },
    },
    {
      title: '规则',
      dataIndex: 'rule',
      width: 200,
      ellipsis: true,
      render: (ru: string) => {
        return ru
      },
    },
    {
      title: '消费者',
      width: 80,
      dataIndex: 'consumer',
      key: 'consumer',
      render: (val: number) => {
        const consumer_type: { [key: number]: string } = {
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
      render: (val: string) => (val ? (tag_type as TypeMap)[val] : ''),
    },
    {
      title: 'ABC类',
      dataIndex: 'abc_type',
      width: 100,
      render: (val: number) => (val ? (abc_type as TypeMap)[val] : ''),
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              setVisiable(true)
              setIsUpdate(false)
              setRecord({})
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
          <a
            onClick={() => {
                Modal.confirm({
                    title: '确定要删除吗？',
                    onOk: () => {
                        window.mercury.api.deleteMatchRule(record.id).then((res: any) => {
                            if (res.code === 200) {
                                message.success('删除成功')
                                getRuleData()
                            }
                        })
                    }

              })
            }}
          >
            删除
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
    <div className="match-content">
      <Table
        size="middle"
        columns={columns}
        dataSource={ruleData}
        scroll={{ y: 'calc(100vh - 200px)' }}
        // pagination={{
        //   defaultPageSize: 10,
        //   pageSizeOptions: [10, 20, 50],
        //   showSizeChanger: true,
        // }}
        pagination={false}
      />
      {visiable && (
        <Drawer
          title="Basic Drawer"
          placement="right"
          open={visiable}
          onClose={() => setVisiable(false)}
        >
         <MatchContentDraw data={record} refresh={refresh} />
        </Drawer>
      )}
    </div>
  )
}
export default RuleTable
