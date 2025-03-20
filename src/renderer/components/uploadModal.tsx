import React, { useState } from 'react';
import { Alert, message, Modal, Upload, UploadProps, Spin } from 'antd';
import Papa from 'papaparse';
import { formateToTableJd, parseExcelFile } from '../page/upload/csvUtil';
const { Dragger } = Upload;

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
    beforeUpload: (file) => {
      console.log(file, '===aaa');


      // 处理CSV文件
      Papa.parse(file, {
        header: false,
        // encoding: 'gb18030',
        skipEmptyLines: true,
        complete: function (results: any) {
          const csvData = results.data || [];
          // const csvHeader = csvData.slice(0, 1)
          try {
            const csvContent = csvData.slice(1);
            console.log(csvData, '===csvData');
            const { name } = file;
            // 如果文件名包含jd_，则认为是京东的文件
            let data;

            if (name.includes('jd')) {
              data = formateToTableJd(csvContent, 'jd');
              console.log(data, '===data');

              if (needTransferData.hasJingdong) {
                onUploadSuccess('jd', data);
              } else {
                setModalLoading(false);
                setLoading(false);
                message.error('上传错误文件');
              }
              //jd
            } else if (name.includes('pdd')) {
              if (needTransferData.hasPdd) {
                data = formateToTableJd(csvContent, 'pdd');
                onUploadSuccess('pdd', data);
              } else {
                setModalLoading(false);
                setLoading(false);
                message.error('上传错误文件');
              }
              // pdd
            } else if (name.includes('alipay1688')) {
              console.log(csvContent, '===csvContent');
              if (needTransferData.has1688) {
                data = formateToTableJd(csvContent, 'alipay1688');
                onUploadSuccess('alipay1688', data);
              } else {
                setModalLoading(false);
                setLoading(false);
                message.error('上传错误文件');
              }
            }

            setFileList([file]);
          } catch (error) {
            console.log(error, 'error');
            setModalLoading(false);
            setLoading(false);
            message.error('文件解析错误');
          }
        },
      });
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
        .map((item: any) => `第${item.dataIndex + 1}条数据`)
        .join(',')
      : '';
  const pddDescription =
    pddData.length > 0
      ? pddData.map((item: any) => `第${item.dataIndex + 1}条数据`).join(',')
      : '';
  const alipay1688Description =
    alipay1688.length > 0
      ? alipay1688.map((item: any) => `第${item.dataIndex + 1}条数据`).join(',')
      : '';
  return (
    <Modal
      open={visible}
      title="上传文件"
      width={500}
      onCancel={onCancel}
      onOk={handleOk}
      okText="直接跳过"
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
              description={`有问题数据：${jingdongDescription}`}
            />
          )}
          {has1688 && (
            <Alert
              style={{
                maxHeight: 200,
                overflow: 'auto',
              }}
              message="请上传1688 csv文件！"
              type="warning"
              showIcon
              description={`有问题数据：${alipay1688Description}`}
            />
          )}
          {hasPdd && (
            <Alert
              style={{
                maxHeight: 200,
                overflow: 'auto',
              }}
              message="请上传拼多多csv文件！"
              type="warning"
              showIcon
              description={`有问题数据：${pddDescription}`}
            />
          )}
        </div>
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon"></p>
          <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
        </Dragger>
      </Spin>
    </Modal>
  );
};

export default UploadModal;
