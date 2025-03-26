import React, { useState } from 'react';
import { Card, Cascader, Col, message, notification, Row, Space, Switch, Table } from 'antd';
import { Button, Form, Input, Radio } from 'antd';
import SelectWrap from './selectWrap';
import { cpt_const } from '../const/web';
import { category_type } from '../const/categroy';
import { toNumberOrUndefiend } from './utils';
import useLoadingButton from './useButton';
import { DefaultOptionType } from 'antd/es/cascader';
import AdvancedRuleFormItem, { RuleItemList } from '../page/setting/advancedRuleFormItem';
import { AdvancedRule } from 'src/main/sqlite3/advance-rules';
import { ruleByAdvanced } from '../page/upload/ruleUtils';

import dayjs from 'dayjs';
export type RuleFormData = {
  id?: number;
  name?: string;
  category?: string;
  consumer?: string;
  abc_type?: number;
  cost_type?: number;
  priority?: number;
  rule: string; // 需要解析成 RuleItemList
  tag?: string;
};

const RuleForm = (props: { data?: AdvancedRule; onCancel: () => void; refresh: () => void }) => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [LoadingBtn, , setLoadingFalse] = useLoadingButton();

  const { data = {} as AdvancedRule } = props;
  const onFormLayoutChange = (value: { category: [number, number] }) => {
    console.log(value, 'onFormLayoutChange');

    // if (category) {
    //   const found = category_type.find((val) => val.value === category[0])
    //   if (found) {
    //     // @ts-ignore
    //     const obj = found.children.find((val) => val.value === category[1])
    //     if (obj) {
    //       Object.keys(obj).forEach((key) => {
    //         console.log(key)
    //         if (!['value', 'label'].includes(key)) {
    //           form.setFieldValue(key, obj[key])
    //         }
    //       })
    //     }
    //   }
    // }
  };
  const submitRule = async () => {
    const { data, refresh } = props;

    let res: any;
    try {
      const formValue = await form.validateFields();
      if (!formValue.category && !formValue.consumer && !formValue.tag) {
        message.error('分类、消费者、标签至少选择一项');
        return;
      }

      console.log(formValue, 'formValue ');
      if (data?.id) {
        res = await window.mercury.api.updateAdvancedRule(data.id, {
          ...formValue,
          active: formValue.active ? 1 : 0,
          category: JSON.stringify(formValue.category),
          rule: JSON.stringify(formValue.rule),
        });
        console.log(res, 'res');
      } else {
        res = await window.mercury.api.addAdvancedRule({
          ...formValue,
          active: formValue.active ? 1 : 0,
          category: JSON.stringify(formValue.category),
          rule: JSON.stringify(formValue.rule),
        });
        console.log(res, 'res');
      }
      if (res?.code === 200) {
        message.success('操作成功');
        setLoadingFalse();
        refresh();
      }
      console.log(res);
    } catch (error) {
      console.log(error);
      message.error(error);
    }
  };
  console.log(data, 'data');
  const testRule = async () => {
    
    try {
      const formValue = await form.getFieldsValue();
      const allData = await window.mercury.api.getTransactions({
        is_unclassified: false,
        flow_type: 1,
        trans_time: [dayjs('2000-01-01').format('YYYY-MM-DD'), dayjs('2099-01-01').format('YYYY-MM-DD')],
      });
      console.log(allData, 'allData ');
      await ruleByAdvanced(
        allData,
        [
          {
            ...formValue,
            active: formValue.active ? 1 : 0,
            category: JSON.stringify(formValue.category),
            rule: JSON.stringify(formValue.rule),
          },
        ],
        api
      );
    } catch (error) {
      console.log(error);
      message.error(error);
    }
  };

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={{
        name: data?.name,
        category: data?.category ? JSON.parse(data?.category) : undefined,
        abc_type: toNumberOrUndefiend(data?.abc_type),
        cost_type: toNumberOrUndefiend(data?.cost_type),
        tag: toNumberOrUndefiend(data?.tag),
        consumer: toNumberOrUndefiend(data?.consumer),
        rule: data?.rule ? JSON.parse(data?.rule) : [],
        priority: toNumberOrUndefiend(data?.priority) || 1,
        active: data?.active === 1,
      }}
      style={{ maxWidth: 600 }}
    >
      {contextHolder}
      <Form.Item name="category">
        <Cascader
          options={category_type}
          allowClear
          placeholder="请选择分类"
          showSearch={{
            filter: (inputValue: string, path: DefaultOptionType[]) =>
              path.some(
                option =>
                  (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1
              ),
          }}
        />
      </Form.Item>
      <Form.Item name="name" rules={[{ required: true, message: '请输入规则名称' }]}>
        <Input placeholder="规则名称" />
      </Form.Item>
      <Form.Item name="tag">
        <SelectWrap placeholder="标签" options={cpt_const.tag_type} />
      </Form.Item>
      <Form.Item name="consumer">
        <SelectWrap placeholder="消费者" options={cpt_const.consumer_type} />
      </Form.Item>
      <Form.Item name="priority">
        <SelectWrap placeholder="优先级" options={cpt_const.priority_type} />
      </Form.Item>
      <Form.Item name="active" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item name="rule">
        <AdvancedRuleFormItem />
      </Form.Item>
      <Form.Item style={{ textAlign: 'right' }}>
        <Space>
          <Button
            onClick={() => {
              props.onCancel();
            }}
          >
            取消
          </Button>
          <Button danger onClick={testRule}>
            测试规则
          </Button>
          <LoadingBtn type="primary" onClick={submitRule}>
            提交
          </LoadingBtn>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default RuleForm;
