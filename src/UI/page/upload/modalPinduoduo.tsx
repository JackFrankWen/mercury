import React from "react";
import {Modal, Table} from "antd";
function PinduoduoModal(props: any): JSX.Element {
    const columns = [
        {
            title: '商品名称',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => {

            }
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '订单号',
            dataIndex: 'sales',
            key: 'sales',
        },
        {
            title: '购买时间',
            dataIndex: 'comment',
            key: 'comment',
        },
        {
            title: '订单状态',
            dataIndex: 'orderStatusPrompt',
            key: 'action',

        }
    ];
    return (<Modal
        title="拼多多"
        open={props.visible}
        onOk={props.onOk}
        onCancel={props.onCancel}
    >
        <Table
            dataSource={props.dataSource}
            columns={columns}
        />
        </Modal>);
}