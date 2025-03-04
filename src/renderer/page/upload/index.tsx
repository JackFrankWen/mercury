import React, { useState } from "react";
import { Spin, message, Steps, Card } from "antd";
import UploadTable, { tableHeaderI } from './uploadTable'
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
  const [tableData, setTableData] = useState<Params_Transaction[]>([])
  const [tableHeader, setTableHeader] = useState<tableHeaderI | null>(null)
  const [loading, setLoading] = useState(false)
  const [doneVisable, setDoneVisable] = useState(false)
  const [step, setStep] = useState(1)

  const uploadToDatabase = (tableData: Params_Transaction[]) => {
    window.mercury.api.batchInsertTransactions(tableData).then((res: any) => {
      console.log(res, 'res')
      message.success('上传成功')
      setDoneVisable(true)
      setLoading(false)
      setTableVisable(false)
    })
  }

  const handleUploadSuccess = (obj: { tableData: Params_Transaction[], tableHeader: tableHeaderI }) => {
    setUploadVisiable(false)
    setTableData(obj.tableData)
    setTableHeader(obj.tableHeader)
    setTableVisable(true)
    setStep(step + 1)
  }

  const handleTableCancel = () => {
    setTableVisable(false);
    setUploadVisiable(true)
    setTableData([])
    setStep(1)
  }

  const handleSubmitSuccess = (arr: Params_Transaction[]) => {
    uploadToDatabase(arr)
  }

  const handleReSubmit = () => {
    setDoneVisable(false)
    setUploadVisiable(true)
    setTableData([])
    setTableHeader(null)
    setTableVisable(false)
    setStep(1)
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
        onUploadSuccess={handleUploadSuccess} 
      />}
      {tableVisable && (
        <UploadTable 
          setLoading={setLoading}
          tableData={tableData} 
          tableHeader={tableHeader} 
          onCancel={handleTableCancel}
          onSubmitSuccess={handleSubmitSuccess}
          step={step}
          setStep={setStep}
        />
      )}
      {doneVisable && <Done
        reSubmit={handleReSubmit}
      />}
      </Card>
    </Spin>
  );
}

export default UploadCenter;