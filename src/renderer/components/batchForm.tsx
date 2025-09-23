import React, { useEffect, useState } from "react";
import { cpt_const } from "src/renderer/const/web";
import { category_type } from "src/renderer/const/categroy";
import SelectWrap from "./selectWrap";
import { toNumberOrUndefiend } from "./utils";
import { Cascader, Form, InputNumber, Input, Space } from "antd";
import type { DefaultOptionType } from "antd/es/cascader";

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
              const obj = found?.children.find((val: any) => val.value === changedValues.category[1]);
              console.log(obj, 'obj');
              allValues.account_type = toNumberOrUndefiend(obj?.account_type);
              allValues.flow_type = toNumberOrUndefiend(obj?.flow_type);
              allValues.tag = toNumberOrUndefiend(obj?.tag);
              allValues.consumer = toNumberOrUndefiend(obj?.consumer);
              form.setFieldsValue({
                account_type: toNumberOrUndefiend(obj?.account_type),
                flow_type: toNumberOrUndefiend(obj?.flow_type),
                tag: toNumberOrUndefiend(obj?.tag),
                consumer: toNumberOrUndefiend(obj?.consumer),
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
          <Cascader
            style={{ minWidth: "100px" }}
            options={category_type}
            popupClassName="large-cascader-dropdown"
            displayRender={(label: string[]) => {
              if (label.length === 0) {
                return "";
              }

              return label[label.length - 1];
            }}
            showSearch={{
              filter: (inputValue: string, path: DefaultOptionType[]) =>
                path.some(
                  (option) =>
                    (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1
                ),
            }}
            onChange={(category) => {
              // if (category && category[0]) {
              //   const found = category_type.find((val) => val.value === category[0]);
              //   if (found) {
              //     // @ts-ignore
              //     const obj: any = found?.children.find((val: any) => val.value === category[1]);


              //     form.setFieldsValue({
              //       account_type: toNumberOrUndefiend(obj?.account_type),
              //       flow_type: toNumberOrUndefiend(obj?.flow_type),
              //       tag: toNumberOrUndefiend(obj?.tag),
              //       consumer: toNumberOrUndefiend(obj?.consumer),
              //     });
              //     props.setFormValues({
              //       account_type: toNumberOrUndefiend(obj?.account_type),
              //       flow_type: toNumberOrUndefiend(obj?.flow_type),
              //       tag: toNumberOrUndefiend(obj?.tag),
              //       consumer: toNumberOrUndefiend(obj?.consumer),
              //     });
              //   }
              // } else {
              //   form.setFieldsValue({
              //     account_type: undefined,
              //     flow_type: undefined,
              //     tag: undefined,
              //     consumer: undefined,
              //   });
              //   props.setFormValues({
              //     account_type: undefined,
              //     flow_type: undefined,
              //     tag: undefined,
              //     consumer: undefined,
              //   });
              // }
            }}
            allowClear
            placeholder="分类"
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
