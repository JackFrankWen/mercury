import React, { useEffect, useState } from "react";
import { cpt_const } from "src/renderer/const/web";
import { category_type } from "src/renderer/const/categroy";
import SelectWrap from "./selectWrap";
import { toNumberOrUndefiend } from "./utils";
import { Form, InputNumber, Input, Space } from "antd";
import CategoryCascader from "./CategoryCascader";

const BatchUpdateArea = (props: { formValues: any; setFormValues: (values: any) => void }) => {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {

    if (values.amount || values.description) {
      form.resetFields();
    }
  };
  return (
    <Form
      form={form}
      initialValues={props.formValues}
      onValuesChange={(changedValues, allValues,) => {
        console.log(allValues, 'allValues');
        console.log(changedValues, 'props.changedValues');
        if ('category' in changedValues) {
          if (changedValues.category && changedValues.category.length === 0) {
            allValues.account_type = undefined;
            allValues.flow_type = undefined;
            allValues.tag = undefined;
            allValues.consumer = undefined;
            form.setFieldsValue({
              account_type: undefined,
              flow_type: undefined,
              tag: undefined,
              consumer: undefined,
            });
          } else {
            const found = category_type.find((val) => val.value === changedValues.category[0]);
            if (found) {
              const obj = found?.children.find((val) => val.value === changedValues.category[1]);
              console.log(obj, 'obj');
              // 使用类型断言处理可能不存在的属性
              const childObj = obj as any;
              allValues.account_type = toNumberOrUndefiend(childObj?.account_type);
              allValues.flow_type = toNumberOrUndefiend(childObj?.flow_type);
              allValues.tag = toNumberOrUndefiend(childObj?.tag);
              allValues.consumer = toNumberOrUndefiend(childObj?.consumer);
              form.setFieldsValue({
                account_type: toNumberOrUndefiend(childObj?.account_type),
                flow_type: toNumberOrUndefiend(childObj?.flow_type),
                tag: toNumberOrUndefiend(childObj?.tag),
                consumer: toNumberOrUndefiend(childObj?.consumer),
              });
            }
          }
        }

        props.setFormValues(allValues);
      }}
      className="batch-update-area"
      layout="inline"
    >
      <Space.Compact block>
        <Form.Item name="category" className="no-margin">
          <CategoryCascader
            style={{ minWidth: "100px" }}
            options={category_type}
            popupClassName="large-cascader-dropdown"
            showSearch
            allowClear
            placeholder="分类"
            compact
          />
        </Form.Item>
        <Form.Item name="tag" className="no-margin">
          <SelectWrap placeholder="标签" options={cpt_const.tag_type} style={{ minWidth: "100px" }} />
        </Form.Item>
        {/* <Form.Item name="payment_type" className="no-margin">
          <SelectWrap placeholder="付款方式" options={cpt_const.payment_type} />
        </Form.Item> */}
        <Form.Item name="consumer" className="no-margin">
          <SelectWrap placeholder="消费成员" options={cpt_const.consumer_type} style={{ minWidth: "100px" }} />
        </Form.Item>
        <Form.Item name="amount" className="no-margin">
          <InputNumber placeholder="金额" />
        </Form.Item>
        <Form.Item name="description" className="no-margin">
          <Input placeholder="描述" />
        </Form.Item>
      </Space.Compact>
    </Form>
  );
};

export default BatchUpdateArea;
