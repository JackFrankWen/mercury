import { Card, Col, Divider, Progress, Row, Statistic, Typography } from 'antd'
import React, { useEffect, useState } from 'react'

export default function Summarize(props: { formValue: any }) {
  const { formValue } = props
  const gridStyle: React.CSSProperties = {
    width: '25%',
    textAlign: 'center',
  }
  const [staticData, setStaticData] = useState<any>({
    husband: {
      wechat: 0,
      alipay: 0,
      total: 0,
    },
    wife: {
      wechat: 0,
      alipay: 0,
      total: 0,
    },
    total: 0,
    income: 0,
  })

  const getSumrize = async (date: any) => {
    // try {
    //   const res = await $api.getSumrize(date)
    //   if (res) {
    //     setStaticData(res)
    //   }
    //   console.log(res, 'getSumrize')
    // } catch (error) {
    //   console.log(error)
    // }
  }
  useEffect(() => {
  }, [formValue])
//   const balance = staticData.income - staticData.total
  return (
    <>
    
      <Row className="home-section" gutter={24}>
       
        <Col span={8}>
          <Card hoverable>
            <Statistic title="总支出" prefix="¥" value={staticData.total} />

            <Divider />
            <Row>
              <Col span={12}>
                <Typography.Text> 预算： 33</Typography.Text>
              </Col>
              <Col span={12}>
                <Typography.Text>结余： 33</Typography.Text>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable>
            <Statistic
              title="老公钱包"
              prefix="¥"
              value={staticData.husband.total}
            />

            <Divider />
            <Row>
              <Col span={12}>
                <Typography.Text>
                  支付宝: {staticData.husband.alipay}
                </Typography.Text>
              </Col>
              <Col span={12}>
                <Typography.Text>
                  微信: {staticData.husband.wechat}
                </Typography.Text>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable>
            <Statistic
              title="老婆钱包"
              prefix="¥"
              value={staticData.wife.total}
            />

            <Divider />
            <Row>
              <Col span={12}>
                <Typography.Text>
                  支付宝: {staticData.wife.alipay}
                </Typography.Text>
              </Col>
              <Col span={12}>
                <Typography.Text>
                  微信: {staticData.wife.wechat}
                </Typography.Text>
              </Col>
            </Row>
          </Card>
        </Col>
       
        
     
      </Row>
    </>
  )
}
