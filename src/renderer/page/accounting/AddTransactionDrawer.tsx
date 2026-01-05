import React from "react";
import { Drawer, Form, Input, Button, Space, Select, DatePicker, message, Cascader } from "antd";
import { account_type, flow_type, payment_type, tag_type } from "../../const/web";
import { category_type } from "src/renderer/const/categroy";
import { toNumberOrUndefiend } from "src/renderer/components/utils";
import dayjs from "dayjs";

// 定义消费者类型映射
const CONSUMER_TYPE_MAP = {
  1: { label: "老公", color: "cyan" },
  2: { label: "老婆", color: "magenta" },
  3: { label: "家庭", color: "geekblue" },
  4: { label: "牧牧", color: "purple" },
  5: { label: "爷爷奶奶", color: "lime" },
  6: { label: "二宝", color: "orange" },
} as const;

interface AddTransactionDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function AddTransactionDrawer({ visible, onClose, onSuccess }: AddTransactionDrawerProps) {
  const [form] = Form.useForm();

  const initData = {
    category: undefined,
    amount: undefined,
    description: "无",
    payee: "无",
    consumer: undefined,
    payment_type: 3,
    account_type: 1,
    tag: undefined,
    trans_time: dayjs(),
  };
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!values.amount) {
        message.error("请输入金额");
        return;
      }
      if (!values.consumer) {
        message.error("请选择消费者");
        return;
      }
      if (!values.account_type) {
        message.error("请选择账户");
        return;
      }

      const formattedValues = {
        ...values,
        flow_type: 1,
        category: JSON.stringify(values.category),
        trans_time: values.trans_time ? values.trans_time.format("YYYY-MM-DD HH:mm:ss") : undefined,
      };
      await window.mercury.api.insertTransaction(formattedValues);
      message.success("添加成功");
      form.resetFields();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("添加失败:", error);
      message.error("添加失败");
    }
  };

  return (
    <Drawer
      title="新增交易"
      width={500}
      open={visible}
      onClose={onClose}
      extra={
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={handleSubmit}>
            提交
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" initialValues={initData}>
        <Form.Item name="category" label="分类">
          <Cascader
            options={category_type}
            allowClear
            placeholder="请选择分类"
            popupClassName="large-cascader-dropdown"
            onChange={(category) => {
              if (category && category[0]) {
                const found = category_type.find((val) => val.value === category[0]);
                if (found) {
                  // @ts-ignore
                  const obj: any = found?.children.find((val: any) => val.value === category[1]);

                  form.setFieldsValue({
                    tag: toNumberOrUndefiend(obj?.tag),
                    consumer: toNumberOrUndefiend(obj?.consumer),
                  });
                }
              }
            }}
          />
        </Form.Item>
        <Form.Item name="amount" label="金额" rules={[{ required: true, message: "请输入金额" }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input />
        </Form.Item>
        <Form.Item name="payee" label="交易对方">
          <Input />
        </Form.Item>
        <Form.Item
          name="consumer"
          label="消费者"
          rules={[{ required: true, message: "请选择消费者" }]}
        >
          <Select
            options={Object.entries(CONSUMER_TYPE_MAP).map(([key, value]) => ({
              value: Number(key),
              label: value.label,
            }))}
          />
        </Form.Item>
        <Form.Item name="payment_type" label="付款方式">
          <Select
            options={Object.entries(payment_type).map(([key, value]) => ({
              value: Number(key),
              label: value,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="account_type"
          label="账户"
          rules={[{ required: true, message: "请选择账户" }]}
        >
          <Select
            options={Object.entries(account_type).map(([key, value]) => ({
              value: Number(key),
              label: value,
            }))}
          />
        </Form.Item>
        <Form.Item name="tag" label="标签">
          <Select
            options={Object.entries(tag_type).map(([key, value]) => ({
              value: Number(key),
              label: value,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="trans_time"
          label="交易时间"
          rules={[{ required: true, message: "请选择交易时间" }]}
        >
          <DatePicker showTime />
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default AddTransactionDrawer;
