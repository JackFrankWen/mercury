import React, { useState } from "react";
import { Upload, UploadProps, Spin } from "antd";
import Papa from 'papaparse';
import { handleToTable } from './classification';
import './index.css';

const { Dragger } = Upload;

interface UploadSectionProps {
  onUploadSuccess: (obj: { tableHeader: any; tableData: any }) => void;
}

function UploadSection({ onUploadSuccess }: UploadSectionProps) {
  const [loading, setLoading] = useState(false);

  const uploadProps: UploadProps = {
    name: 'file',
    fileList: [],
    className: 'upload-cus',
    beforeUpload: (file) => {
      setLoading(true);
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

      // Prevent upload
      return false;
    },
  };

  return (
    <div className="upload-wrap">
      <Spin spinning={loading} tip="正在解析文件...">
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
      </Spin>
    </div>
  );
}

export default UploadSection; 