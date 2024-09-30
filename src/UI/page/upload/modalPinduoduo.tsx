import React from "react";
import {Modal, Table} from "antd";
import dayjs from "dayjs";
function PinduoduoModal(props: any): JSX.Element {
    const columns = [
        {
            title: '商品名称',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => {
                const {orderGoods} = record;
                const name = orderGoods.map((item: any) => item.goodsName).join('');
                return name;
            }
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            render: (text: string, record: any) => {
                const {orderGoods} = record;
                const price = orderGoods.map((item: any) => item.goodsPrice).join('');
                return price;
            }
        },
        {
            title: '订单号',
            dataIndex: 'orderSn',
            key: 'orderSn',
        },
        {
            title: '购买时间',
            dataIndex: 'comment',
            key: 'comment',
            render: (text: string, record: any) => {
                const {groupOrder} = record;
                const {createAt} = groupOrder;
                return dayjs(createAt).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {
            title: '订单状态',
            dataIndex: 'orderStatusPrompt',
            key: 'action',

        }
    ];
    return (<Modal
        width={800}
        title="拼多多"
        open={props.visible}
        onOk={props.onOk}
        onCancel={props.onCancel}
    >
        <Table
            rowKey="orderSn"
            dataSource={props.dataSource}
            columns={columns}
        />
        </Modal>);
}
export default PinduoduoModal;