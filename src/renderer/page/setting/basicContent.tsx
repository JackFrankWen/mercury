import { Form, Radio, Button, Breadcrumb, Space, message, Modal, DatePicker, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import emitter from '../../events';
import RangePickerWrap from '../../components/rangePickerWrap';
import BatchReplaceDrawer from './uploadBatchReplaceModal';

function BasicContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBatchReplaceVisible, setIsBatchReplaceVisible] = useState(false);
  const [timeRange, setTimeRange] = useState([null, null]);
  const [dateRange, setDateRange] = useState();
  const [timeType, setTimeType] = useState('trans_time');
  const [form] = Form.useForm();
  const [environment, setEnvironment] = useState<string>();
  useEffect(() => {
    const loadEnvironment = async () => {
      const env = await window.mercury.store.getEnvironment();
      console.log(env, 'env');
      setEnvironment(env);
      form.setFieldsValue({
        env: env,
      });
    };
    loadEnvironment();
  }, []);

  const onExportCsv = async () => {
    try {
      const result = await window.mercury.api.exportToCsv();
      if (result.code === 200) {
        message.success('导出成功');
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('Export error:', error);
      message.error('导出失败');
    }
  };
  const onExportJson = async () => {
    try {
      const result = await window.mercury.api.exportToJson();
      if (result.code === 200) {
        message.success('导出成功');
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('Export JSON error:', error);
      message.error('导出失败');
    }
  };
  const onDeleteAllTransactions = async () => {
    Modal.confirm({
      title: '确认',
      content: '确认删除所有交易数据吗？',
      onOk: async () => {
        try {
          const result = await window.mercury.api.deleteAllTransactions();
          if (result.code === 200) {
            message.success(result.message);
            emitter.emit('refresh', 'transaction');
          } else {
            message.error(result.message);
          }
        } catch (error) {
          console.error('Error deleting all transactions:', error);
          message.error('删除所有交易数据时发生错误');
        }
      },
    });
  };
  const onDeleteAllTransactionsMatchRule = async () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setTimeRange([null, null]);
    setDateRange(null);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (timeType === 'trans_time' && (!values.trans_time[0] || !values.trans_time[1])) {
        message.error('请选择完整的时间范围');
        return;
      }
      if (timeType === 'creation_time' && !values.creation_time) {
        message.error('请选择完整的时间范围');
        return;
      }
      let startDate: string;
      let endDate: string;
      let creationTime: string;

      if (timeType === 'trans_time') {
        // 转换日期格式
        startDate = values.trans_time[0].startOf('year').format('YYYY-MM-DD HH:mm:ss');
        endDate = values.trans_time[1].endOf('year').format('YYYY-MM-DD HH:mm:ss');
      } else {
        creationTime = values.creation_time.format('YYYY-MM-DD HH:mm:ss');
      }

      Modal.confirm({
        title: '确认删除',
        content: `确认删除${timeType === 'trans_time' ? '交易' : '创建'}时间  ${timeType === 'trans_time' ? `${startDate} 至 ${endDate}` : creationTime} 交易记录吗？`,
        onOk: async () => {
          try {
            // 调用 API 删除指定时间范围内的交易
            const params = {
              [timeType]:
                timeType === 'trans_time'
                  ? [startDate, endDate]
                  : creationTime,
            };
            console.log(params, 'params');

            const result = await window.mercury.api.deleteAllTransactions(params);

            if (result.code === 200) {
              emitter.emit('refresh', 'transaction');
              message.success(`成功删除 ${result.message || 0} 条交易记录`);

              handleCancel(); // 关闭弹窗
            } else {
              message.error(result.message || '删除失败');
            }
          } catch (error) {
            console.error('Error deleting transactions by time range:', error);
            message.error('删除交易数据时发生错误');
          }
        },
      });
    } catch (error) {
      console.error('Form validation error:', error);
    }
  };

  const handleEnvironmentChange = async (e: any) => {
    const newEnv = e.target.value;
    await window.mercury.store.setEnvironment(newEnv);
    setEnvironment(newEnv);
    emitter.emit('environmentChange', newEnv);
    message.success(`已切换到${newEnv === 'production' ? '生产' : '测试'}环境`);
  };
  const onBatchReplaceTransactions = () => {
    setIsBatchReplaceVisible(true);
  };
  return (
    <Form
      style={{ height: '100%' }}
      form={form}
      initialValues={{
        env: environment,
      }}
      layout="vertical"
    >
      <Form.Item label="运行环境" name="env">
        <Radio.Group value={environment} onChange={handleEnvironmentChange}>
          <Radio value="production">生产环境</Radio>
          <Radio value="test">测试环境</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="删除操作" tooltip="删除所有交易数据">
        {/* <Button onClick={onDeleteAllTransactions}>删除所有交易</Button> */}
        <Button onClick={onDeleteAllTransactionsMatchRule} style={{ marginLeft: 8 }}>
          删除时间范围内的交易
        </Button>
        {/* <Button onClick={onBatchReplaceTransactions} style={{ marginLeft: 8 }}>批量替换交易</Button> */}
      </Form.Item>
      <Form.Item label="导出" tooltip="导出所有数据">
        <Space>
          <Button onClick={onExportCsv}>导出csv</Button>
          <Button onClick={onExportJson}>导出json</Button>
        </Space>
      </Form.Item>

      {/* 删除时间范围内交易的弹窗 */}
      <Modal
        title="删除时间范围内的交易"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="删除"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="时间类型"
            name="timeType"
            initialValue="trans_time"
            rules={[{ required: true, message: '请选择时间类型' }]}
          >
            <Select
              onChange={value => setTimeType(value)}
              options={[
                { value: 'trans_time', label: '交易时间' },
                { value: 'creation_time', label: '创建时间' },
              ]}
            />
          </Form.Item>

          {timeType === 'trans_time' ? (
            <Form.Item label="交易时间" name="trans_time">
              <RangePickerWrap bordered />
            </Form.Item>
          ) : (
            <Form.Item label="创建时间" name="creation_time">
              <DatePicker showTime />
            </Form.Item>
          )}
        </Form>
      </Modal>

      <BatchReplaceDrawer
        visible={isBatchReplaceVisible}
        onClose={() => setIsBatchReplaceVisible(false)}
        onSuccess={() => {
          setIsBatchReplaceVisible(false);
          // 可以在这里添加刷新数据的逻辑
        }}
      />
    </Form>
  );
}
export default BasicContent;
