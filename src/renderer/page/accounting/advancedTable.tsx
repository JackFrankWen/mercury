import {
  Breadcrumb,
  Button,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  Card,
  message,
  Drawer,
  Form,
  DatePicker,
  Input,
  Select,
} from 'antd';
import { ColumnsType } from 'antd/es/table/interface';
import {
  AlipayCircleOutlined,
  BankFilled,
  ControlOutlined,
  PlusOutlined,
  WechatOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';
import { account_type, getFlowType, payment_type, tag_type } from '../../const/web';
import type { TableColumnsType, TableProps } from 'antd';
import { I_Transaction } from 'src/main/sqlite3/transactions';
import dayjs from 'dayjs';
import { SelectionFooter } from '../../components/SelectionFooter';
import { getCategoryString } from '../../const/categroy';
import AddTransactionDrawer from './AddTransactionDrawer';
import { formatMoney } from '../../components/utils';
import { findCategoryById } from '../../const/categroy';
import { renderIcon } from '../../components/FontIcon';
import { getCategoryCol, getPaymentAccountCol } from 'src/renderer/components/commonColums';
import AdvancedNewBtn from 'src/renderer/components/advancedNewBtn';
import BatchStepReplace from './batchStepRepace';

interface DataType {
  trans_time_formate: string;
  amount: string;
  category: string;
  description: string;
  account_type: number;
  payment_type: number;
  consumer: number;
  flow_type: number;
  tag: number;
  creation_time: Date;
  trans_time: Date;
  modification_time: Date;
}

// 定义消费者类型映射
const CONSUMER_TYPE_MAP = {
  1: { label: '老公', color: 'cyan' },
  2: { label: '老婆', color: 'magenta' },
  3: { label: '家庭', color: 'geekblue' },
  4: { label: '牧牧', color: 'purple' },
  5: { label: '爷爷奶奶', color: 'lime' },
  6: { label: '溪溪', color: 'orange' },
  7: { label: '姥爷', color: 'gold' },
  8: { label: '公司', color: 'green' },
} as const;

// 优化渲染价格的函数
export const renderBoldPrice = (txt: string, record: I_Transaction) => {
  if (record?.children) {
    return <span style={{ fontWeight: 'bold' }}>{formatMoney(txt)}</span>;
  }
  const amount = Number(txt);
  const type = Number(record?.flow_type) === 1 ? '-' : '+';
  return amount > 100 ? (
    <Typography.Text
      style={{ color: type === '-' ? '#f5222d' : '#52c41a' }} strong italic>{type}{formatMoney(txt)}</Typography.Text>
  ) : (
    <span style={{ color: type === '-' ? '#f5222d' : '#52c41a' }}>{type}{formatMoney(txt)}</span>
  );
};
const renderTime = (txt: Date) => {
  return <div className="ellipsis">{dayjs(txt).format('YYYY-MM-DD HH:mm:ss')}</div>;
};

const columns: ColumnsType<I_Transaction> = [
  {
    title: '交易日期',
    width: 200,
    dataIndex: 'trans_time',
    key: 'trans_time',
    render: renderTime,
    sorter: (a, b) => {
      const dateA = dayjs(a.trans_time);
      const dateB = dayjs(b.trans_time);
      return dateA.valueOf() - dateB.valueOf();
    },
  },
  getCategoryCol({
    with: 120,
    sorter: (a, b) => {
      const dateA = a.category;
      const dateB = b.category;
      return dateA.localeCompare(dateB);
    },
  }),
  {
    title: '金额',
    dataIndex: 'amount',
    render: renderBoldPrice,
    key: 'amount',
    width: 100,
    sorter: (a, b) => Number(a.amount) - Number(b.amount),
  },
  {
    title: '交易对方',
    width: 160,
    dataIndex: 'payee',
    ellipsis: true,
    key: 'payee',
    render: (payee: string) => (
      <Tooltip placement="topLeft" title={payee}>
        <div className="ellipsis">{payee}</div>
      </Tooltip>
    ),
  },
  {
    title: '交易描述',
    width: 250,
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    render: (description: string) => (
      <Tooltip placement="topLeft" title={description}>
        <div className="ellipsis">{description}</div>
      </Tooltip>
    ),
  },

  {
    title: '消费者',
    width: 80,
    dataIndex: 'consumer',
    key: 'consumer',
    render: (val: number) => {
      const consumerInfo = CONSUMER_TYPE_MAP[val as keyof typeof CONSUMER_TYPE_MAP];
      return consumerInfo ? <Tag color={consumerInfo.color}>{consumerInfo.label}</Tag> : null;
    },
  },

  {
    title: '付款方式',
    dataIndex: 'payment_type',
    width: 90,
    render: (val: number) => {
      let icon;
      if (payment_type[val] === '支付宝') {
        icon = <AlipayCircleOutlined style={{ color: '#00A0E9' }} />;
      } else if (payment_type[val] === '微信') {
        icon = <WechatOutlined style={{ color: '#07C160' }} />;
      } else {
        icon = <BankFilled style={{ color: '#00A0E9' }} />;
      }
      return (
        <span>
          {icon} {payment_type[val]}
        </span>
      );
    },
  },
  getPaymentAccountCol({
    width: 180,
  }),
  {
    title: '账户',
    dataIndex: 'account_type',
    width: 90,
    render: (val: number) => (val ? account_type[val] : ''),
  },
  {
    title: '标签',
    dataIndex: 'tag',
    width: 90,
    render: (val: number) => (val ? tag_type[val] : ''),
  },

  {
    title: '创建日期',
    dataIndex: 'creation_time',
    // render: formatTime,
    width: 200,
    key: 'creation_time',
    ellipsis: true,
    render: renderTime,
    sorter: (a, b) => {
      const dateA = dayjs(a.creation_time);
      const dateB = dayjs(b.creation_time);
      return dateA.valueOf() - dateB.valueOf();
    },
  },
  {
    title: '最后修改',
    dataIndex: 'modification_time',
    // render: formatTime,
    width: 200,
    key: 'modification_time',
    ellipsis: true,
    render: renderTime,
    sorter: (a, b) => {
      const dateA = dayjs(a.modification_time);
      const dateB = dayjs(b.modification_time);
      return dateA.valueOf() - dateB.valueOf();
    },
  },
  {
    title: '上传文件',
    dataIndex: 'upload_file_name',
    width: 100,
    ellipsis: true,
    render: (val: string) => val,
  },
  {
    title: '收支',
    dataIndex: 'flow_type',
    width: 100,
    render: (val: string) => {
      return <span style={{ color: val === '1' ? 'green' : val === '2' ? 'red' : 'blue' }}>
        {getFlowType(val)}</span>;
    },
  }, {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
    width: 100,
    render: (id: number) => id,
  }
];
type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

export function AdvancedTable(props: { data: I_Transaction[]; fresh: () => void; loading?: boolean }): JSX.Element {
  const { data, fresh, loading = false } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [addDrawerVisible, setAddDrawerVisible] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [batchReplaceVisible, setBatchReplaceVisible] = useState(false);

  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: I_Transaction[]) => {
    console.log('selectedRowKeys changed: ', selectedRows);
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedAmount(
      selectedRows.reduce((acc, item) => {
        return acc + Number(item?.amount || 0);
      }, 0)
    );
  };

  const rowSelection: TableRowSelection<I_Transaction> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div className="p-accounting-table" style={{ height: '100%' }}>
      <Row justify={'space-between'}>
        <Breadcrumb items={[{ title: '交易表格' }]} />
        <Space>
          <Button
            type="primary"
            icon={<SwapOutlined />}
            shape="round"
            style={{
              background: '#faad14',
              boxShadow: '0 2px 6px rgba(250, 173, 20, 0.3)'
            }}
            onClick={() => setBatchReplaceVisible(true)}
          >
            快速分类
          </Button>
          <AdvancedNewBtn />
          <Tooltip title="新增交易">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              shape="round"
              style={{
                background: '#000',
                boxShadow: '0 2px 6px rgba(82, 196, 26, 0.3)',
              }}
              onClick={() => setAddDrawerVisible(true)}
            >
              交易
            </Button>
          </Tooltip>
        </Space>
      </Row>

      <Table
        size="small"
        className={'mt8'}
        rowKey={'id'}
        columns={columns}
        loading={loading}
        rowSelection={{ ...rowSelection }}
        scroll={{ x: 1500, y: 'calc(100vh - 400px)' }}
        onRow={record => {
          return {
            onClick: () => {
              const newSelectedRowKeys = selectedRowKeys.includes(record.id)
                ? selectedRowKeys.filter(id => id !== record.id)
                : [...selectedRowKeys, record.id];
              setSelectedRowKeys(newSelectedRowKeys);
              setSelectedAmount(
                newSelectedRowKeys.reduce(
                  (acc, key) => acc + Number(data.find(item => item.id === key)?.amount || 0),
                  0
                )
              );
            },
          };
        }}
        dataSource={data}
        pagination={{
          defaultPageSize: 100,
          pageSizeOptions: [100, 200, 300],
          showSizeChanger: true,
          showTotal: (total, range) => `共${total}条`,
        }}
      />
      <AddTransactionDrawer
        visible={addDrawerVisible}
        onClose={() => setAddDrawerVisible(false)}
        onSuccess={() => {
          props.fresh();
        }}
      />
      {selectedRowKeys.length > 0 && (
        <SelectionFooter
          className="full-width-bottom-footer"
          selectedAmount={selectedAmount}
          onCancel={() => {
            setSelectedRowKeys([]);
          }}
          onDelete={() => {
            window.mercury.api
              .deleteTransactions(selectedRowKeys as number[])
              .then(() => {
                setSelectedRowKeys([]);
                message.success('删除成功');
                fresh();
              })
              .catch((error: any) => {
                console.error('删除失败:', error);
                message.error('删除失败');
              });
          }}
          onUpdate={(params: Partial<I_Transaction>) => {
            const obj = {
              ...params,
            };
            if (params.category) {
              obj.category = JSON.stringify(params.category);
            }

            window.mercury.api
              .updateTransactions(selectedRowKeys as number[], obj)
              .then(() => {
                setSelectedRowKeys([]);
                message.success('修改成功');
                fresh();
              })
              .catch((error: any) => {
                console.error('修改失败:', error);
                message.error('修改失败');
              });
          }}
          selectedCount={selectedRowKeys.length}
        />
      )}
      {batchReplaceVisible && (
        <BatchStepReplace
          data={data}
          visible={batchReplaceVisible}
          onClose={() => setBatchReplaceVisible(false)}
          onSuccess={() => {
            console.log('onSuccess');
            setBatchReplaceVisible(false);
            fresh();
          }}
        />
      )}
    </div>
  );
}
