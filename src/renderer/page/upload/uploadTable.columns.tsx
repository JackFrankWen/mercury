import React from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm, Space, Tooltip, Typography } from 'antd';
import type { ColumnType } from 'antd/es/table';
import { account_type, getConsumerType, getTagType } from '../../const/web';
import { getCategoryCol, getPaymentAccountCol } from '../../components/commonColums';
import type { GetColumnSearchProps } from './uploadTable.types';

interface CreateColumnsParams {
  getColumnSearchProps: GetColumnSearchProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDelete: (record: any) => void;
}

export function createUploadTableColumns({
  getColumnSearchProps,
  onDelete,
}: CreateColumnsParams): ColumnType<any>[] {
  return [
    {
      title: '序号',
      dataIndex: 'index',
      width: 50,
      fixed: 'left',
      render: (_: number, __: unknown, index: number) => index + 1,
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
        if (!val) return '';
        if (!flow_type) return 'flow_type 为空';
        if (/[\u4e00-\u9fa5]/.test(val)) {
          return <Typography.Text type="warning">这条数据有问题</Typography.Text>;
        }
        let child;
        if (flow_type === 1) {
          child = '支：';
        } else if (flow_type === 2) {
          child = '收：';
        } else if (flow_type === 3) {
          child = '不计支出:';
        }
        const type = flow_type === 1 ? 'danger' : 'success';
        return (
          <Space>
            <Typography.Text type={type}>
              {child} ¥{val}
            </Typography.Text>
          </Space>
        );
      },
      width: 140,
    },
    getCategoryCol({
      width: 120,
      defaultCheck: false,
    }),
    {
      title: '交易对方',
      dataIndex: 'payee',
      ellipsis: true,
      width: 120,
      ...getColumnSearchProps('payee'),
      render: (val: string) => (
        <Tooltip title={val}>
          <span>{val}</span>
        </Tooltip>
      ),
    },
    {
      title: '交易描述',
      dataIndex: 'description',
      ellipsis: true,
      ...getColumnSearchProps('description'),
      render: (val: string) => (
        <Tooltip title={val}>
          <span>{val}</span>
        </Tooltip>
      ),
    },
    {
      title: '消费者',
      width: 100,
      dataIndex: 'consumer',
      defaultCheck: false,
      key: 'consumer',
      render: (text: string) => getConsumerType(text),
    },
    getPaymentAccountCol({
      width: 180,
    }),
    {
      title: '账户',
      dataIndex: 'account_type',
      width: 80,
      render: (val: number) => (val ? account_type[val] : ''),
    },
    {
      title: '标签',
      dataIndex: 'tag',
      width: 80,
      render: (val: number) => getTagType(val),
    },
    {
      title: '上传文件名字',
      dataIndex: 'upload_file_name',
      ellipsis: true,
      width: 120,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 50,
      render: (_: unknown, record: any) => {
        return (
          <Space>
            <Popconfirm
              title="Are you sure to delete this task?"
              onConfirm={() => onDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined style={{ color: 'red' }} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
}

