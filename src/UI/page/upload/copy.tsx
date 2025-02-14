import React, { useEffect, useState } from 'react'
import { Button, Result, UploadProps } from 'antd'
import { Upload, Tabs } from 'antd'
import Papa from 'papaparse'
import './importing-bills.less'
import BasicTable from './importing-table'

import { toNumberOrUndefiend } from '@/src/components/utils'
import {
  formateToTableAlipay,
  formateToTableAlipayHeader,
  formateToTableDataWechat,
  formateToTableWechatHeader,
} from './upload-utils'
const { Dragger } = Upload

function setCategory(arr: any, rules: any) {
  return arr.map((val: any) => {
    for (const element of rules) {
      const reg = new RegExp(element.rule)
      const hasRule = reg.test(val.description)
      if (hasRule) {
        return {
          ...val,
          category: element.category,
          consumer: toNumberOrUndefiend(element.consumer) || val.consumer,
          tag: toNumberOrUndefiend(element.tag) || val.tag,
          cost_type: toNumberOrUndefiend(element.cost_type) || val.cost_type,
          abc_type: toNumberOrUndefiend(element.abc_type) || val.abc_type,
        }
      }
    }
    return {
      ...val,
    }
  })
}
//   ["------------------------------------------------------------------------------------"],
//   ["导出信息："],
//   ["姓名：文素能"],
//   ["支付宝账户：79071077@qq.com"],
//   ["起始时间：[2024-11-12 00:00:00]    终止时间：[2025-02-12 23:59:59]"],
//   ["导出交易类型：[全部]"],
//   ["导出时间：[2025-02-12 17:23:13]"],
//   ["共252笔记录"],
//   ["收入：0笔 0.00元"],
//   ["支出：224笔 7292.83元"],
//   ["不计收支：28笔 644.22元"],
//   ["特别提示："],
//   [
//     "1.本回单内容可表明支付宝受理了相应支付交易申请，因系统原因或通讯故障等偶发因素导致本回单与实际交易结果不符时，以实际交易情况为准；"
//   ],
//   [
//     "2.请勿将本回单作为收款方发货的凭据使用，请查证账户实际到账情况后再进行发货操作；"
//   ],
//   [
//     "3.支付宝快捷支付等非余额支付方式可能既产生支付宝交易也同步产生银行交易，因此请勿使用本回单进行重复记账；"
//   ],
//   [
//     "4.本回单如经任何涂改、编造，均立即失去效力；"
//   ],
//   [
//     "5.部分账单如：充值提现、账户转存或者个人设置收支等不计入为收入或者支出，记为不计收支类；"
//   ],
//   [
//     "6.因统计逻辑不同，明细金额直接累加后，可能会和下方统计金额不一致，请以实际交易金额为准；"
//   ],
//   [
//     "7.禁止将本回单用于非法用途；"
//   ],
//   [
//     "8.本明细仅展示当前账单中的交易，不包括已删除的记录；"
//   ],
//   [
//     "9.本明细仅供个人对账使用。"
//   ],
//   ["------------------------支付宝（中国）网络技术有限公司  电子客户回单------------------------"]



const AlipayUpload = (props: { ruleData: any }) => {
  const [tableData, setTableData] = useState([])
  const [tableHeader, setTableHeader] = useState({
    name: '',
    date: '',
    titleCostLabel: '',
    fileName: '',
    titleCost: '',
    titleIncomeLabel: '',
    titleIncome: '',
    account_type: 0,
  })

  const [uploadVisable, setUploadVisiable] = useState(true)
  const [tableVisable, setTableVisable] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const ALIPAY = 1
  const WECHAT = 2
  const uploadProps: UploadProps = {
    name: 'file',
    fileList: [],
    beforeUpload: (file) => {
      Papa.parse(file, {
        header: false,
        encoding: 'gb18030',
        skipEmptyLines: true,
        complete: function (results: any) {
          console.log(results)
          const csvData = results.data || []
          console.log(csvData, 'csvfirs')
          if (/微信/.test(csvData[0][0] || '')) {
            const csvHeader = csvData.slice(0, 17)
            const csvContent = csvData.slice(17)
            try {
              const tableProps = formateToTableWechatHeader(csvHeader)
              let tableData: any = formateToTableDataWechat(
                csvContent,
                tableProps.account_type,
                WECHAT
              )
              tableData = setCategory(tableData, props.ruleData)
              // setTableData()
              console.log(tableProps, 'tableProps')
              setTableData(tableData)
              setTableHeader(tableProps)
              setTableVisable(true)
              setUploadVisiable(false)
            } catch (error) {
              console.error(error)
            }
          } else if (/支付宝/.test(csvData[0][0] || '')) {
            const csvHeader = [...csvData.slice(0, 5), ...csvData.slice(-7)]
            const csvContent = csvData.slice(5, csvData.length - 7)
            try {
              const tableProps = formateToTableAlipayHeader(csvHeader)
              let tableData: any = formateToTableAlipay(
                csvContent,
                tableProps.account_type,
                ALIPAY
              )
              console.log(tableData, 'tableData')

              // console.log(csvContent, 'csvHeader')
              tableData = setCategory(tableData, props.ruleData)
              //   // setTableData()
              console.log(csvHeader, 'ppp')
              //   console.log(tableData, '222')
              setTableData(tableData)
              setTableHeader(tableProps)
              setTableVisable(true)
              setUploadVisiable(false)
              console.log('支付宝')
            } catch (error) {
              console.error(error)
            }
          }
        },
      })

      // Prevent upload
      return false
    },
  }

  return (
    <>
      {uploadVisable && (
        <div className="upload-wrap">
          <Dragger {...uploadProps}>
            <div className="upload-cus-container">
              <div>
                <i
                  style={{
                    color: '#0080ff',
                    fontSize: '128px',
                    opacity: '0.4',
                  }}
                  className="ri-alipay-fill"
                ></i>
                <i
                  style={{
                    color: '#17c317',
                    fontSize: '128px',
                    opacity: '0.4',
                  }}
                  className="ri-wechat-fill"
                ></i>
              </div>
              <p
                className="ant-upload-text"
                style={{
                  position: 'absolute',
                  top: '50%',
                  marginTop: '60px',
                }}
              >
                点击或拖拽上传支付宝csv文件
              </p>
            </div>
          </Dragger>
        </div>
      )}
      {tableVisable && (
        <div className="container">
          <BasicTable
            onSubmitSuccess={() => {
              setTableVisable(false)
              setUploadVisiable(false)
              setShowResult(true)
            }}
            tableData={tableData}
            tableHeader={tableHeader}
            onCancel={() => {
              setTableVisable(false)
              setUploadVisiable(true)
            }}
          />
        </div>
      )}
      {showResult && (
        <Result
          status="success"
          title="上传成功"
          // subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
          extra={[
            <Button
              key={1}
              type="primary"
              onClick={() => {
                setTableVisable(false)
                setUploadVisiable(true)
                setShowResult(false)
              }}
            >
              继续导入
            </Button>,
           
          ]}
        />
      )}
    </>
  )
}

export default AlipayUpload
