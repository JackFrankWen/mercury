import React, { useState } from "react";
import { Button, Input, Upload, UploadProps, Spin } from "antd";
import Papa from 'papaparse'
import { handleToTable } from './classification'
import UploadTable from './uploadTable'
import './index.css'
import UploadSection from './UploadSection'
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
  const [loading, setLoading] = useState(false)

  const uploadToDatabase = (tableData: any) => {
    window.mercury.api.batchInsertTransactions(tableData).then((res: any) => {
      console.log(res, 'res')
    })
  }
  
  return (
    <Spin spinning={loading} tip="正在解析文件...">
      {uploadVisable && <UploadSection 
        setLoading={setLoading}
        onUploadSuccess={(obj)=>{
          setUploadVisiable(false)
          setTableVisable(true)
          
          setTableData(obj.tableData.filter((item: any) => item.payee.includes('京东') || item.payee.includes('拼多多')))
          setTableHeader(obj.tableHeader)
        }} 
      />}
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
    </Spin>
  );
}
export default UploadCenter;