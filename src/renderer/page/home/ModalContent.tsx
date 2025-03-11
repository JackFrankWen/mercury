import { Button, message, Space, Table, Tag, Tooltip, Typography, Input} from 'antd'
import type { InputRef, TableRowSelection } from 'antd'
import React, { useRef, useState } from 'react'
import dayjs from 'dayjs'
import { SelectionFooter } from 'src/renderer/components/SelectionFooter'
import { I_Transaction } from 'src/main/sqlite3/transactions'
import { payment_type, account_type, tag_type } from '../../const/web'
import { formatMoney } from '../../components/utils'
import { FilterDropdownProps } from 'antd/es/table/interface'
interface ModalContentProps {
  modalData: any
  refresh: () => void
}

export function ModalContent({ modalData, refresh }: ModalContentProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [searchText, setSearchText] = useState('');

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection: TableRowSelection<I_Transaction> = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };
const modalTableCol = [
    {
      title: '交易时间',
      width: 160,
      dataIndex: 'trans_time',
      key: 'trans_time',
      render: (val: string) => {
        return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
      },
    },
     {
      title: '金额',
      dataIndex: 'amount',
      width: 80,
      sorter: (a, b) => Number(a.amount) - Number(b.amount),
      render: (txt: string) => {
        if (Number(txt) > 100) {
          return <Typography.Text type="danger">{formatMoney(txt)}</Typography.Text>
        }
        return `¥${formatMoney(txt)}`
      },
    },
    // payment_type
    // {
    //   title: '支付方式',
    //   dataIndex: 'payment_type',
    //   width: 120,
    //   render: (val: string) => (
    //     <Tag color="blue">{payment_type[Number(val)]}</Tag>
    //   ),
    // },
    // account_type 
  
    // payee
    {
      title: '交易对象',
      dataIndex: 'payee',
      width: 120,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder={`Search`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys as string[], confirm)}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys as string[], confirm)}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchText((selectedKeys as string[])[0]);
                setSearchedColumn();
              }}
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterSearch: true,
      onFilter: (value, record) =>
        record.description
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      filterDropdownProps: {
        onOpenChange(open) {
          if (open) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },
      },
      render: (val: string) => (
        <Tooltip placement="topLeft" title={val}>
          {val}
        </Tooltip>
      ),
    },
    {
      title: '交易描述',
      dataIndex: 'description',
      ellipsis: true,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder={`Search`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys as string[], confirm)}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys as string[], confirm)}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchText((selectedKeys as string[])[0]);
                setSearchedColumn();
              }}
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterSearch: true,
      onFilter: (value, record) =>
        record.description
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      filterDropdownProps: {
        onOpenChange(open) {
          if (open) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },
      },
      render: (description: string) => (
        <Tooltip placement="topLeft" title={description}>
          {description}
        </Tooltip>
      ),
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
      title: '账号',
      dataIndex: 'account_type',
      width: 100,
      render: (val: string) => (
        <Tag color="green">{account_type[Number(val)]}</Tag>  
      ),
    },
    {
      title: '标签',
      dataIndex: 'tag',
      width: 90,
      render: (val: number) => (val ? tag_type[val] : ''),
    },
  ]



  return (
    <>
      <div style={{ padding: '8px 0' }}>
        {selectedRowKeys.length > 0 && (
          <SelectionFooter
            onCancel={() => {
              setSelectedRowKeys([])
            }}
            onDelete={() => {
              window.mercury.api
                .deleteTransactions(selectedRowKeys as number[])
                .then(() => {
                  setSelectedRowKeys([])
                  message.success('删除成功')
                  refresh()
                })
                .catch((error: any) => {
                  console.error('删除失败:', error)
                  message.error('删除失败')
                })
            }}
            onUpdate={(params: Partial<I_Transaction>) => {
              const obj = {
                ...params,
              }
              if (params.category) {
                obj.category = JSON.stringify(params.category)
              }
              
              window.mercury.api
                .updateTransactions(selectedRowKeys as number[], obj)
                .then(() => {
                  setSelectedRowKeys([])
                  message.success('修改成功')
                  refresh()
                })
                .catch((error: any) => {
                  console.error('修改失败:', error)
                  message.error('修改失败')
                })
            }}
            selectedCount={selectedRowKeys.length}
          />
        )}
      </div>
      <Table
        pagination={{
          defaultPageSize: 50,
          pageSizeOptions: [50, 300],
          showSizeChanger: true,
        }}
        rowSelection={rowSelection}
        onRow={(record) => {
          return {
            onClick: () => {
              if (selectedRowKeys.includes(record.id)) {
                setSelectedRowKeys(selectedRowKeys.filter((id) => id !== record.id))
              } else {
                setSelectedRowKeys([...selectedRowKeys, record.id])
              }
            }
          }
        }}
        rowKey="id"
        columns={modalTableCol}
        dataSource={modalData}
        size="small"
        scroll={{ y: 'calc(100vh - 400px)' }}
      />
    </>
  )
} 