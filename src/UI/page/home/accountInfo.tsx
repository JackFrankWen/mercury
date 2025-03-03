import React from 'react';
import { Card, Col, Collapse, CollapseProps, Flex, Progress, Row, Typography } from 'antd';
import { AccountBookFilled } from '@ant-design/icons';

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
const Item = (props: {
    name: string, 
    total: number, 
    percent: number,
    color: string,
    
}) => {
    const { name, total, percent, color } = props;
    return (
         <Flex  justify='start' align='center'>
            <Col 
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            >
            <AccountBookFilled  style={{fontSize: 32, color: color}}/>
            </Col>
            <Col  flex='auto' >
                <Flex justify='space-between'>
                    <Typography.Text style={{
                        fontSize: 12,
                        marginBottom: -5,
                        }} type='secondary'>{name}</Typography.Text>
                    </Flex>
                <Progress size='small'showInfo={false} percent={percent} strokeColor={color} /> 
            </Col>
            <Flex  vertical align='center'>
                <Typography.Text >{total}</Typography.Text>
                <Typography.Text style={{fontSize: 12}} type='secondary'>{percent}%</Typography.Text>
            </Flex>
            </Flex>
    )
}

function AccountInfo(props: AccountInfoProps) {
    const text = 'This is panel header 1';
    const { accountType, total, wechat, alipay } = props;
        const items: CollapseProps['items'] = [
        {
          key: '1',
          label: '老公账户',
          children: <div>
           <Item name='支付宝' total={122} percent={30} color={rainbowColors[0]} />
           <Item name='微信' total={333} percent={30} color={rainbowColors[1]} />
          </div>
        },
        
      ];
      
      
    return (
        <Card title={'账户信息'}
        size='small'
        className='mt8'
         bordered={false} hoverable>
            <Collapse
            bordered={false}
            size='small'
            items={items} defaultActiveKey={['1']} />
        </Card>
    )
}
export default AccountInfo;