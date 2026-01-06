import React from 'react';
import { Card, Col, Collapse, CollapseProps, Flex, Progress, Row, Typography } from 'antd';
import {
  AccountBookFilled,
  AlipayCircleOutlined,
  BankFilled,
  WechatOutlined,
} from '@ant-design/icons';
import { getAccountType, getPaymentType } from 'src/renderer/const/web';
import { formatMoney } from 'src/renderer/components/utils';

interface AccountPaymentData {
  account_type: string;
  total: number;
  payment_type: string;
}

interface AccountInfoProps {
  data: AccountPaymentData[];
  onRefresh?: () => void;
}
const rainbowColors = [
  '#ff5a5a', // 红色
  '#ff9f40', // 橙色
  '#eccf10', // 黄色 (原始色)
  '#4ecb73', // 绿色
  '#39c5bb', // 青色
  '#4a8af4', // 蓝色
  '#9d7fe8', // 紫色
  '#e77fc0', // 粉色
];

const Item = (props: { name: string; total: string; percent: number; color: string }) => {
  const { name, total, percent, color } = props;
  let icon, progressColor;
  if (name === '支付宝') {
    icon = <AlipayCircleOutlined style={{ fontSize: 32, color: '#00A0E9' }} />;
    progressColor = '#00A0E9';
  } else if (name === '微信') {
    icon = <WechatOutlined style={{ fontSize: 32, color: '#07C160' }} />;
    progressColor = '#07C160';
  } else if (['银行'].includes(name)) {
    icon = <BankFilled style={{ fontSize: 32, color: color }} />;
    progressColor = color;
  } else {
    icon = <AccountBookFilled style={{ fontSize: 32, color: color }} />;
    progressColor = color;
  }
  return (
    <Row justify="space-between" align="bottom" style={{ marginBottom: 2 }}>
      <Col
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 8,
        }}
      >
        {icon}
      </Col>
      <Col flex="auto">
        <Row justify="space-between" align="middle" style={{ marginBottom: -8 }}>
          <Typography.Text
            style={{
              fontSize: 12,
              marginBottom: -5,
            }}
            type="secondary"
          >
            {name}
          </Typography.Text>
          <Typography.Text>{total}</Typography.Text>
        </Row>
        <Row justify="space-between">
          <Col flex="auto">
            <Progress size="small" showInfo={false} percent={percent} strokeColor={progressColor} />
          </Col>
          <Col>
            <Typography.Text style={{ fontSize: 12, paddingLeft: 10 }} type="secondary">
              {percent}%
            </Typography.Text>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

function AccountInfo(props: AccountInfoProps) {
  const { data } = props;
  const newData = data.reduce((acc: any, item: any) => {
    //{account_type: string, total: number, children:[{payment_type: string, total: number}]}
    if (!acc[item.account_type]) {
      acc[item.account_type] = {
        account_type: getAccountType(item.account_type),
        total: item.total,
        children: [
          {
            payment_type: getPaymentType(item.payment_type),
            total: item.total,
          },
        ],
      };
    } else {
      acc[item.account_type].total += Math.floor(item.total);
      acc[item.account_type].children.push({
        payment_type: getPaymentType(item.payment_type),
        total: Math.floor(item.total),
      });
    }
    return acc;
  }, {});
  const items: CollapseProps['items'] = Object.values(newData).map((item, index) => {
    return {
      key: index,
      label: (
        <Flex justify="space-between" align="center">
          <Typography.Text style={{ fontSize: 12, fontWeight: 500 }}>
            {item.account_type}
          </Typography.Text>
          <Typography.Text style={{ fontSize: 12, fontWeight: 500 }}>
            {formatMoney(item.total, '万', true)}
          </Typography.Text>
        </Flex>
      ),
      children: item.children.map((child: any, childIndex: number) => {
        // 百分号取整
        const percent = Math.floor((child.total / item.total) * 100);
        return (
          <Item
            name={child.payment_type}
            total={formatMoney(child.total)}
            percent={percent}
            color={rainbowColors[childIndex]}
          />
        );
      }),
    };
  });

  return (
    <Card title={'账户支出'} size="small" className="mt8" bordered={false} hoverable>
      <Collapse bordered={false} size="small" items={items} defaultActiveKey={[0, 1]} />
    </Card>
  );
}
export default AccountInfo;
