// 一个弹窗，里面包含step
import React, { useState } from "react";
import { Modal, Steps, Button, Form, Radio, Table, Select, Space, message } from "antd";
import type { I_Transaction } from "src/main/sqlite3/transactions";
import dayjs from "dayjs";
import AdvancedRule from "../setting/advancedRule";
import { formatMoney } from "../../components/utils";

interface BatchStepReplaceProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const { Step } = Steps;

const ruleOptions = [
  { label: '京东订单', value: 'jd' },
  { label: '拼多多订单', value: 'pdd' },
  { label: '大众点评订单', value: 'dianping' },
];

export const BatchStepReplace: React.FC<BatchStepReplaceProps> = ({ 
  visible, 
  onClose, 
  onSuccess 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRule, setSelectedRule] = useState<string>();
  const [matchedData, setMatchedData] = useState<I_Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // 处理规则选择
  const handleRuleSelect = (value: string) => {
    setSelectedRule(value);
  };

  // 处理查找匹配数据
  const handleFindMatchedData = async () => {
    if (!selectedRule) {
      message.error('请先选择规则');
      return;
    }

    setLoading(true);
    try {
      // 这里应该是从API获取数据的逻辑
      // 示例：
      const data = await window.mercury.api.findMatchedTransactions(selectedRule);
      setMatchedData(data || []);
      setCurrentStep(1);
    } catch (error) {
      console.error('查找匹配数据失败:', error);
      message.error('查找匹配数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理提交
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 这里应该是提交数据的逻辑
      await window.mercury.api.batchReplaceTransactions(matchedData);
      message.success('批量替换成功');
      onSuccess();
      handleReset();
    } catch (error) {
      console.error('批量替换失败:', error);
      message.error('批量替换失败');
    } finally {
      setLoading(false);
    }
  };

  // 重置弹窗状态
  const handleReset = () => {
    setCurrentStep(0);
    setSelectedRule(undefined);
    setMatchedData([]);
    form.resetFields();
    onClose();
  };

  // 表格列定义
  const columns = [
    {
      title: '交易日期',
      dataIndex: 'trans_time',
      key: 'trans_time',
      render: (text: Date) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: string) => formatMoney(text),
    },
    {
      title: '交易对方',
      dataIndex: 'payee',
      key: 'payee',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
  ];

  // 渲染步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <AdvancedRule type="modal" />
        );
      case 1:
        return (
          <div>
            <p>找到 {matchedData.length} 条匹配记录:</p>
            <Table
              dataSource={matchedData}
              columns={columns}
              rowKey="id"
              size="small"
              pagination={{ pageSize: 5 }}
              scroll={{ y: 300 }}
            />
          </div>
        );
      case 2:
        return (
          <div style={{ textAlign: 'center' }}>
            <p>即将替换 {matchedData.length} 条交易记录，确认提交吗？</p>
            <p style={{ color: '#ff4d4f' }}>此操作不可撤销，请确认后再提交！</p>
          </div>
        );
      default:
        return null;
    }
  };

  // 渲染底部按钮
  const renderFooter = () => {
    return (
      <Space>
        <Button onClick={handleReset}>取消</Button>
        {currentStep > 0 && (
          <Button onClick={() => setCurrentStep(currentStep - 1)}>上一步</Button>
        )}
        {currentStep < 2 ? (
          <Button 
            type="primary" 
            onClick={currentStep === 0 ? handleFindMatchedData : () => setCurrentStep(2)}
            disabled={currentStep === 0 && !selectedRule}
            loading={loading}
          >
            下一步
          </Button>
        ) : (
          <Button 
            type="primary" 
            onClick={handleSubmit}
            loading={loading}
            danger
          >
            确认替换
          </Button>
        )}
      </Space>
    );
  };

  return (
    <Modal
      title="批量替换交易"
      open={visible}
      onCancel={handleReset}
      footer={renderFooter()}
      width={700}
      maskClosable={false}
    >
      <Steps current={currentStep} className="mb-8">
        <Step title="选择规则" />
        <Step title="查看数据" />
        <Step title="确认提交" />
      </Steps>
      <div className="step-content">
        {renderStepContent()}
      </div>
    </Modal>
  );
};

export default BatchStepReplace;