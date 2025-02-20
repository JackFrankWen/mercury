import { message, Modal, Table, Tag, Tooltip, Typography } from 'antd'
import type { TableColumnsType, TableRowSelection } from 'antd'
import { getDateTostring, roundToTwoDecimalPlaces, formatMoney } from '../../components/utils'
import React, { useCallback, useEffect, useState } from 'react'
import { ColumnsType } from 'antd/es/table/interface'
import useModal from '../../components/useModal'
import { abc_type, cost_type, tag_type } from '../../const/web'
import dayjs from 'dayjs'
// import BatchUpdateArea from '../views/accounting/batch-update'

interface ExpandedDataType {
  name: string
  category: string
  avg: string
}
interface DataType {
  name: string
  avg: string
  value: string
  child: ExpandedDataType[]
}

const columns: ColumnsType<DataType> = [
  {
    title: '一级分类',
    dataIndex: 'name',
    width: '33%',
  },
  {
    title: '二级分类',
    dataIndex: 'oo',
    width: '33%',
  },

  {
    title: '金额',
    dataIndex: 'value',
    key: 'value',
    render: (val, obj) => (
      <Typography.Text>
        {formatMoney(val)}
        <Typography.Text type="secondary" style={{ marginLeft: '2px' }}>
          (平均: {formatMoney(obj.avg)})
        </Typography.Text>
      </Typography.Text>
    ),
  },
]
const modalTableCol = [
  {
    title: '交易时间',
    width: 200,
    dataIndex: 'trans_time',
    key: 'trans_time',
    render: (val: string) => {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
    },
  },
  {
    title: '交易对象',
    dataIndex: 'payee',
    width: 80,
    render: (val: string) => (val ? val : ''),
  },

  {
    title: '交易描述',
    dataIndex: 'description',
    render: (description: string) => (
      <Tooltip placement="topLeft" title={description}>
        <Typography.Link ellipsis>{description}</Typography.Link>
      </Tooltip>
    ),
  },
  {
    title: '金额',
    dataIndex: 'amount',
    width: 80,
    render: (txt: string) => {
      if (Number(txt) > 100) {
        return <Typography.Text type="danger">{formatMoney(txt)}</Typography.Text>
      }
      return formatMoney(txt)
    },
  },
  {
    title: '消费对象',
    width: 80,
    dataIndex: 'consumer',
    key: 'consumer',
    render: (val: number) => {
      const consumer_type = {
        1: '老公',
        2: '老婆',
        3: '家庭',
        4: '牧牧',
        5: '爷爷奶奶',
        6: '溪溪',
      }
      if (val === 1) {
        return <Tag color="cyan">{consumer_type[val]}</Tag>
      } else if (val === 2) {
        return <Tag color="magenta">{consumer_type[val]}</Tag>
      } else if (val === 3) {
        return <Tag color="geekblue">{consumer_type[val]}</Tag>
      } else if (val === 4) {
        return <Tag color="purple">{consumer_type[val]}</Tag>
      } else if (val === 5) {
        return <Tag color="lime">{consumer_type[val]}</Tag>
      } else if (val === 6) {
        return <Tag color="orange">{consumer_type[val]}</Tag>
      }
      return <Tag color="orange">{consumer_type[val]}</Tag>
    },
  },

  {
    title: '标签',
    dataIndex: 'tag',
    width: 90,
    render: (val: number) => (val ? tag_type[val] : ''),
  },
]
const expandedRowRender = (toggle: any) => (record: DataType) => {
  const columns: TableColumnsType<ExpandedDataType> = [
    { title: '一级分类', width: '35%', dataIndex: '' },
    { title: '二级分类', width: '33%', dataIndex: 'name' },
    {
      title: '金额',
      dataIndex: 'value',
      key: 'value',
      render: (val, obj) => (
        <Typography.Text>
          {formatMoney(val)}
          <Typography.Text type="secondary" style={{ marginLeft: '2px' }}>
            (平均: {formatMoney(obj.avg)})
          </Typography.Text>
        </Typography.Text>
      ),
    },
  ]

  return (
    <>
      <Table
        onRow={(rowCol) => {
          return {
            onClick: () => {
              console.log(rowCol, 'rowCol')
              toggle(rowCol.category)
            }, // 点击行
          }
        }}
        rowClassName={(record, index) => {
          const className = index % 2 === 0 ? 'oddRow' : 'evenRow'
          return className
        }}
        showHeader={false}
        columns={columns}
        dataSource={record.child}
        pagination={false}
      />
    </>
  )
}

