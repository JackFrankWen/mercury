import {Breadcrumb, Button, Row, Space, Table, Tag, Tooltip,
    Typography, Card,
    message, Drawer, Form, DatePicker, Input, Select
} from "antd";
import { ColumnsType } from 'antd/es/table/interface'
import {ControlOutlined, PlusOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {account_type, cost_type, payment_type, tag_type} from "../../const/web";
import type { TableColumnsType, TableProps } from 'antd';
import { I_Transaction,  } from "src/sqlite3/transactions";
import dayjs from "dayjs";
import { SelectionFooter } from './SelectionFooter';
import { getCategoryString } from "../../const/categroy";
import AddTransactionDrawer from './AddTransactionDrawer';

interface DataType {
    trans_time_formate: string
    amount: string
    category: string
    description: string
    account_type: number
    payment_type: number
    consumer: number
    flow_type: number
    tag: number
    abc_type: number
    cost_type: number
    creation_time: Date
    trans_time: Date
    modification_time: Date
}

// 定义消费者类型映射
const CONSUMER_TYPE_MAP = {
    1: { label: '老公', color: 'cyan' },
    2: { label: '老婆', color: 'magenta' },
    3: { label: '家庭', color: 'geekblue' },
    4: { label: '牧牧', color: 'purple' },
    5: { label: '爷爷奶奶', color: 'lime' },
    6: { label: '二宝', color: 'orange' },
} as const;

// 优化渲染价格的函数
const renderBoldPrice = (txt: string, record: I_Transaction) => {
    if (record?.children) {
        return <span style={{ fontWeight: 'bold' }}>{txt}</span>;
    }
    const amount = Number(txt);
    return amount > 100 ? (
        <Typography.Text type="danger">{txt}</Typography.Text>
    ) : txt;
};
const renderTime = (txt: Date) => {
    return <div className="ellipsis">{dayjs(txt).format('YYYY-MM-DD HH:mm:ss')}</div>
}
const renderTimeSqlite = (txt: Date) => {
    return <div className="ellipsis">{dayjs(txt).add(8, 'hours').format('YYYY-MM-DD HH:mm:ss')}</div>
}

const columns: ColumnsType<I_Transaction> = [
    {
        title: '交易日期',
        width: 200,
        dataIndex: 'trans_time',
        key: 'trans_time',
        render: renderTime,

    },
    {
        title: '分类',
        dataIndex: 'category',
        key: 'category',
        width: 140,
        render: (category: string) => getCategoryString(category, 1),
    },
     {
        title: '金额',
        dataIndex: 'amount',
        render: renderBoldPrice,
        key: 'amount',
        width: 120,
    },
    {
        title: '交易对方',
        width: 100,
        dataIndex: 'payee',
        key: 'payee',
        render: (payee: string) => (
            <Tooltip placement="topLeft" title={payee}>
                <div className="ellipsis">{payee}</div>
            </Tooltip>
        )
    },
    {
        title: '描述',
        width: 250,
        dataIndex: 'description',
        key: 'description',
        className: 'ellipsis',
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
            return consumerInfo ? (
                <Tag color={consumerInfo.color}>{consumerInfo.label}</Tag>
            ) : null;
        },
    },

    {
        title: '付款方式',
        dataIndex: 'payment_type',
        width: 90,
        render: (val: number) => (val ? payment_type[val] : ''),
    },
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
    // {
    //     title: '消费方式',
    //     dataIndex: 'cost_type',
    //     width: 100,
    //     render: (val: number) => (val ? cost_type[val] : ''),
    // },
    {
        title: '创建日期',
        dataIndex: 'creation_time',
        // render: formatTime,
        width: 200,
        key: 'creation_time',
        ellipsis: true,
        render: renderTimeSqlite,
    },
    {
        title: '最后修改',
        dataIndex: 'modification_time',
        // render: formatTime,
        width: 200,
        key: 'modification_time',
        ellipsis: true, 
        render: renderTimeSqlite,
    },
]
type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

export function AdvancedTable(props: {
    data: I_Transaction[],
    fresh: () => void
}): JSX.Element {
    const {data, fresh} = props;
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [addDrawerVisible, setAddDrawerVisible] = useState(false);

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<I_Transaction> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <div className="p-accounting-table" style={{height: '100%'}}>
            <Row justify={'space-between'}>
                {/* <Breadcrumb items={[{
                    title: '记账',
                }]}/> */}
                <Space>
                    <Button 
                        icon={<PlusOutlined/>} 
                        type="primary" 
                        onClick={() => setAddDrawerVisible(true)}
                    >
                        新增
                    </Button>
                </Space>
            </Row>

            <Table
                style={{maxHeight: 400, overflow: 'auto'}}
                
                className={'mt8'}
                rowKey={'id'}
                columns={columns}
                rowSelection={{  ...rowSelection }}
                scroll={{ x: 1300, y: window.innerHeight - 400 }}
                dataSource={data}
                pagination={{
                    defaultPageSize: 10,
                    pageSizeOptions: [10, 20, 50],
                    showSizeChanger: true,
                  }}
            />
            <AddTransactionDrawer 
                visible={addDrawerVisible}
                onClose={() => setAddDrawerVisible(false)}
                onSuccess={() => {
                    props.fresh();
                }}
            />
            {
                selectedRowKeys.length > 0 && (<SelectionFooter 
                    onCancel={() => {
                        setSelectedRowKeys([]);
                    }}
                    onDelete={() => {
                        window.mercury.api.deleteTransactions(selectedRowKeys as number[])
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
                    onUpdate={( params: Partial<I_Transaction>) => {
                        console.log('===params', params);
                        const obj = {
                            ...params,
                        }
                        if (params.category) {
                            obj.category = JSON.stringify(params.category)
                        }
                        console.log('===obj', obj);
                        
                        window.mercury.api.updateTransactions(
                             selectedRowKeys as number[],
                            obj
                        ).then(() => {
                            setSelectedRowKeys([]);
                            message.success('修改成功');
                            fresh();
                        })
                        .catch((error: any) => {
                            console.error('修改失败:', error);
                            message.error('修改失败');
                        });
                    }}  
                    selectedCount={selectedRowKeys.length} />)

            }
        </div>
    )
}