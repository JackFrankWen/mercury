// 一个弹窗，里面包含step
import React, { useState } from 'react';
import { Modal, Steps, Button, Form, Radio, Table, Select, Space, message, notification, Popover, Tooltip } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import type { I_Transaction } from 'src/main/sqlite3/transactions';
import dayjs from 'dayjs';
import AdvancedRule, { renderRuleContent } from '../setting/advancedRule';
import { formatMoney } from '../../components/utils';
import { ruleByAdvanced } from '../upload/ruleUtils';
import { getCategoryCol } from 'src/renderer/components/commonColums';
import { getConsumerType } from 'src/renderer/const/web';
interface BatchStepReplaceProps {
  data: I_Transaction[];
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const { Step } = Steps;

export const BatchStepReplace: React.FC<BatchStepReplaceProps> = ({ data, visible, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRule, setSelectedRule] = useState<AdvancedRule[]>([]);
  const [matchedData, setMatchedData] = useState<I_Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  // 添加选择行的状态
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<I_Transaction[]>([]);

  const [api, contextHolder] = notification.useNotification();

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
      const newData = await ruleByAdvanced(data, selectedRule, api);
      const filteredData = newData.filter((item: any) => item.isChanged);
      setMatchedData(filteredData);
      // 重置选择
      setSelectedRowKeys(filteredData.map((item: any) => item.id));
      setSelectedRows(filteredData);
      setCurrentStep(2);
    } catch (error) {
      console.error('查找匹配数据失败:', error);
      message.error('查找匹配数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理提交
  const handleSubmit = async () => {
    Modal.confirm({
      title: '确认替换',
      content: `确认替换 ${selectedRows.length} 条记录吗？`,
      onOk: async () => {
        if (selectedRows.length === 0) {
          message.warning('请至少选择一条记录');
          return;
        }

        setLoading(true);
        try {
          // 只提交选中的行
          await window.mercury.api.batchReplaceTransactions(selectedRows);
          message.success(`成功替换 ${selectedRows.length} 条记录`);
          onSuccess();
          handleReset();
        } catch (error) {
          console.error('批量替换失败:', error);
          message.error('批量替换失败');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // 重置弹窗状态
  const handleReset = () => {
    setCurrentStep(0);
    setSelectedRule([]);
    setMatchedData([]);
    setSelectedRowKeys([]);
    setSelectedRows([]);
    form.resetFields();
    onClose();
  };

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[], selectedItems: I_Transaction[]) => {
      setSelectedRowKeys(selectedKeys);
      setSelectedRows(selectedItems);
    },
  };

  // 表格列定义
  const columns = [
    {
      title: '交易日期',
      dataIndex: 'trans_time',
      key: 'trans_time',
      width: 190,
      render: (text: Date, record: any) => {
        let name = '';
        let extra = '';
        try {
          const ruleInfo = record.ruleInfo || {};
          name = ruleInfo.name;
          extra = JSON.parse(ruleInfo.rule);
        } catch (error) {
          return <>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</>;
        }
        return (
          <>
            {dayjs(text).format('YYYY-MM-DD HH:mm:ss')}
            <Popover title={`规则名称【${name}】`} content={renderRuleContent(extra)}>
              <ExclamationCircleFilled style={{ color: 'red', marginLeft: '10px' }} />
            </Popover>
          </>
        );
      },
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (text: string) => formatMoney(text),
    },
    getCategoryCol({ width: 100 }),
    {
      title: '交易对方',
      dataIndex: 'payee',
      key: 'payee',
      ellipsis: true,
      render: (text: string) => {
        return (
          <>
            <Tooltip title={text}>{text}</Tooltip>
          </>
        );
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => {
        return (
          <>
            <Tooltip title={text}>{text}</Tooltip>
          </>
        );
      },
    },
    {
      title: '消费者',
      dataIndex: 'consumer',
      key: 'consumer',
      render: (text: string) => getConsumerType(text),
    },
  ];

  // 渲染步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <AdvancedRule
            type="modal"
            onSelectChange={(res: AdvancedRule[]) => {
              setSelectedRule(res);
            }}
          />
        );
      case 1:
      case 2:
        return (
          <div>
            <Table
              onRow={record => {
                return {
                  onClick: () => {
                    // 如果当前行是选中状态，则取消选中
                    if (selectedRowKeys.includes(record.id)) {
                      setSelectedRowKeys(selectedRowKeys.filter(key => key !== record.id));
                      setSelectedRows(selectedRows.filter(item => item.id !== record.id));
                    } else {
                      setSelectedRowKeys([...selectedRowKeys, record.id]);
                      setSelectedRows([...selectedRows, record]);
                    }
                  },
                };
              }}
              dataSource={matchedData}
              columns={columns}
              rowSelection={rowSelection}
              pagination={false}
              rowKey="id"
              size="small"
              scroll={{ x: 800, y: 300 }}
            />
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
        {currentStep > 0 && <Button onClick={() => setCurrentStep(currentStep - 1)}>上一步</Button>}
        {currentStep < 2 ? (
          <Button
            type="primary"
            onClick={currentStep === 0 ? handleFindMatchedData : () => setCurrentStep(2)}
            disabled={currentStep === 0 && (selectedRule.length === 0 || data.length === 0)}
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
            disabled={selectedRowKeys.length === 0}
          >
            确认替换 ({selectedRowKeys.length})
          </Button>
        )}
      </Space>
    );
  };

  return (
    <Modal
      title="快速分类"
      open={visible}
      onCancel={handleReset}
      footer={renderFooter()}
      width={700}
      maskClosable={false}
    >
      {contextHolder}
      <Steps current={currentStep} className="mb-8">
        <Step title="选择规则" />
        <Step title="查看数据" />
        <Step title="确认提交" />
      </Steps>
      <div className="step-content">{renderStepContent()}</div>
    </Modal>
  );
};

export default BatchStepReplace;
