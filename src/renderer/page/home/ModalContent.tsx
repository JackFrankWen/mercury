import { Button, message, Space, Table, Tag, Tooltip, Typography, Input, Spin } from 'antd';
import type { InputRef, TableRowSelection } from 'antd';
import React, { useRef, useState, useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import { SelectionFooter } from 'src/renderer/components/SelectionFooter';
import { I_Transaction } from 'src/main/sqlite3/transactions';
import { payment_type, account_type, tag_type } from '../../const/web';
import { formatMoney } from '../../components/utils';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { getCategoryCol } from 'src/renderer/components/commonColums';

interface ModalContentProps {
  modalData: I_Transaction[];
  refresh?: () => void;
  withCategory?: boolean;
  onCancel: () => void;
  loading?: boolean;
}

// Define consumer types as a constant
const CONSUMER_TYPES: Record<number, { label: string; color: string }> = {
  1: { label: '老公', color: 'cyan' },
  2: { label: '老婆', color: 'magenta' },
  3: { label: '家庭', color: 'geekblue' },
  4: { label: '牧牧', color: 'purple' },
  5: { label: '爷爷奶奶', color: 'lime' },
  6: { label: '溪溪', color: 'orange' },
  7: { label: '姥爷', color: 'gold' },
};

// Create a reusable filter dropdown component
const FilterDropdown: React.FC<{
  setSelectedKeys: (keys: React.Key[]) => void;
  selectedKeys: React.Key[];
  confirm: FilterDropdownProps['confirm'];
  clearFilters: () => void;
  close: () => void;
  searchInput: React.RefObject<InputRef>;
  handleSearch: (keys: string[], confirm: FilterDropdownProps['confirm']) => void;
  handleReset: (clearFilters: () => void) => void;
}> = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  close,
  searchInput,
  handleSearch,
  handleReset,
}) => (
    <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
      <Input
        ref={searchInput}
        placeholder="Search"
        value={selectedKeys[0]}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
          Close
        </Button>
      </Space>
    </div>
  );

