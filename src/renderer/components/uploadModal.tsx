import React, { useState } from 'react';
import { Alert, message, Modal, Upload, UploadProps, Spin } from 'antd';
import Papa from 'papaparse';
import { formateToTableJd, parseExcelFile } from '../page/upload/csvUtil';
import { CloudUploadOutlined } from '@ant-design/icons';
const { Dragger } = Upload;

// 新增：抽象的 CSV 解析方法
export interface CsvParseResult {
  success: boolean;
  data?: any[];
  error?: string;
  sourceType?: string;
}

export interface ParseOptions {
  validateSourceType?: boolean;
  needTransferData?: {
    hasJingdong?: boolean;
    hasPdd?: boolean;
    has1688?: boolean;
  };
}

// 导出此函数以便其他文件可以使用
export async function parseCsvFile(file: File, options: ParseOptions = {}): Promise<CsvParseResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: function (results: any) {
        try {
          const csvData = results.data || [];
          const csvContent = csvData.slice(1);
          const { name } = file;
          let data;
          let sourceType = '';

          // 根据文件名判断数据来源
          if (name.includes('jd')) {
            sourceType = 'jd';
            if (options.validateSourceType && options.needTransferData && !options.needTransferData.hasJingdong) {
              resolve({ success: false, error: '上传错误文件类型' });
              return;
            }
            data = formateToTableJd(csvContent, 'jd');
          } else if (name.includes('pdd')) {
            sourceType = 'pdd';
            if (options.validateSourceType && options.needTransferData && !options.needTransferData.hasPdd) {
              resolve({ success: false, error: '上传错误文件类型' });
              return;
            }
            data = formateToTableJd(csvContent, 'pdd');
          } else if (name.includes('alipay1688')) {
            sourceType = 'alipay1688';
            if (options.validateSourceType && options.needTransferData && !options.needTransferData.has1688) {
              resolve({ success: false, error: '上传错误文件类型' });
              return;
            }
            data = formateToTableJd(csvContent, 'alipay1688');
          } else {
            resolve({ success: false, error: '不支持的文件类型' });
            return;
          }

          resolve({ success: true, data, sourceType });
        } catch (error) {
          console.error('File parsing error:', error);
          resolve({ success: false, error: '文件解析错误' });
        }
      },
      error: function(error: any) {
        console.error('CSV parsing error:', error);
        resolve({ success: false, error: '文件解析错误' });
      }
    });
  });
}

const UploadModal = (props: {
  onOk: () => void;
  onCancel: () => void;
  onUploadSuccess: (type: string, data: any) => void;
  setLoading: (loading: boolean) => void;
  visible: boolean;
  needTransferData: {
    hasJingdong: boolean;
    hasPdd: boolean;
    jingdongData: any[];
    pddData: any[];
    has1688: boolean;
    alipay1688: any[];
  };
}) => {
  const {
    visible,
    onCancel,
    onUploadSuccess,
    needTransferData,
    onOk,
    setLoading,
  } = props;
  const [modalLoading, setModalLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  
  const uploadProps: UploadProps = {
    name: 'file',
    fileList: fileList,
    className: 'upload-cus mt8',
    beforeUpload: async (file) => {
      console.log(file, '===aaa');
      setModalLoading(true);
      
      // 使用新的抽象方法解析文件
      const result = await parseCsvFile(file, {
        validateSourceType: true,
        needTransferData: {
          hasJingdong: needTransferData.hasJingdong,
          hasPdd: needTransferData.hasPdd,
          has1688: needTransferData.has1688
        }
      });
      
      if (result.success && result.data && result.sourceType) {
        onUploadSuccess(result.sourceType, result.data);
        setFileList([file]);
      } else {
        console.error(result.error);
        setModalLoading(false);
        setLoading(false);
        message.error(result.error || '文件解析错误');
      }
      
      // Prevent upload
      return false;
    },
  };
  
  const handleOk = () => {
    onOk();
  };
  const { hasJingdong, hasPdd, jingdongData, pddData, has1688, alipay1688 } =
    needTransferData;

  const jingdongDescription =
    jingdongData.length > 0
      ? jingdongData
        .map((item: any) => `第${item.dataIndex + 1}条`)
        .join('、')
      : '';
  const pddDescription =
    pddData.length > 0
      ? pddData.map((item: any) => `第${item.dataIndex + 1}条`).join('、')
      : '';
  const alipay1688Description =
    alipay1688.length > 0
      ? alipay1688.map((item: any) => `第${item.dataIndex + 1}条`).join('、')
      : '';
  return (
    <Modal
      open={visible}
      title="替换订单描述"
      width={500}
      onCancel={onCancel}
      onOk={handleOk}
      okText="跳过替换"
    >
      <Spin spinning={modalLoading}>
        <div className="mb8">
          {hasJingdong && (
            <Alert
              style={{
                maxHeight: 200,
                overflow: 'auto',
              }}
              message="请上传京东csv文件！"
              type="warning"
              showIcon
              description={`未显示交易详情：${jingdongDescription}`}
            />
          )}
          {has1688 && (
            <Alert
              style={{
                maxHeight: 200,
                marginTop: 10,
                overflow: 'auto',
              }}
              message="请上传1688 csv文件！"
              type="warning"
              showIcon
              description={`未显示交易详情：${alipay1688Description}`}
            />
          )}
          {hasPdd && (
            <Alert
              style={{
                maxHeight: 200,
                marginTop: 10,
                overflow: 'auto',
              }}
              message="请上传拼多多csv文件！"
              type="warning"
              showIcon
              description={`未显示交易详情：${pddDescription}`}
            />
          )}
        </div>
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <CloudUploadOutlined />
          </p>
          <p className="ant-upload-text">上传替换文件</p>
          <p className="ant-upload-hint">支持单个 .csv 文件上传，文件大小不超过 10MB</p>
        </Dragger>
      </Spin>
    </Modal>
  );
};

export default UploadModal;