const CategoryTable = (props: {
  data: DataType[]
  formValue: any
  refreshTable: () => void
}) => {
  const { data, formValue, refreshTable } = props
  const [show, toggle] = useModal()
  const [cate, setCate] = useState<string>('')
  const [modalData, setModaldata] = useState()
  const getCategory = async (data: any, category: string) => {
    try {
      const {trans_time} = data
        const start_date = trans_time?.[0]?.format('YYYY-MM-DD 00:00:00')
        const end_date = trans_time?.[1]?.format('YYYY-MM-DD 23:59:59')
        console.log(start_date, end_date, 'start_date, end_date');
      const params = {
        ...data,
        category,
        trans_time: [start_date, end_date],
        
      }
      window.mercury.api.getTransactions(params).then((res) => {
        console.log('res', res);
        
        if(res) {
          setModaldata(res)
        }
    })

    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getCategory(formValue, cate)
  }, [formValue, cate])

  const onRowClick = (val: string) => {
    toggle()
    setCate(val)
  }
  const tableSummary = (pageData: any) => {
    let totalCost = 0
    pageData.forEach((obj: any) => {
      totalCost += Number(obj.value)
    })
    return (
      <>
        <Table.Summary.Row>
          <Table.Summary.Cell index={1}></Table.Summary.Cell>
          <Table.Summary.Cell index={1} colSpan={2}>
            汇总
          </Table.Summary.Cell>
          <Table.Summary.Cell index={2}>
            <a>{formatMoney(totalCost)}</a>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </>
    )
  }
  const refresh = useCallback(() => {
    refreshTable()
    getCategory(formValue, cate)
  }, [formValue, cate])
  return (
    <>
      <Table
        rowKey="id"
        columns={columns}
        expandable={{
          indentSize: 0,
          expandRowByClick: true,
          expandedRowRender: expandedRowRender(onRowClick),
        }}
        summary={tableSummary}
        dataSource={props.data}
        pagination={false}
      />
      {show && (
        <Modal width={1200} footer={null} open={show} onCancel={toggle}>
          <ModalContent modalData={modalData} refresh={refresh} />
        </Modal>
      )}
    </>
  )
}
function ModalContent(props: { modalData: any; refresh: () => void }) {
  const [selectedRows, setSelectedRows] = useState<any>([])
  const { modalData, refresh } = props
  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys: selectedRows,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRows(selectedRowKeys)
    },
  }
  const onBatchUpdate = async (val: any) => {
    try {
      const res = await $api.updateMany({
        filter: {
          ids: selectedRows.filter((val: string) => val.length !== 10),
        },
        data: {
          ...val,
          category: val?.category ? JSON.stringify(val.category) : undefined,
        },
      })
      if (res.modifiedCount) {
        refresh()
        setSelectedRows([])
        message.success(`成功${res.modifiedCount}记录`)
      }
      console.log(res, 'update sucess')
    } catch (error) {
      console.log(error)
    }
  }
  const onBatchDelete = async () => {
    try {
      const res = await $api.deleteMany({
        filter: {
          ids: selectedRows.filter((val: string) => val.length !== 10),
        },
      })
      if (res.deletedCount) {
        refresh()
        setSelectedRows([])
        message.success(`成功删除${res.deletedCount}记录`)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const selectRow = (record: any) => {
    const selectedRowKeys = [...selectedRows]
    console.log(record, 'record')
    if (selectedRowKeys.indexOf(record.m_id) >= 0) {
      selectedRowKeys.splice(selectedRowKeys.indexOf(record.m_id), 1)
    } else {
      selectedRowKeys.push(record.m_id)
    }
    setSelectedRows(selectedRowKeys)
  }
  return (
    <>
      <div style={{ padding: '8px 0' }}>
        {/* <BatchUpdateArea
          onBatchUpdate={onBatchUpdate}
          onBatchDelete={onBatchDelete}
        /> */}
      </div>
      <Table
        pagination={{
          defaultPageSize: 50,
          pageSizeOptions: [ 50, 300],
          showSizeChanger: true,
        }}
        onRow={(record) => ({
          onClick: () => {
            selectRow(record)
          },
        })}
        rowSelection={rowSelection}
        rowKey="id"
        columns={modalTableCol}
        dataSource={modalData}
        size="small"
        scroll={{ y: 400 }}
      />
    </>
  )
}
export default CategoryTable
