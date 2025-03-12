import { message, Space, Table, Tag, Modal, Button } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React, { useEffect, useState } from 'react'
import { getCategoryString } from '../../const/categroy'
import useLoadingButton from '../../components/useButton'
import { getPriorityType, getConditionType, getFormulaType, priority_type } from '../../const/web'
import AdvancedRuleModal from './advancedRuleModal'
import { RuleItem, RuleItemList, RuleItemListList } from './advancedRuleFormItem'
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

export const renderRuleContent = (rule: RuleItemListList) => {
  return (
    <div>
      {rule.map((item: RuleItemList) => (
        <div>
          {item.map((item: RuleItem) => (
            <div>
              {getConditionType(item.condition)} {getFormulaType(item.formula)} {item.value}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
const RuleTable = () => {
  const [ruleData, setRuleData] = useState<any>()
  const [isUpdate, setIsUpdate] = useState<boolean>()
  const [LoadingBtn, , setLoadingFalse] = useLoadingButton()
  const getRuleData = async () => {
    window.mercury.api.getAllAdvancedRules().then((res: any) => {
      console.log(res, '====rule')
      if (res) {
        setRuleData(res)
      }
    })
  }
  const columns: ColumnsType<DataType> = [
    {
      title: '分类',
      dataIndex: 'category',
      width: 70,
      fixed: 'left',
      render: (val: string) => {
        return <div>{getCategoryString(val)}</div>
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      width: 50,
      render: (val: number) => {
        return <div>{getPriorityType(val)}</div>
      },
    },
    {
      title: '规则',
      dataIndex: 'rule',
      ellipsis: true,
      width: 150,
      render: (val: string | undefined) => {
        const rule: RuleItemListList = val ? JSON.parse(val) : []
        if (rule.length === 0) {
          return <div>暂无规则</div>
        }
        return renderRuleContent(rule)
      },
    },
    // {
    //   title: '消费者',
    //   width: 80,
    //   dataIndex: 'consumer',
    //   key: 'consumer',
    //   render: (val: number) => {
    //     const consumer_type: { [key: number]: string } = {
    //       1: '老公',
    //       2: '老婆',
    //       3: '家庭',
    //       4: '牧牧',
    //     }
    //     if (val === 1) {
    //       return <Tag color="cyan">{consumer_type[val]}</Tag>
    //     } else if (val === 2) {
    //       return <Tag color="magenta">{consumer_type[val]}</Tag>
    //     } else if (val === 3) {
    //       return <Tag color="geekblue">{consumer_type[val]}</Tag>
    //     } else if (val === 4) {
    //       return <Tag color="orange">{consumer_type[val]}</Tag>
    //     }
    //   },
    // },

    // {
    //   title: '标签',
    //   dataIndex: 'tag',
    //   width: 90,
    //   render: (val: string) => (val ? (tag_type as TypeMap)[val] : ''),
    // },
    // {
    //   title: 'ABC类',
    //   dataIndex: 'abc_type',
    //   width: 100,
    //   render: (val: number) => (val ? (abc_type as TypeMap)[val] : ''),
    // },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space size="middle">

          <a
            onClick={() => {
              setVisiable(true)
              setIsUpdate(true)
              setRecord(record)
              console.log(record)
            }}
          >
            查看
          </a>
          <a
            onClick={() => {
              Modal.confirm({
                title: '确定要删除吗？',
                onOk: () => {
                  window.mercury.api.deleteAdvancedRule(record.id).then((res: any) => {
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

  const refresh = () => {
    setVisiable(false)
    getRuleData()
  }
  return (
    <div className="match-content">
      <Button type="primary" onClick={() => {
        setVisiable(true)
        setIsUpdate(false)
        setRecord({})
      }}>新增</Button>
      <Table
        size="middle"
        className="mt8"
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
        <Modal
          title="高级规则"
          open={visiable}
          width={700}
          onCancel={() => setVisiable(false)}
          footer={null}
        >
          <AdvancedRuleModal
            data={record}
            refresh={refresh}
            onCancel={() => setVisiable(false)}
          />
        </Modal>
      )}
    </div>
  )
}
export default RuleTable
