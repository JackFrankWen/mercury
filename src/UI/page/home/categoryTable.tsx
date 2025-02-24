import { message, Modal, Table, Tag, Tooltip, Typography } from 'antd'
import type { TableColumnsType, TableRowSelection } from 'antd'
import { getDateTostring, roundToTwoDecimalPlaces, formatMoney } from '../../components/utils'
import React, { useCallback, useEffect, useState } from 'react'
import { ColumnsType } from 'antd/es/table/interface'
import useModal from '../../components/useModal'
import { abc_type, cost_type, tag_type } from '../../const/web'
import dayjs from 'dayjs'
import { SelectionFooter } from 'src/UI/components/SelectionFooter'
import { I_Transaction } from 'src/sqlite3/transactions'
import { ModalContent } from './ModalContent'
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

export default CategoryTable
