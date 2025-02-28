import { Card, Col, Divider, Progress, Row, Statistic, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { AccountType, PaymentType } from 'src/UI/const/web'
import { formatMoney } from 'src/UI/components/utils'
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

  const getSumrize = async (obj) => {
    try {
      const res = await window.mercury.api.getAccountPaymentTotal(obj)
      console.log(res,'res====aaa');
      
      // if (res) {
      //   setStaticData(res)
      // }
      const husbandWechat = res.reduce((acc, item) => {
        if (Number(item.account_type) === AccountType.HUSBAND && Number(item.payment_type) === PaymentType.WECHAT) {
          acc += Number(item.total)
        }
        return acc
      }, 0)
      const wifeWechat = res.reduce((acc, item) => {
        if (Number(item.account_type) === AccountType.WIFE && Number(item.payment_type) === PaymentType.WECHAT) {
          acc += Number(item.total)
        }
        return acc
      }, 0)
        const husbandAlipay = res.reduce((acc, item) => {
        if (Number(item.account_type) === AccountType.HUSBAND && Number(item.payment_type) === PaymentType.ALIPAY) {
          acc += Number(item.total)
        }
        return acc
      }, 0)
      const wifeAlipay = res.reduce((acc, item) => {
        if (Number(item.account_type) === AccountType.WIFE && Number(item.payment_type) === PaymentType.ALIPAY) {
          acc += Number(item.total)
        }
        return acc
      }, 0)
      const husbandTotal = husbandWechat + husbandAlipay
      const wifeTotal = wifeWechat + wifeAlipay
      setStaticData({
        husband: {
          wechat: husbandWechat,
          alipay: husbandAlipay,
          total: husbandTotal,
        },
        wife: {
          wechat: wifeWechat,
          alipay: wifeAlipay,
          total: wifeTotal,
        },
        total: husbandTotal + wifeTotal,
        
      })
      
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getSumrize(formValue)
  }, [formValue])
  console.log(staticData, 'staticData====aaa');
  
//   const balance = staticData.income - staticData.total
  return (
    <>
    
      <Row className="home-section" gutter={12}>
       
        <Col span={8}>
          <Card hoverable size="small">
            <Statistic title="总支出" prefix="¥" value={staticData.total} />

            {/* <Row>
              <Col span={24}>
                <Typography.Text type='secondary'> 预算： 33</Typography.Text>
              </Col>
              <Col span={24}>
                <Typography.Text type='secondary'>结余： 33</Typography.Text>
              </Col>
            </Row> */}
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable size="small">
            <Statistic
              title="老公钱包"
              prefix="¥"
              value={staticData.husband.total}
            />

            {/* <Row>
              <Col span={24}>
                <Typography.Text type='secondary' style={{fontSize: 12}}>
                  支付宝: {formatMoney(staticData.husband.alipay)}
                </Typography.Text>
              </Col>
              <Col span={24}>
                  <Typography.Text type='secondary' style={{fontSize: 12}}>
                  微信: {formatMoney(staticData.husband.wechat)}
                </Typography.Text>
              </Col>
            </Row> */}
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable size="small">
            <Statistic
              title="老婆钱包"
              prefix="¥"
              value={staticData.wife.total}
            />

            {/* <Row>
              <Col span={24}>
                <Typography.Text type='secondary' style={{fontSize: 12}}>
                  支付宝: {formatMoney(staticData.wife.alipay)}
                </Typography.Text>
              </Col>
              <Col span={24}>
                <Typography.Text type='secondary' style={{fontSize: 12}}>
                  微信: {formatMoney(staticData.wife.wechat)}
                </Typography.Text>
              </Col>
            </Row> */}
          </Card>
        </Col>
       
        
     
      </Row>
    </>
  )
}
