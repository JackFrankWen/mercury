import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Space,
  Steps,
  Table,
  Tag,
  Typography,
} from 'antd'
import React, { useEffect, useState } from 'react'
import { getCategoryString } from 'src/UI/const/categroy'
import {
  abc_type,
  account_type,
  cost_type,
  cpt_const,
  tag_type,
} from 'src/UI/const/web'
import useLoadingButton from 'src/UI/components/useButton'
import { roundToTwoDecimalPlaces } from 'src/UI/components/utils'
import { DeleteOutlined } from '@ant-design/icons'
export interface DataType {
  id: string
  amount: string
  category: string | null
  description: string | null
  account_type: number
  payment_type: number
  consumer: string
  flow_type: string
  creation_time: Date
  trans_time: Date
  modification_time: Date
  tag: string | null
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  title: any
  inputType: 'number' | 'text'
  record: DataType
  index: number
  children: React.ReactNode
}


export interface tableHeaderI {
  name: string
  date: string
  account_type: number
  fileName: string
  titleCostLabel: string
  titleCost: string
  titleIncome: string
  titleIncomeLabel: string
}
const BasicTable = (props: {
  tableData: any
  tableHeader: tableHeaderI
  onCancel: () => void
  onSubmitSuccess: () => void
}) => {
  const { tableData, tableHeader, onCancel, onSubmitSuccess } = props
  const [form] = Form.useForm()
  const [data, setData] = useState(tableData)
  const { LoadingBtn } = useLoadingButton()

  const edit = (record: DataType) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record })
  }
  const onDelete = (record: DataType) => {
    const newData = data.filter((obj: DataType) => obj.id !== record.id)
    setData(newData)
  }

  const cancel = () => {
  }

  const save = async (key: string) => {

  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 50,
      render: (val: number, ctn: any, index: number) => index + 1,
    },
    {
      title: '交易时间',
      dataIndex: 'trans_time',
      width: 180,
      defaultCheck: true,
      fixed: 'left',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      render: (val: string, { flow_type }: { flow_type: number }) => {
        // 金额如果包含中文，则返回警告
        if (/[\u4e00-\u9fa5]/.test(val)) {
          return <Typography.Text type="warning">这条数据有问题</Typography.Text>
        }
        const type = flow_type === 1 ? 'danger' : 'success'

        return val ? <Typography.Text type={type}>¥{val}</Typography.Text> : ''
      },
      width: 100,
      defaultCheck: true,
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 120,
      defaultCheck: false,
      render: (val: string) => {
        const list = val ? JSON.parse(val) : []
        return list.length > 0 ? getCategoryString(list) : ''
      },
    },
    {
      title: '交易对方',
      dataIndex: 'payee',
      ellipsis: true,
      width: 120,
      defaultCheck: false,
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
      defaultCheck: true,
    },
    {
      title: '消费成员',
      width: 80,
      dataIndex: 'consumer',
      defaultCheck: false,
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
      title: '类型',
      dataIndex: 'flow_type',
      width: 80,
      defaultCheck: false,
      render: (val: number) =>
        val === 1 ? (
          <Typography.Text type="danger">支出</Typography.Text>
        ) : (
          <Typography.Text type="success">收入</Typography.Text>
        ),
    },
    {
      title: '账户',
      dataIndex: 'account_type',
      width: 80,
      defaultCheck: false,
      render: (val: number) => (val ? account_type[val] : ''),
    },
    {
      title: '操作1',
      dataIndex: 'operation',
      width: 40,
      render: (_: any, record: DataType) => {
        return (
          <Space>
            <Popconfirm
              title="Are you sure to delete this task?"
              onConfirm={() => onDelete(record)}
              onCancel={() => { }}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined style={{ color: 'red' }} />
            </Popconfirm>
          </Space>
        )
      },
    },
  ]


  const submit = async () => {
    // 判断 描述中是否包含京东-订单编号
    const isJingdong = data.some((obj: any) => obj.description?.includes('京东-订单编号'))
    if (isJingdong) {
      // 替换为拼多多-订单编号
      
    }

  const tableSummary = (pageData: any) => {
    let totalCost = 0
    let totalIncome = 0
    pageData.forEach((obj: any) => {
      if (obj.flow_type === 1) {
        totalCost += Number(obj.amount)
      } else {
        totalIncome += Number(obj.amount)
      }
    })
    return (
      <>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0}>支出</Table.Summary.Cell>
          <Table.Summary.Cell index={1}>
            <a>{roundToTwoDecimalPlaces(totalCost)}</a>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={2}>收入</Table.Summary.Cell>
          <Table.Summary.Cell index={3}>
            <a>{roundToTwoDecimalPlaces(totalIncome)}</a>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </>
    )
  }
  return (
    <div>
      <Card bordered={false}>
        <Row>
          <Steps
            current={1}
            items={[
              {
                title: '上传',
                description: '上传账单',
              },
              {
                title: '替换',
                description: '替换拼多多',
              },
              {
                title: '分类',
                description: 'ai自动分类',
              },
            ]}
          />
        </Row>
        <Row align="middle" justify="center">
          <Col span={24} style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '24px' }}>
              收入：
              <Typography.Text type="success">
                {tableHeader?.titleIncome}
              </Typography.Text>
            </span>
            <span style={{ fontSize: '24px', marginLeft: '12px' }}>
              支出：
              <Typography.Text type="danger">
                {tableHeader.titleCost}
              </Typography.Text>
            </span>
          </Col>
          <Col span={24} style={{ textAlign: 'center' }}>
            <span>
              <Typography.Text type="secondary">
                {tableHeader.titleCostLabel}
              </Typography.Text>
            </span>
            <span style={{ marginLeft: '12px' }}>
              <Typography.Text type="secondary">
                {tableHeader.titleIncomeLabel}
              </Typography.Text>
            </span>
          </Col>
        </Row>
        
        <Form form={form} component={false}>
          <Table
            rowKey="id"
            onRow={(record) => {
              return {
                onDoubleClick: () => edit(record),
              }
            }}
            rowClassName={(record) => {

              // 金额如果包含中文，则返回警告 
              if (/[\u4e00-\u9fa5]/.test(record.amount)) {
                return 'mercury-warning'
              }
              return ''
            }}
            dataSource={data}
            size="small"
            columns={columns}
            summary={tableSummary}
            scroll={{ x: 1500, y: 300 }}
            pagination={false}
         
          />
        </Form>
<Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: '10px' }}
        >
          <Space>
            <span style={{ fontSize: '12px' }}>{tableHeader?.fileName}</span>
            <span style={{ fontSize: '12px' }}>账号:{tableHeader?.name}</span>
            <span style={{ fontSize: '12px' }}>{tableHeader?.date}</span>
          </Space>
          <Space>
            <Button onClick={onCancel}>取消</Button>
            <LoadingBtn type="primary" onClick={submit}>
              下一步
            </LoadingBtn>

          </Space>
        </Row>
      </Card>
    </div>
  )
}

export default BasicTable
