import { message, Space, Table, Tag, Modal, Button, Popover, Typography, Input, Badge } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React, { useEffect, useState } from 'react'
import { getCategoryString } from '../../const/categroy'
import { getAccountType } from '../../const/web'
import useLoadingButton from '../../components/useButton'
import { getPriorityType, getConditionType, getFormulaType, priority_type } from '../../const/web'
import AdvancedRuleModal from './advancedRuleModal'
import { RuleItem, RuleItemList, RuleItemListList } from './advancedRuleFormItem'
import BatchReplaceModal from './batchReplaceModal'
import { AdvancedRule } from 'src/main/sqlite3/advance-rules'

// Add type declarations at the top
type TypeMap = { [key: string]: string }


const renderValue = (value: RuleItem) => {
  if (value.condition === 'account_type') {
    return getAccountType(value.value)
  }
  return value.value
}
export const renderRuleContent = (rule: RuleItemListList) => {
  return (
    <div>
      {rule.map((item: RuleItemList, index: number) => (<>
        <div key={index} style={{
          padding: '5px',
          borderRadius: '5px',
          overflow: 'hidden',
          margin: '5px', backgroundColor: '#f0f0f0'
        }}>
          {item.map((item: RuleItem) => (
            <div>
              <Typography.Text strong>{getConditionType(item.condition)}</Typography.Text>
               <Typography.Text code>{getFormulaType(item.formula)}</Typography.Text>
                <Typography.Text>{renderValue(item)}</Typography.Text>
            </div>
          ))}
        </div>
         {
            index !== rule.length - 1 && (
              <span>
                <Typography.Text strong>OR</Typography.Text>
              </span>
            )
          }
        </>
      ))}
    </div>
  )
}
const RuleTable = () => {
  const [ruleData, setRuleData] = useState<any>()
  const [isUpdate, setIsUpdate] = useState<boolean>()
  const [LoadingBtn, , setLoadingFalse] = useLoadingButton()
  const [searchValue, setSearchValue] = useState<string>('')
  
  const getRuleData = async (rule?: { nameOrRule?: string; active?: number }) => {
    window.mercury.api.getAllAdvancedRules(rule).then((res: any) => {
      console.log(res, '====rule')
      if (res) {
        setRuleData(res)
      }
    })
  }
  const columns: ColumnsType<AdvancedRule> = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 80,
      fixed: 'left',
      render: (val: string) => {
        return <Typography.Text strong type="success">{val}</Typography.Text>
      },
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 100,
      render: (val: string) => {
        return <div>{getCategoryString(val)}</div>
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      width: 100,
      filters: [
        { text: getPriorityType(1), value: 1 },
        { text: getPriorityType(10), value: 10 },
        { text: getPriorityType(100), value: 100 },
      ],
      onFilter: (value, record) => record.priority === value,
      render: (val: number) => {
        if (val === 1) {
          return <Tag color="magenta">{getPriorityType(val)}</Tag>
        } else if (val === 10) {
          return <Tag color="gold">{getPriorityType(val)}</Tag>
        } else if (val === 100) {
          return <Tag color="geekblue">{getPriorityType(val)}</Tag>
        }
        return <div>{getPriorityType(val)}</div>
      },
    },
    {
      title: '状态',
      dataIndex: 'active',
      ellipsis: true,
      width: 80,
      filters: [
        { text: '启用', value: 1 },
        { text: '禁用', value: 0 },
      ],
      onFilter: (value, record) => record.active === value,
      render: (val: number) => <Badge status={val === 1 ? 'success' : 'default'} text={val === 1 ? '启用' : '禁用'} />
    },
    // {
    //   title: '规则',
    //   dataIndex: 'rule',
    //   ellipsis: true,
    //   render: (val: string | undefined, record: any) => {
    //     const rule: RuleItemListList = val ? JSON.parse(val) : []
    //     if (rule.length === 0) {
    //       return <div>暂无规则</div>
    //     }

    //     return <Popover content={renderRuleContent(rule)}>
    //       <div style={{  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
    //        {renderRuleContent(rule)}
    //       </div>
    //     </Popover>
    //   },
    // },
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
      width: 200,
      render: (_, record) => (
        <Space.Compact size="middle">
          <Button
            onClick={() => {
              setVisiable(true)
              setIsUpdate(true)
              setRecord(record)
              console.log(record)
            }}
          >
            查看
          </Button>
          <Button
            onClick={() => {
            
              window.mercury.api.updateAdvancedRule(record.id, { ...record, active: record.active === 1 ? 0 :1 }).then((res: any) => {
                if (res.code === 200) {
                message.success('状态更新成功')
                getRuleData(searchValue ? { nameOrRule: searchValue } : undefined)
              }
            })
          }}>{record.active === 1 ? '禁用' : '启用'}</Button>
          <Button
            onClick={() => {
              setSelectedRule(record)
              setBatchReplaceVisible(true)
            }}>批量替换</Button>
          <Button
            onClick={() => {
              Modal.confirm({
                title: '确定要删除吗？',
                onOk: () => {
                  window.mercury.api.deleteAdvancedRule(record.id).then((res: any) => {
                    if (res.code === 200) {
                      message.success('删除成功')
                      getRuleData(searchValue ? { nameOrRule: searchValue } : undefined)
                    }
                  })
                }

              })
            }}
          >
            删除
          </Button>
        </Space.Compact>
      ),
    },
  ]
  useEffect(() => {
    getRuleData(searchValue ? { nameOrRule: searchValue } : undefined)
  }, [])
  const [visiable, setVisiable] = useState(false)
  const [record, setRecord] = useState<AdvancedRule>()
  const [batchReplaceVisible, setBatchReplaceVisible] = useState(false)
  const [selectedRule, setSelectedRule] = useState<any>(null)

  const refresh = () => {
    setVisiable(false)
    getRuleData(searchValue ? { nameOrRule: searchValue } : undefined)
  }
  const onSearch = (value: string) => {
    console.log(value)
    setSearchValue(value)
    getRuleData({
      nameOrRule: value
    })
  }
  return (
    <div className="match-content">
      <Space>
      <Input.Search 
        placeholder="请输入规则内容、名称" 
        onSearch={onSearch} 

        enterButton />

        <Button type="primary" onClick={() => {
          setVisiable(true)
          setIsUpdate(false)
          setRecord({
            active: 1,
            consumer: '',
            name: '',
            priority: 1,
            tag: '',
            rule: '',
            category: '',
          })
        }}>新增</Button>
      </Space>
      <Table
        size="middle"
        className="mt8"
        columns={columns}
        dataSource={ruleData}
        scroll={{ y: 'calc(100vh - 200px)', }}
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

      {batchReplaceVisible && (
        <BatchReplaceModal
          visible={batchReplaceVisible}
          rule={selectedRule}
          onClose={() => setBatchReplaceVisible(false)}
          onSuccess={() => {
            setBatchReplaceVisible(false)
          }}
        />
      )}
    </div>
  )
}
export default RuleTable
