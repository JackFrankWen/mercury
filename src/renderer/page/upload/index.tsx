import React, { useState } from 'react';
import { Spin, message, Steps, Card } from 'antd';
import UploadTable, { tableHeaderI } from './uploadTable';
import UploadFile from './uploadFile';
import Done from './done';
import emitter from 'src/renderer/events';

import './index.css';
import { Params_Transaction } from 'src/preload/type';
import { I_Transaction } from 'src/main/sqlite3/transactions';
import dayjs from 'dayjs';
// 上传中心
// 第一步上传文件
// 第二步
// 第三步
// 第四步 成功

function UploadCenter(): JSX.Element {
  const [uploadVisable, setUploadVisiable] = useState(true);
  const [tableVisable, setTableVisable] = useState(false);
  const [tableData, setTableData] = useState<Params_Transaction[]>([]);
  const [tableHeader, setTableHeader] = useState<tableHeaderI | null>(null);
  const [loading, setLoading] = useState(false);
  const [doneVisable, setDoneVisable] = useState(false);
  const [fileName, setFileName] = useState('');
  const [goYear, setGoYear] = useState('');
  const [step, setStep] = useState(1);

  const uploadToDatabase = async (tableData: Params_Transaction[]) => {
    try {
      await window.mercury.api.batchInsertTransactions(tableData);
      message.success('上传成功');
      emitter.emit('refresh', 'transaction');
      setDoneVisable(true);
      setLoading(false);
      setTableVisable(false);
    } catch (error) {
      message.error('上传失败');
      setLoading(false);
    }
  };

  const handleUploadSuccess = (obj: {
    tableData: Params_Transaction[];
    tableHeader: tableHeaderI;
    fileName: string;
  }) => {
    setUploadVisiable(false);
    setTableData(obj.tableData);
    setTableHeader(obj.tableHeader);
    setFileName(obj.fileName);
    setTableVisable(true);
    setStep(step + 1);
  };

  const handleTableCancel = () => {
    setTableVisable(false);
    setUploadVisiable(true);
    setTableData([]);
    setStep(1);
  };

  const handleSubmitSuccess = async (arr: I_Transaction[]) => {
    try {
      await uploadToDatabase(arr);
      setGoYear(dayjs(arr[0]?.trans_time).format('YYYY'));
      const list = await window.mercury.store.getUploadFileList();
      const oldList = list ? list : [];
      await window.mercury.store.setUploadFileList([
        ...oldList,
        {
          fileName,
          createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          fileType: fileName.includes('微信') ? 'wechat' : 'alipay',
        },
      ]);
      emitter.emit('refresh', 'fileList');
    } catch (error) {
      console.error('Failed to save file:', error);
      message.error('保存文件失败');
    }
  };

  const handleReSubmit = () => {
    setDoneVisable(false);
    setUploadVisiable(true);
    setTableData([]);
    setTableHeader(null);
    setTableVisable(false);
    setStep(1);
  };

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
              description: '替换交易描述',
            },
            {
              title: '分类',
              description: 'ai自动分类',
            },
          ]}
        />
        {uploadVisable && (
          <UploadFile setLoading={setLoading} onUploadSuccess={handleUploadSuccess} />
        )}
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
        {doneVisable && <Done reSubmit={handleReSubmit} goYear={goYear} />}
      </Card>
    </Spin>
  );
}

export default UploadCenter;
