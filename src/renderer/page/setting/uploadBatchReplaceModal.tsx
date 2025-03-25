import React, { useState } from 'react';
import { Modal, Steps, Radio, Upload, Table, Button, message, Flex, Form } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { I_Transaction } from 'src/main/sqlite3/transactions';
import dayjs from 'dayjs';
import { parseCsvFile, CsvParseResult, ParseOptions } from '../../components/uploadModal';

const { Step } = Steps;

interface BatchReplaceDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const sourceTypes = [
  { label: '京东', value: 'jd' },
  { label: '拼多多', value: 'pdd' },
  { label: '大众点评', value: 'dianping' },
];

export function BatchReplaceDrawer({ visible, onClose, onSuccess }: BatchReplaceDrawerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [sourceType, setSourceType] = useState<string>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [matchedRecords, setMatchedRecords] = useState<I_Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // 处理文件上传
  const handleFileUpload = async (file: File) => {
    try {
      if (!sourceType) {
        message.error('请先选择数据来源');
        return false;
      }
      
      // 使用共享的 parseCsvFile 方法
      const result = await parseCsvFile(file);
      
      if (result.success) {
        // 检查文件类型与选择的来源是否匹配
        if ((sourceType === 'jd' && !file.name.includes('jd')) ||
            (sourceType === 'pdd' && !file.name.includes('pdd')) ||
            (sourceType === 'dianping' && !file.name.includes('alipay1688'))) {
          message.error('文件类型与选择的来源不匹配');
          return false;
        }
        
        // 获取过去十年的交易记录
        const endDate = dayjs().format('YYYY-MM-DD');
        const startDate = dayjs().subtract(10, 'year').format('YYYY-MM-DD');
        
        const transactions = await window.mercury.api.getAllTransactions({
          trans_time: [startDate, endDate],
        });

        // TODO: 匹配逻辑，这里需要根据实际情况实现
        setMatchedRecords(transactions);
        setCurrentStep(2);
        return false;
      } else {
        message.error(result.error || '文件解析失败');
        return false;
      }
    } catch (error) {
      message.error('文件处理失败');
      return false;
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '交易时间',
      dataIndex: 'trans_time',
      key: 'trans_time',
      render: (text: Date) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '支付方式',
      dataIndex: 'payment_type',
      key: 'payment_type',
    },
  ];

  // 处理批量替换
  const handleReplace = async () => {
    try {
      setLoading(true);
      await window.mercury.api.batchReplaceTransactions(matchedRecords);
      message.success('替换成功');
      onSuccess();
      onClose();
    } catch (error) {
      message.error('替换失败');
    } finally {
      setLoading(false);
    }
  };

  // 渲染步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form.Item label="来源">
            <Radio.Group onChange={e => setSourceType(e.target.value)} value={sourceType}>
              {sourceTypes.map(type => (
                <Radio key={type.value} value={type.value}>
                {type.label}
              </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        );
      case 1:
        return (
          <Upload.Dragger
            fileList={fileList}
            beforeUpload={handleFileUpload}
            onChange={({ fileList }) => setFileList(fileList)}
            accept=".csv"
            maxCount={1}
            showUploadList={{ showRemoveIcon: true }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ fontSize: 48, color: '#40a9ff' }} />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持单个 .csv 文件上传，文件大小不超过 10MB
            </p>
            {sourceType && (
              <p className="ant-upload-hint" style={{ color: '#40a9ff' }}>
                当前选择的数据来源：{sourceTypes.find(t => t.value === sourceType)?.label}
              </p>
            )}
          </Upload.Dragger>
        );
      case 2:
        return (
          <Table
            columns={columns}
            dataSource={matchedRecords}
            rowKey="id"
            scroll={{ y: 400 }}
            pagination={false}
          />
        );
      default:
        return null;
    }
  };
  const steps = [
    {
      title: '选择来源',
      content: (
        <Radio.Group onChange={e => setSourceType(e.target.value)} value={sourceType}>
          {sourceTypes.map(type => (
            <Radio key={type.value} value={type.value}>
              {type.label}
            </Radio>
          ))}
        </Radio.Group>
      ),
    },
    {
      title: '上传文件',
      content: (
        <Upload.Dragger
          fileList={fileList}
          beforeUpload={handleFileUpload}
          onChange={({ fileList }) => setFileList(fileList)}
          accept=".csv"
          maxCount={1}
          showUploadList={{ showRemoveIcon: true }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ fontSize: 48, color: '#40a9ff' }} />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
         
          {sourceType && (
            <p className="ant-upload-hint" style={{ color: '#40a9ff' }}>
              当前选择的数据来源：{sourceTypes.find(t => t.value === sourceType)?.label}
            </p>
          )}
        </Upload.Dragger>
      ),
    },
    {
      title: '确认替换',
      content: (
        <Button type="primary" loading={loading} onClick={handleReplace}>
          确认替换
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title="批量替换交易"
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="back" onClick={onClose}>
          取消
        </Button>,
        currentStep > 0 && (
          <Button key="prev" onClick={() => setCurrentStep(currentStep - 1)}>
            上一步
          </Button>
        ),
        currentStep < 2 ? (
          <Button
            key="next"
            type="primary"
            disabled={
              (currentStep === 0 && !sourceType) || (currentStep === 1 && fileList.length === 0)
            }
            onClick={() => setCurrentStep(currentStep + 1)}
          >
            下一步
          </Button>
        ) : (
          <Button key="submit" type="primary" loading={loading} onClick={handleReplace}>
            确认替换
          </Button>
        ),
      ]}
    >
      <Steps current={currentStep} className="mb-4">
        <Step title="选择来源" />
        <Step title="上传文件" />
        <Step title="确认替换" />
      </Steps>
      <Flex align="center" justify="center" style={{
        marginTop: 20,
      }}>{renderStepContent()}</Flex>
    </Modal>
  );
}

export default BatchReplaceDrawer;
