import React, { useState } from "react";
import { Button, Input, Upload, UploadProps } from "antd";
import Papa from 'papaparse'
import { handleToTable } from './classification'
import UploadTable from './uploadTable'
import './index.css'
const { Dragger } = Upload
// 上传中心
// 第一步上传文件
// 第二步
// 第三步 
// 第四步 成功


function UploadCenter(): JSX.Element {
  const [uploadVisable, setUploadVisiable] = useState(true)
  const [tableVisable, setTableVisable] = useState(false)
  const [tableData, setTableData] = useState([])
  const [tableHeader, setTableHeader] = useState({})
  const uploadToDatabase = (tableData: any) => {
    window.mercury.api.batchInsertTransactions(tableData).then((res: any) => {
      console.log(res, 'res')
    })
  }
  const uploadProps: UploadProps = {
    name: 'file',
    fileList: [],
    className: 'upload-cus',
    beforeUpload: (file) => {
      Papa.parse(file, {
        header: false,
        encoding: 'gb18030',
        skipEmptyLines: true,
        complete: function (results: any) {
          console.log(results)
          const csvData = results.data || []
          console.log(csvData, 'csvfirs')
          const csvHeader = csvData.slice(0, 22)
          console.log(JSON.stringify(csvHeader), 'csvHeader')
          const { tableHeader, tableData } = handleToTable(csvData)
          console.log(tableHeader, tableData, 'tableHeader, tableData')
          // uploadToDatabase(tableData)
          setUploadVisiable(false)
          setTableVisable(true)
          setTableData(tableData)
          setTableHeader(tableHeader)
          //   if (/微信/.test(csvData[0][0] || '')) {
          //     const csvHeader = csvData.slice(0, 17)
          //     const csvContent = csvData.slice(17)
          //     try {
          //       const tableProps = formateToTableWechatHeader(csvHeader)
          //       let tableData: any = formateToTableDataWechat(
          //         csvContent,
          //         tableProps.account_type,
          //         WECHAT
          //       )
          //       tableData = setCategory(tableData, props.ruleData)
          //       // setTableData()
          //       console.log(tableProps, 'tableProps')
          //       setTableData(tableData)
          //       setTableHeader(tableProps)
          //       setTableVisable(true)
          //       setUploadVisiable(false)
          //     } catch (error) {
          //       console.error(error)
          //     }
          //   } else if (/支付宝/.test(csvData[0][0] || '')) {
          //     const csvHeader = [...csvData.slice(0, 5), ...csvData.slice(-7)]
          //     const csvContent = csvData.slice(5, csvData.length - 7)
          //     try {
          //       const tableProps = formateToTableAlipayHeader(csvHeader)
          //       let tableData: any = formateToTableAlipay(
          //         csvContent,
          //         tableProps.account_type,
          //         ALIPAY
          //       )
          //       console.log(tableData, 'tableData')

          //       // console.log(csvContent, 'csvHeader')
          //       tableData = setCategory(tableData, props.ruleData)
          //       //   // setTableData()
          //       console.log(csvHeader, 'ppp')
          //       //   console.log(tableData, '222')
          //       setTableData(tableData)
          //       setTableHeader(tableProps)
          //       setTableVisable(true)
          //       setUploadVisiable(false)
          //       console.log('支付宝')
          //     } catch (error) {
          //       console.error(error)
          //     }
          //   }
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
        <UploadTable 
        tableData={tableData} 
        tableHeader={tableHeader} 
        onCancel={() => {
          setTableVisable(false);
          setUploadVisiable(true)
          setTableData([])
        }} 
        onSubmitSuccess={() => setTableVisable(false)} />
      )}
    </>
  );
}
export default UploadCenter;