import React from "react";
import { Upload, UploadProps, message } from "antd";
import Papa from "papaparse";
import { handleToTable } from "./classification";
import { WechatOutlined, AlipayCircleOutlined, CloudUploadOutlined } from "@ant-design/icons";
import "./index.css";

const { Dragger } = Upload;

interface UploadSectionProps {
  onUploadSuccess: (obj: { tableHeader: any; tableData: any }) => void;
  setLoading: (loading: boolean) => void;
}

function UploadSection({ onUploadSuccess, setLoading }: UploadSectionProps) {
  const uploadProps: UploadProps = {
    name: "file",
    fileList: [],
    className: "upload-cus",
    beforeUpload: (file) => {
      setLoading(true);

      setTimeout(() => {
        Papa.parse(file, {
          header: false,
          encoding: "gb18030",
          skipEmptyLines: true,
          complete: function (results: any) {
            const csvData = results.data || [];
            const { tableHeader, tableData, success } = handleToTable(csvData);
            if (!success) {
              message.error("上传错误文件");
              setLoading(false);
              return false;
            }

            onUploadSuccess({ tableHeader, tableData });
            setLoading(false);
          },
        });
      }, 0);

      return false;
    },
  };

  return (
    <div className="upload-wrap mt8">
      <Dragger {...uploadProps}>
        <div className="upload-cus-container">
          <p className="ant-upload-drag-icon">
            <CloudUploadOutlined />
          </p>
          <p className="ant-upload-text">上传账单</p>
          <p className="ant-upload-hint">目前支持微信、支付宝、两种模式csv文件</p>
        </div>
      </Dragger>
    </div>
  );
}

export default UploadSection;
