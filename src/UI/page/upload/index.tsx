import React, { useState } from "react";
import {  Spin, message } from "antd";
import UploadTable from './uploadTable'
import UploadFile from './uploadFile'
import Done from './done'

import './index.css'
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
  const [doneVisable, setDoneVisable] = useState(false)
  const uploadToDatabase = (tableData: any) => {
    window.mercury.api.batchInsertTransactions(tableData).then((res: any) => {
      console.log(res, 'res')
      message.success('上传成功')
      setDoneVisable(true)
      setLoading(false)
      setTableVisable(false)
    })
  }
  console.log(loading, 'loading');
  
  return (
    <Spin spinning={loading} tip="正在上传文件...">
      {uploadVisable && <UploadFile 
        setLoading={setLoading}
        loading={loading}
        onUploadSuccess={(obj)=>{
          setUploadVisiable(false)
          setTableData(obj.tableData)
          // setTableData(obj.tableData.filter((item: any) => item.payee.includes('京东') || item.payee.includes('拼多多')))
          setTableHeader(obj.tableHeader)
          setTableVisable(true)

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
          onSubmitSuccess={(arr: any) => {
            uploadToDatabase(arr)
          }} 
        />
      )}
      {doneVisable && <Done
        reSubmit={() => {
          setDoneVisable(false)
          setUploadVisiable(true)
          setTableData([])
          setTableHeader({})
          setTableVisable(false)
        }}
       />}
    </Spin>
  );
}
export default UploadCenter;