export function ModalContent({
  modalData,
  refresh,
  withCategory = false,
  onCancel,
  loading = false,
}: ModalContentProps) {
  console.log(modalData, 'modalData=ooooooo===');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tableData, setTableData] = useState<I_Transaction[]>(modalData);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const searchInput = useRef<InputRef>(null);

  const handleSearch = useCallback(
    (selectedKeys: string[], confirm: FilterDropdownProps['confirm']) => {
      confirm();
    },
    []
  );

  const handleReset = useCallback((clearFilters: () => void) => {
    clearFilters();
  }, []);

  const onSelectChange = useCallback(
    (newSelectedRowKeys: React.Key[], selectedRows: I_Transaction[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
      setSelectedAmount(selectedRows.reduce((acc, item) => acc + Number(item.amount), 0));
    },
    []
  );

  const handleDeleteTransactions = useCallback(() => {
    window.mercury.api
      .deleteTransactions(selectedRowKeys as number[])
      .then(() => {
        setSelectedRowKeys([]);
        message.success('删除成功');
        const newTableData = tableData.filter(item => !selectedRowKeys.includes(item.id));
        setTableData(newTableData);
        if (newTableData.length === 0) {
          onCancel();
        }
        if (refresh) {
          refresh();
        }
      })
      .catch((error: Error) => {
        console.error('删除失败:', error);
        message.error('删除失败');
      });
  }, [selectedRowKeys, refresh]);

  const handleUpdateTransactions = useCallback(
    (params: Partial<I_Transaction>) => {
      const obj = { ...params };
      if (params.category) {
        obj.category = JSON.stringify(params.category);
      }

      window.mercury.api
        .updateTransactions(selectedRowKeys as number[], obj)
        .then(() => {
          setSelectedRowKeys([]);
          message.success('修改成功');
          refresh();
          const newTableData: I_Transaction[] = []
          modalData.forEach(item => {
            if (selectedRowKeys.includes(item.id)) {
              if (item.category === obj.category) {
                newTableData.push({ ...item, ...obj });
              }
            } else {
              newTableData.push(item);
            }
          });
          setTableData(newTableData);
        })
        .catch((error: Error) => {
          console.error('修改失败:', error);
          message.error('修改失败');
        });
    },
    [selectedRowKeys, refresh]
  );

  const rowSelection: TableRowSelection<I_Transaction> = useMemo(
    () => ({
      selectedRowKeys,
      onChange: onSelectChange,
    }),
    [selectedRowKeys, onSelectChange]
  );

  const modalTableCol = useMemo(
    () => [
      {
        title: '交易时间',
        width: 170,
        dataIndex: 'trans_time',
        key: 'trans_time',
        render: (val: string) => dayjs(val).format('YYYY-MM-DD HH:mm:ss'),
      },
      getCategoryCol({
        width: 120,
      }),
      {
        title: '金额',
        dataIndex: 'amount',
        width: 90,
        sorter: (a: I_Transaction, b: I_Transaction) => Number(a.amount) - Number(b.amount),
        render: (txt: string) => {
          if (Number(txt) > 100) {
            return <Typography.Text type="danger">{formatMoney(txt)}</Typography.Text>;
          }
          return `¥${formatMoney(txt)}`;
        },
      },
      {
        title: '交易对象',
        dataIndex: 'payee',
        width: 120,
        ellipsis: true,
        filterDropdown: props => (
          <FilterDropdown
            {...props}
            searchInput={searchInput}
            handleSearch={handleSearch}
            handleReset={handleReset}
          />
        ),
        filterSearch: true,
        onFilter: (value: string, record: I_Transaction) =>
          record.payee.toString().toLowerCase().includes(value.toLowerCase()),
        filterDropdownProps: {
          onOpenChange(open: boolean) {
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
        filterDropdown: props => (
          <FilterDropdown
            {...props}
            searchInput={searchInput}
            handleSearch={handleSearch}
            handleReset={handleReset}
          />
        ),
        filterSearch: true,
        onFilter: (value: string, record: I_Transaction) =>
          record.description.toString().toLowerCase().includes(value.toLowerCase()),
        filterDropdownProps: {
          onOpenChange(open: boolean) {
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
          const consumerInfo = CONSUMER_TYPES[val] || CONSUMER_TYPES[6];
          return <Tag color={consumerInfo.color}>{consumerInfo.label}</Tag>;
        },
      },
      {
        title: '账号',
        dataIndex: 'account_type',
        width: 100,
        render: (val: string) => <Tag color="green">{account_type[Number(val)]}</Tag>,
      },
      {
        title: '标签',
        dataIndex: 'tag',
        width: 90,
        render: (val: number) => (val ? tag_type[val] : ''),
      },
    ],
    [handleSearch, handleReset]
  );

  const handleRowClick = useCallback(
    (record: I_Transaction) => {
      return {
        onClick: () => {
          // const newSelectedRowKeys = selectedRowKeys  [...selectedRowKeys, record.id]
          const newSelectedRowKeys = selectedRowKeys.includes(record.id)
            ? selectedRowKeys.filter(id => id !== record.id)
            : [...selectedRowKeys, record.id];
          setSelectedRowKeys(newSelectedRowKeys);
          setSelectedAmount(
            newSelectedRowKeys.reduce(
              (acc, key) => acc + Number(modalData.find(item => item.id === key)?.amount || 0),
              0
            )
          );
        },
      };
    },
    [selectedRowKeys, selectedAmount]
  );

  const handleCancelSelection = useCallback(() => {
    setSelectedRowKeys([]);
  }, []);
  const tableCol = withCategory
    ? modalTableCol
    : modalTableCol.filter(item => !item.dataIndex?.includes('category'));


  return (
    <Spin spinning={loading}>
      <div style={{ padding: '8px 0' }}>
        {selectedRowKeys.length > 0 && (
          <SelectionFooter
            selectedAmount={selectedAmount}
            onCancel={handleCancelSelection}
            onDelete={handleDeleteTransactions}
            onUpdate={handleUpdateTransactions}
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
        onRow={handleRowClick}
        rowKey="id"
        columns={tableCol}
        dataSource={modalData}
        size="small"
        scroll={{ y: 'calc(100vh - 400px)' }}
      />
    </Spin>
  );
}
