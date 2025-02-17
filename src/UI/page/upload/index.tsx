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

// New component
function UploadSection({ onUploadSuccess }: { onUploadSuccess: (obj: { tableHeader: any, tableData: any }) => void }) {
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
          const { tableHeader, tableData } = handleToTable(csvData)
          console.log(tableHeader, tableData, 'tableHeader, tableData')
          onUploadSuccess({ tableHeader, tableData })
         
        },
      })

      // Prevent upload
      return false
    },
  }
  return (
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
  );
}

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
          const { tableHeader, tableData } = handleToTable(csvData)
          console.log(tableHeader, tableData, 'tableHeader, tableData')
          // uploadToDatabase(tableData)
          setUploadVisiable(false)
          setTableVisable(true)
          setTableData(tableData)
          setTableHeader(tableHeader)
        },
      })

      // Prevent upload
      return false
    },
  }
  return (
    <>
      {uploadVisable && <UploadSection onUploadSuccess={(obj)=>{
         setUploadVisiable(false)
         setTableVisable(true)
         setTableData(obj.tableData)
         setTableHeader(obj.tableHeader)
      }} />}
      {tableVisable && (
        <UploadTable 
          tableData={tableData} 
          tableHeader={tableHeader} 
          onCancel={() => {
            setTableVisable(false);
            setUploadVisiable(true)
            setTableData([])
          }} 
          onSubmitSuccess={() => setTableVisable(false)} 
        />
      )}
    </>
  );
}
export default UploadCenter;