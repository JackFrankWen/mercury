import { Button, Spin, Tooltip, Popconfirm, Space, Table, Transfer } from "antd";
import React, { useState } from "react";
import { getCategoryString } from "src/UI/const/categroy";
import type { GetProp, TableColumnsType, TableProps, TransferProps } from 'antd';

type TransferItem = GetProp<TransferProps, 'dataSource'>[number];
type TableRowSelection<T extends object> = TableProps<T>['rowSelection'];

interface TableTransferProps extends TransferProps<TransferItem> {
    dataSource: any[];
    leftColumns: TableColumnsType<any>;
    rightColumns: TableColumnsType<any>;
  }
export default function GenerateContent(): JSX.Element {
    const [loading, setLoading] = useState(false);
    const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>([]);

    const [data, setData] = useState<any[]>([]);
    const onGenerate = async () => {
        setLoading(true);
        const res = await window.mercury.api.generateRule({ trans_time: ['2020-01-01', '2025-12-02'] });
        console.log(res, 'res');
        setLoading(false);
        setData(res);
    }

    const onDelete = (record: any) => {
        const newData = data.filter((item: any) => item.id !== record.id);
        setData(newData);
    }

    const columns = [
       

        {
            title: '分类',
            dataIndex: 'category',
            defaultCheck: false,
            render: (val: string) => {
                return getCategoryString(val)
            },
        },
        {
            title: '交易对方',
            dataIndex: 'payee',
            ellipsis: true,
            render: (val: string) => (
                <Tooltip title={val}>
                    <span>{val}</span>
                </Tooltip>
            )
        },
        {
            title: '描述',
            dataIndex: 'description',
            ellipsis: true,
            render: (val: string) => (
                <Tooltip title={val}>
                    <span>{val}</span>
                </Tooltip>
            )
        },
      
    ]
    const onChange: TableTransferProps['onChange'] = (nextTargetKeys) => {
        setTargetKeys(nextTargetKeys);
        console.log(nextTargetKeys, 'nextTargetKeys');
        
    };
    return (
        <Spin spinning={loading}>
            <Space>
                <Button onClick={onGenerate} loading={loading}>生成规则</Button>
                <Button type="primary" disabled={targetKeys.length === 0}>提交</Button>
            </Space>

            <TableTransfer
            className="mt8"
            rowKey={(record) => record.id} 
        dataSource={data}
        targetKeys={targetKeys}
        operations={['生成的规则', '']}
        showSelectAll={true}
        onChange={onChange}
        leftColumns={columns}
        rightColumns={columns}
      />
        </Spin>
    );
}
// Customize Table Transfer
const TableTransfer: React.FC<TableTransferProps> = (props) => {
    const { leftColumns, rightColumns, ...restProps } = props;
    return (
      <Transfer style={{ width: '100%' }} {...restProps}>
        {({
          direction,
          filteredItems,
          onItemSelect,
          onItemSelectAll,
          selectedKeys: listSelectedKeys,
          disabled: listDisabled,
        }) => {
          const columns = direction === 'left' ? leftColumns : rightColumns;
          const rowSelection: TableRowSelection<TransferItem> = {
            getCheckboxProps: () => ({ disabled: listDisabled }),
            onChange(selectedRowKeys) {
              onItemSelectAll(selectedRowKeys, 'replace');
            },
            selectedRowKeys: listSelectedKeys,
            selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
          };
          console.log(filteredItems,'===aaa');
          
  
          return (
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredItems}
              rowKey={(record) => record.id}
              size="small"
              pagination={false}
              style={{ pointerEvents: listDisabled ? 'none' : undefined }}
              onRow={({ key, disabled: itemDisabled }) => ({
                onClick: () => {
                  if (itemDisabled || listDisabled) {
                    return;
                  }
                  onItemSelect(key, !listSelectedKeys.includes(key));
                },
              })}
            />
          );
        }}
      </Transfer>
    );
  };