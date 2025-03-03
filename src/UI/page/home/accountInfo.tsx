import React, { useEffect, useState } from 'react';
import { Card, Col, Collapse, CollapseProps, Flex, Progress, Row, Typography } from 'antd';
import { AccountBookFilled } from '@ant-design/icons';
import { getAccountType, getPaymentType} from 'src/UI/const/web';
import { formatMoney } from 'src/UI/components/utils';

interface AccountInfoProps {
    accountType: string;
    total: number;
    wechat: number;
    alipay: number;
}
const rainbowColors = [
    "#ff5a5a",  // 红色
    "#ff9f40",  // 橙色
    "#eccf10",  // 黄色 (原始色)
    "#4ecb73",  // 绿色
    "#39c5bb",  // 青色
    "#4a8af4",  // 蓝色
    "#9d7fe8",  // 紫色
    "#e77fc0",  // 粉色
];
const useAccountInfo = (formValue: any) => {
    const [data, setData] = useState<{ account_type: string, total: number, payment_type: string }[]>([])
    const getSumrize = async (obj: any) => {
        try {
            const res = await window.mercury.api.getAccountPaymentTotal(obj)
            setData(res)

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getSumrize(formValue)
    }, [formValue])
    return {
        data,
        getSumrize
    }
}
const Item = (props: {
    name: string,
    total: string,
    percent: number,
    color: string,

}) => {
    const { name, total, percent, color } = props;
    return (
        <Flex justify='start' align='center'>
            <Col
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                <AccountBookFilled style={{ fontSize: 32, color: color }} />
            </Col>
            <Col flex='auto' >
                <Flex justify='space-between'>
                    <Typography.Text style={{
                        fontSize: 12,
                        marginBottom: -5,
                    }} type='secondary'>{name}</Typography.Text>
                </Flex>
                <Progress size='small' showInfo={false} percent={percent} strokeColor={color} />
            </Col>
            <Flex vertical align='center'>
                <Typography.Text >{total}</Typography.Text>
                <Typography.Text style={{ fontSize: 12 }} type='secondary'>{percent}%</Typography.Text>
            </Flex>
        </Flex>
    )
}

function AccountInfo(props: { formValue: any }) {
    const { formValue } = props;
    const { data, } = useAccountInfo(formValue)
    const newData = data.reduce((acc: any, item: any) => {
        //{account_type: string, total: number, children:[{payment_type: string, total: number}]}
        if (!acc[item.account_type]) {
            acc[item.account_type] = {
                account_type: getAccountType(item.account_type),
                total: item.total,
                children: [{payment_type: getPaymentType(item.payment_type), total: item.total}]
            }
        } else {
            acc[item.account_type].total += Math.floor(item.total)
            acc[item.account_type].children.push({payment_type: getPaymentType(item.payment_type), total: Math.floor(item.total)})
        }
        return acc
    }, {})
    const items: CollapseProps['items'] = Object.values(newData).map((item, index) => {
        return {
            key: index,
            label: <Flex justify='space-between' align='center'>
                <Typography.Text style={{ fontSize: 12, fontWeight: 500 }}>{item.account_type}</Typography.Text>
                <Typography.Text style={{ fontSize: 12, fontWeight: 500 }}>{formatMoney(item.total, '万')}</Typography.Text>
            </Flex>,
            children: item.children.map((child: any, childIndex: number) => {
                // 百分号取整
                const percent = Math.floor(child.total / item.total * 100)
                return <Item name={child.payment_type} total={formatMoney(child.total)} percent={percent} color={rainbowColors[childIndex]} />
            })
        }
    })
    console.log(items, 'items====');



    return (
        <Card title={'账户信息'}
            size='small'
            className='mt8'
            bordered={false} hoverable>
            <Collapse
                bordered={false}
                size='small'
                items={items} defaultActiveKey={[0,1]} />
        </Card>
    )
}
export default AccountInfo;