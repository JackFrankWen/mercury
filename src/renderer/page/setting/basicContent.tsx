import { Form, Radio, Button, Breadcrumb, Space, message, Modal, DatePicker, Select } from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import emitter from "../../events";
import RangePickerWrap from "../../components/rangePickerWrap";

function BasicContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeRange, setTimeRange] = useState([null, null]);
  const [timeType, setTimeType] = useState("trans_time");
  const [form] = Form.useForm();
  const [environment, setEnvironment] = useState<string>();
  useEffect(() => {
    const loadEnvironment = async () => {
      const env = await window.mercury.store.getEnvironment();
      console.log(env, "env");
      setEnvironment(env);
      form.setFieldsValue({
        env: env
      });
    };
    loadEnvironment();
  }, []);

  const onExportCsv = async () => {
    try {
      const result = await window.mercury.api.exportToCsv();
      if (result.code === 200) {
        message.success("导出成功");
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error("Export error:", error);
      message.error("导出失败");
    }
  };
  const onExportJson = () => {
    console.log("导出json");
  };
  const onDeleteAllTransactions = async () => {
    Modal.confirm({
      title: "确认",
      content: "确认删除所有交易数据吗？",
      onOk: async () => {
        try {
          const result = await window.mercury.api.deleteAllTransactions();
          if (result.code === 200) {
            message.success(result.message);
          } else {
            message.error(result.message);
          }
        } catch (error) {
          console.error("Error deleting all transactions:", error);
          message.error("删除所有交易数据时发生错误");
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
    form.resetFields();
  };
  
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (!timeRange[0] || !timeRange[1]) {
        message.error("请选择完整的时间范围");
        return;
      }
      
      // 转换日期格式
      const startDate = timeRange[0].format("YYYY-MM-DD");
      const endDate = timeRange[1].format("YYYY-MM-DD");
      
      Modal.confirm({
        title: "确认删除",
        content: `确认删除${timeType === "trans_time" ? "交易" : "创建"}时间在 ${startDate} 至 ${endDate} 范围内的交易记录吗？`,
        onOk: async () => {
          try {
            // 调用 API 删除指定时间范围内的交易
            const params = {
              [timeType]: [startDate, endDate]
            }
            const result = await window.mercury.api.deleteAllTransactions(params);
            
            if (result.code === 200) {
              message.success(`成功删除 ${result.message || 0} 条交易记录`);
              handleCancel(); // 关闭弹窗
            } else {
              message.error(result.message || "删除失败");
            }
          } catch (error) {
            console.error("Error deleting transactions by time range:", error);
            message.error("删除交易数据时发生错误");
          }
        }
      });
    } catch (error) {
      console.error("Form validation error:", error);
    }
  
  };

  const handleEnvironmentChange = async (e: any) => {
    const newEnv = e.target.value;
    await window.mercury.store.setEnvironment(newEnv);
    setEnvironment(newEnv);
    emitter.emit("environmentChange", newEnv);
    message.success(`已切换到${newEnv === 'production' ? '生产' : '测试'}环境`);
  };
  return (
    <Form style={{ height: "100%" }}
    form={form}
    initialValues={{
      env: environment
    }}
     layout="vertical">
      <Form.Item label="运行环境" name="env" >
        <Radio.Group value={environment} onChange={handleEnvironmentChange}>
          <Radio value="production">生产环境</Radio>
          <Radio value="test">测试环境</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="当前版本" tooltip="This is a required field">
        <Button onClick={onDeleteAllTransactions}>删除所有交易</Button>
        <Button onClick={onDeleteAllTransactionsMatchRule} style={{ marginLeft: 8 }}>删除时间范围内的交易</Button>
      </Form.Item>
      <Form.Item label="导出" tooltip="This is a required field">
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
            rules={[{ required: true, message: "请选择时间类型" }]}
          >
            <Select 
              onChange={(value) => setTimeType(value)}
              options={[
                { value: "trans_time", label: "交易时间" },
                { value: "creation_time", label: "创建时间" }
              ]}
            />
          </Form.Item>
          
          <Form.Item 
            label="时间范围" 
            name="timeRange"
            rules={[{ required: true, message: "请选择时间范围" }]}
          >
            <RangePickerWrap 
              value={timeRange}
              onChange={(dates) => setTimeRange(dates)}
              bordered
            />
          </Form.Item>
        </Form>
      </Modal>
    </Form>
  );
}
export default BasicContent;
