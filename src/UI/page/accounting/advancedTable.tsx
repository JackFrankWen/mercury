import {Breadcrumb, Button, Row, Space, Table, Tag, Tooltip,
    Typography, Card
} from "antd";
import { ColumnsType } from 'antd/es/table/interface'
import {ControlOutlined, PlusOutlined} from "@ant-design/icons";
import React from "react";
import {account_type, cost_type, payment_type, tag_type} from "../../const/web";
import type { TableColumnsType, TableProps } from 'antd';

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

const renderBoldPrice = (txt: string, obj: any) => {
    if (obj?.children) {
        return <span style={{ fontWeight: 'bold' }}>{txt}</span>
    }
    if (Number(txt) > 100) {
        return <Typography.Text type="danger">{txt}</Typography.Text>
    }
    return txt
}
const columns: ColumnsType<DataType> = [
    {
        title: '交易日期',
        width: 200,
        dataIndex: 'trans_time',
        key: 'trans_time',
    },
    {
        title: '描述',
        width: 250,
        dataIndex: 'description',
        key: 'description',
        render: (description: string) => (
            <Tooltip placement="topLeft" title={description}>
                <div className="ellipsis">{description}</div>
            </Tooltip>
        ),
    },
    { title: '分类', dataIndex: 'name', key: 'name', width: 120 },
    {
        title: '金额',
        dataIndex: 'amount',
        render: renderBoldPrice,
        key: 'amount',
        width: 120,
    },

    {
        title: '消费者',
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
                6: '二宝',
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
        dataIndex: 'creation_time_formate',
        // render: formatTime,
        key: 'creation_time',
        ellipsis: true,
    },
    {
        title: '最后修改',
        dataIndex: 'modification_time_formate',
        // render: formatTime,

        key: 'modification_time',
        ellipsis: true,
    },
]
type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];
function SelectionFooter(props: any) {
   return(
       <Row justify='space-between' align='middle' className='table-footer'>

           <div>选择 1个</div>
           <Space>
               <Button danger>批量删除</Button>
               <Button type="primary">批量修改</Button>
           </Space>
       </Row>
   )
}
export function AdvancedTable(props: any): JSX.Element {
    const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);



    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<DataType> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <>
            <Row justify={'space-between'}>
                {/* <Breadcrumb items={[{
                    title: '记账',
                }]}/> */}
                <Space>
                    <Button icon={<PlusOutlined/>} type="primary">新增</Button>
                </Space>
            </Row>

            <Table
                className={'mt8'}
                rowKey={'id'}
                columns={columns}
                rowSelection={{  ...rowSelection }}
                scroll={{ x: 1300 }}
                dataSource={[
                    {
                        id: 1,
                        name: '张三',
                        age: 18,
                    },
                    {
                        id: 2,
                        name: '李四',
                        age: 19,
                    },
                ]}
            />
            {
                selectedRowKeys.length > 0 && (<SelectionFooter />)

            }
        </>
    )
}