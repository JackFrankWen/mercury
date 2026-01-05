import React from 'react';
import { Tag, Tooltip, Typography } from 'antd';
import { AlipayCircleOutlined, BankFilled, WechatOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table/interface';
import { I_Transaction } from 'src/main/sqlite3/transactions';
import dayjs from 'dayjs';
import { account_type, payment_type, tag_type, getFlowType } from 'src/renderer/const/web';
import { formatMoney } from 'src/renderer/components/utils';
import { getCategoryCol, getPaymentAccountCol } from 'src/renderer/components/commonColums';
import { CONSUMER_TYPE_MAP } from 'src/renderer/const/consumerTypes';

/**
 * 渲染金额（加粗显示大额交易）
 */
export function renderBoldPrice(txt: string, record: I_Transaction) {
  if (record?.children) {
    return <span style={{ fontWeight: 'bold' }}>{formatMoney(txt)}</span>;
  }

  const amount = Number(txt);
  const type = Number(record?.flow_type) === 1 ? '-' : '+';
  const color = type === '-' ? '#f5222d' : '#52c41a';
  const formattedAmount = `${type}${formatMoney(txt)}`;

  return amount > 100 ? (
    <Typography.Text style={{ color }} strong italic>
      {formattedAmount}
    </Typography.Text>
  ) : (
    <span style={{ color }}>{formattedAmount}</span>
  );
}

/**
 * 渲染时间
 */
function renderTime(txt: Date) {
  return <div className="ellipsis">{dayjs(txt).format('YYYY-MM-DD HH:mm:ss')}</div>;
}

/**
 * 渲染带省略号的文本（带 Tooltip）
 */
function renderEllipsisText(text: string) {
  return (
    <Tooltip placement="topLeft" title={text}>
      <div className="ellipsis">{text}</div>
    </Tooltip>
  );
}

/**
 * 渲染消费者标签
 */
function renderConsumer(val: number) {
  const consumerInfo = CONSUMER_TYPE_MAP[val as keyof typeof CONSUMER_TYPE_MAP];
  return consumerInfo ? <Tag color={consumerInfo.color}>{consumerInfo.label}</Tag> : null;
}

/**
 * 渲染付款方式（带图标）
 */
function renderPaymentType(val: number) {
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
}

/**
 * 渲染收支类型
 */
function renderFlowType(val: string) {
  const colorMap: Record<string, string> = {
    '1': 'green',
    '2': 'red',
  };

  return (
    <span style={{ color: colorMap[val] || 'blue' }}>
      {getFlowType(val)}
    </span>
  );
}

/**
 * 时间排序函数
 */
function sortByDate(dateA: Date, dateB: Date) {
  return dayjs(dateA).valueOf() - dayjs(dateB).valueOf();
}

/**
 * 表格列配置
 */
export const columns: ColumnsType<I_Transaction> = [
  {
    title: '交易日期',
    width: 200,
    dataIndex: 'trans_time',
    key: 'trans_time',
    render: renderTime,
    sorter: (a, b) => sortByDate(a.trans_time, b.trans_time),
  },
  getCategoryCol({
    with: 120,
    sorter: (a, b) => a.category.localeCompare(b.category),
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
    render: renderEllipsisText,
  },
  {
    title: '交易描述',
    width: 250,
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    render: renderEllipsisText,
  },
  {
    title: '消费者',
    width: 80,
    dataIndex: 'consumer',
    key: 'consumer',
    render: renderConsumer,
  },
  {
    title: '付款方式',
    dataIndex: 'payment_type',
    width: 90,
    render: renderPaymentType,
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
    width: 200,
    key: 'creation_time',
    ellipsis: true,
    render: renderTime,
    sorter: (a, b) => sortByDate(a.creation_time, b.creation_time),
  },
  {
    title: '最后修改',
    dataIndex: 'modification_time',
    width: 200,
    key: 'modification_time',
    ellipsis: true,
    render: renderTime,
    sorter: (a, b) => sortByDate(a.modification_time, b.modification_time),
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
    render: renderFlowType,
  },
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
    width: 100,
    render: (id: number) => id,
  },
];

