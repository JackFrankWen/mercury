import React, { useState } from "react";
import { Spin, message, Steps, Card } from "antd";
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
  const [step, setStep] = useState(1)

  const uploadToDatabase = (tableData: any) => {
    window.mercury.api.batchInsertTransactions(tableData).then((res: any) => {
      console.log(res, 'res')
      message.success('上传成功')
      setDoneVisable(true)
      setLoading(false)
      setTableVisable(false)
    })
  }
  
  return (
    
    <Spin spinning={loading} tip="正在上传文件...">
      <Card>
      <Steps
        current={step - 1}
        items={[
          {
            title: '上传',
            description: '上传账单',
          },
          {
            title: '替换',
            description: '替换订单编号',
          },
          {
            title: '分类',
            description: 'ai自动分类',
          },
        ]}
      />
      {uploadVisable && <UploadFile 
        setLoading={setLoading}
         onUploadSuccess={(obj)=>{
          setUploadVisiable(false)
          setTableData(obj.tableData)
          setTableHeader(obj.tableHeader)
          setTableVisable(true)
          setStep(step + 1)
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
            setStep(1) // 重置步骤
          }} 
          onSubmitSuccess={(arr: any) => {
            uploadToDatabase(arr)
          }}
          step={step}
          setStep={(step: number) => setStep(step)}
        />
      )}
      {doneVisable && <Done
        reSubmit={() => {
          setDoneVisable(false)
          setUploadVisiable(true)
          setTableData([])
          setTableHeader({})
          setTableVisable(false)
          setStep(1) // 重置步骤
        }}
      />}
      </Card>
    </Spin>
  );
}

export default UploadCenter;