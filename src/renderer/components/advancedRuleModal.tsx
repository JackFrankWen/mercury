import React, { useState } from 'react';
import { Card, Cascader, Col, message, notification, Row, Space, Switch, Table, Typography } from 'antd';
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
const { Title } = Typography;

import dayjs from 'dayjs';
export type RuleFormData = {
  id?: number;
  name?: string;
  category?: string;
  consumer?: string;
  priority?: number;
  rule: string; // 需要解析成 RuleItemList
  tag?: string;
};

// 定义验证错误类型
type ValidationResult = {
  isValid: boolean;
  message: string;
};


// 定义特殊字符验证规则
const VALIDATION_RULES = {
  specialChars: {
    pattern: /[~!@#$%^&*()+=<>?:"{},.\/;'\\[\]]/,
    message: '包含不允许的特殊字符~!@#$%^&*()+=<>?:"{},.\/;\'\\[\]]',
  },
  chinesePipe: {
    pattern: /｜/,
    message: '包含中文的｜符号，请使用英文的|符号',
  },
  endingPipe: {
    pattern: /\|$/,
    message: '不能以 | 符号结尾',
  },
  consecutivePipes: {
    pattern: /\|\|/,
    message: '不能包含连续的 || 符号',
  },
};

const validateRuleValue = (rule: RuleItemList): ValidationResult => {
  console.log(rule, 'rule===');

  try {
    // 遍历每个规则组（或条件组）
    for (const [groupIndex, ruleGroup] of rule.entries()) {
      // 遍历每个规则项（且条件组）
      console.log(ruleGroup, 'ruleGroup==');
      for (const [itemIndex, ruleItem] of ruleGroup.entries()) {
        const rulePosition = `规则组 ${groupIndex + 1} 的第 ${itemIndex + 1} 行`;

        // 跳过特殊字段的验证
        // if (SKIP_VALIDATION_FIELDS.includes(ruleItem.condition as any)) {
        //   continue;
        // }

        // 检查必填字段
        const requiredFields = {
          condition: '条件',
          formula: '公式',
          value: '值',
        } as const;
        console.log(ruleItem, '检查第', itemIndex, '行');

        for (const [field, fieldName] of Object.entries(requiredFields)) {

          if (!ruleItem[field as keyof typeof requiredFields]) {
            return {
              isValid: false,
              message: `${rulePosition} 【${fieldName}】不能为空`,
            };
          }
        }

        // 验证值的格式（仅当值为字符串时）
        if (typeof ruleItem.value === 'string' && ruleItem.condition !== 'category') {
          const valueWithoutPipes = ruleItem.value.replace(/\|/g, '');

          // 验证特殊字符
          for (const [key, { pattern, message }] of Object.entries(VALIDATION_RULES)) {
            const testValue = key === 'endingPipe' || key === 'consecutivePipes' ? ruleItem.value : valueWithoutPipes;
            if (pattern.test(testValue)) {
              return {
                isValid: false,
                message: `${rulePosition}中值${message}`,
              };
            }
          }
        }
      }
    }

    return { isValid: true, message: '' };
  } catch (error) {
    console.error('Rule validation error:', error);
    return {
      isValid: false,
      message: '规则验证过程中发生错误',
    };
  }
};

const RuleForm = (props: { data?: AdvancedRule; onCancel: () => void; refresh: () => void }) => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [messageApi, contextHolderMsg] = message.useMessage();

  const [LoadingBtn, , setLoadingFalse] = useLoadingButton();

  const { data = {} as AdvancedRule } = props;

  const submitRule = async () => {

    try {

      const { data, refresh } = props;
      const formValue = await form.getFieldsValue();
      if (!formValue.name) {
        setLoadingFalse();
        messageApi.error('规则名称未填写')
        return;
      }

      if (!formValue.category && !formValue.consumer && !formValue.tag) {
        messageApi.error('分类、消费者、标签至少选择一项');
        setLoadingFalse();
        return;
      }


      // 添加规则值的校验
      const validation = validateRuleValue(formValue.rule);
      if (!validation.isValid) {
        message.error(validation.message);
        setLoadingFalse();
        return;
      }

      let res: any;

      if (data?.id) {
        res = await window.mercury.api.updateAdvancedRule(data.id, {
          ...formValue,
          active: data?.active ? 1 : 0,
          category: JSON.stringify(formValue.category),
          rule: JSON.stringify(formValue.rule),
        });
        console.log(res, 'res');
      } else {
        res = await window.mercury.api.addAdvancedRule({
          ...formValue,
          active: 1,
          category: JSON.stringify(formValue.category),
          rule: JSON.stringify(formValue.rule),
        });
        console.log(res, 'res');
      }

      if (res?.code === 200) {
        messageApi.success('操作成功');
        setLoadingFalse();
        props.onCancel();
        form.resetFields();
        refresh();
      }
    } catch (error) {
      message.error(error);
      console.log(error);
      setLoadingFalse();
    }
  };

  const testRule = async () => {
    try {
      const formValue = await form.getFieldsValue();
      // 添加规则值的校验
      const validation = validateRuleValue(formValue.rule);
      if (!validation.isValid) {
        message.error(validation.message);
        return;
      }
      if (!formValue.category && !formValue.consumer && !formValue.tag) {
        message.error('分类、消费者、标签至少选择一项');
        return;
      }
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
      style={{
        maxWidth: 600,
      }}
      initialValues={{
        name: data?.name,
        category: data?.category ? JSON.parse(data?.category) : undefined,
        tag: toNumberOrUndefiend(data?.tag),
        consumer: toNumberOrUndefiend(data?.consumer),
        rule: data?.rule
          ? JSON.parse(data?.rule)
          : [
            [
              {
                condition: 'description',
                formula: 'like',
                value: '',
              },
            ],
          ],
        priority: toNumberOrUndefiend(data?.priority) || 1,
        active: data?.active === 1,
      }}
    >
      {contextHolder}
      {contextHolderMsg}
      {/* 基本信息区块 */}
      <div
        style={{
          backgroundColor: '#fafafa',
          padding: '8px 16px',
          borderRadius: '8px',
          marginBottom: '12px',
        }}
      >
        <Title level={5} style={{ marginTop: 4 }}>基本信息</Title>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="name" label="规则名称" rules={[{ required: true, message: '请输入规则名称' }]}>
              <Input placeholder="请输入规则名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="priority" label="规则优先级">
              <SelectWrap placeholder="请选择优先级" options={cpt_const.priority_type} />
            </Form.Item>
          </Col>
        </Row>

        <Title level={5} style={{ marginTop: 0 }}>当满足下面任何一个规则组时</Title>
        <Form.Item name="rule">
          <AdvancedRuleFormItem />
        </Form.Item>

        <Title level={5} style={{ marginTop: 0 }}>可更换交易数据中的</Title>

        <Form.Item name="category" style={{ marginBottom: '12px' }} label="分类" layout={'horizontal'}>
          <Cascader
            options={category_type}
            allowClear
            placeholder="请选择分类"
            style={{ width: '100%' }}
            showSearch={{
              filter: (inputValue: string, path: DefaultOptionType[]) =>
                path.some(option => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1),
            }}
          />
        </Form.Item>

        <Form.Item name="tag" style={{ marginBottom: '12px' }} label="标签" layout={'horizontal'}>
          <SelectWrap placeholder="请选择标签" options={cpt_const.tag_type} />
        </Form.Item>

        <Form.Item name="consumer" style={{ marginBottom: '0' }} label="消费者" layout={'horizontal'}>
          <SelectWrap placeholder="请选择消费者" options={cpt_const.consumer_type} />
        </Form.Item>
      </div>

      {/* 操作按钮区 */}
      <Form.Item
        style={{
          textAlign: 'right',
          marginTop: '24px',
          marginBottom: '0',
          borderTop: '1px solid #f0f0f0',
          paddingTop: '16px',
        }}
      >
        <Space size="middle">
          <Button onClick={props.onCancel}>取消</Button>
          <Button danger onClick={testRule}>
            测试规则
          </Button>
          <LoadingBtn
            type="primary"
            onClick={() => {
              submitRule()
            }}
          >
            保存规则
          </LoadingBtn>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default RuleForm;
