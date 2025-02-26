import React from "react";
import { Upload, UploadProps } from "antd";
import Papa from 'papaparse';
import { handleToTable } from './classification';
import { WechatOutlined, AlipayCircleOutlined, CloudUploadOutlined } from '@ant-design/icons';
import './index.css';

const { Dragger } = Upload;

interface UploadSectionProps {
  onUploadSuccess: (obj: { tableHeader: any; tableData: any }) => void;
  setLoading: (loading: boolean) => void;
}

function UploadSection({ onUploadSuccess, setLoading }: UploadSectionProps) {
  const uploadProps: UploadProps = {
    name: 'file',
    fileList: [],
    className: 'upload-cus',
    beforeUpload: (file) => {
      setLoading(true);

      setTimeout(() => {
        Papa.parse(file, {
          header: false,
          encoding: 'gb18030',
          skipEmptyLines: true,
          complete: function (results: any) {
            const csvData = results.data || [];
            const { tableHeader, tableData } = handleToTable(csvData);
            onUploadSuccess({ tableHeader, tableData });
            setLoading(false);
          },
        });
      }, 0);

      return false;
    },
  };

  return (
    <div className="upload-wrap">
      <Dragger {...uploadProps}>
        <div className="upload-cus-container">
          {/* <div className="upload-cus-icon">
          <WechatOutlined />
          <AlipayCircleOutlined />

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
          </p> */}
          <p className="ant-upload-drag-icon">
          <CloudUploadOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽上传csv文件</p>
          <p className="ant-upload-hint">
            目前支持微信、支付宝、两种模式csv文件
          </p>
        </div>
      </Dragger>
    </div>
  );
}

export default UploadSection; 