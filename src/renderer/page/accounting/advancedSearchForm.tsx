import { Button, Col, Form, Input, InputNumber, Radio, Row, Select, Space, theme } from 'antd';
import React, { useState } from 'react';
import RangePickerWrap from '../../components/rangePickerWrap';
import { cpt_const } from '../../const/web';
import { DownOutlined } from '@ant-design/icons';
import { Params_Transaction } from 'src/preload/index';
import dayjs from 'dayjs';
import { I_FormValue } from './index';

export const AdvancedSearchForm = (props: {
  getTransactions: (params: Params_Transaction) => void;
  setFormValue: (formValue: I_FormValue) => void;
  formValue: I_FormValue;
}) => {
  const { formValue } = props;
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [expand, setExpand] = useState(false);

  const formStyle: React.CSSProperties = {
    maxWidth: 'none',
    // background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
  };

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    const params = {
      ...values,
      is_unclassified: values.chose_unclassified === 'unclassified',
      trans_time: values.trans_time?.map((date: any, index: number) => {
        if (index === 0) {
          return dayjs(date).startOf('month').format('YYYY-MM-DD HH:mm:ss');
        } else {
          return dayjs(date).endOf('month').format('YYYY-MM-DD HH:mm:ss');
        }
      }),
    };

    console.log('params', params);

    props.getTransactions(params);
  };

  return (
    <Form
      form={form}
      initialValues={{
        ...formValue,
        trans_time: [dayjs(formValue.trans_time[0]), dayjs(formValue.trans_time[1])],
      }}
      onValuesChange={(changedValues, allValues) => {
        const new_allValues = { ...allValues };
        const trans_time = allValues.trans_time;
        if (Array.isArray(trans_time) && trans_time.length === 2) {
          new_allValues.trans_time = [
            dayjs(trans_time[0]).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
            dayjs(trans_time[1]).endOf('month').format('YYYY-MM-DD HH:mm:ss'),
          ];
        }
        console.log(new_allValues, 'new_allValues');
        props.setFormValue(new_allValues);
      }}
      name="advanced_search"
      style={formStyle}
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item name={`chose_unclassified`} label="分类">
            <Radio.Group block optionType="button" buttonStyle="solid">
              <Radio value="normal">全部</Radio>
              <Radio value="unclassified">未分类</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        {expand && (
          <>
            <Col span={8}>
              <Form.Item name={`creation_time`} label="创建时间">
                <RangePickerWrap bordered placeholder="placeholder" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={`modify_time`} label="修改时间">
                <RangePickerWrap bordered placeholder="placeholder" />
              </Form.Item>
            </Col>
          </>
        )}
        <Col span={8}>
          <Form.Item name={`trans_time`} label="交易时间">
            <RangePickerWrap bordered placeholder="placeholder" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="payment_type" label="付款方式">
            <Select allowClear placeholder="付款方式" options={cpt_const.payment_type} />
          </Form.Item>
        </Col>

        {expand && (
          <Col span={8}>
            <Form.Item label="金额">
              <Space.Compact>
                <Form.Item
                  className="no-margin"
                  name={`min_money`}
                  style={{ display: 'inline-block' }}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  className="no-margin"
                  name={`max_money`}
                  style={{ display: 'inline-block' }}
                >
                  <InputNumber />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          </Col>
        )}

        <Col span={8}>
          <Form.Item name="account_type" label="账户">
            <Select allowClear placeholder="账户" options={cpt_const.account_type} />
          </Form.Item>
        </Col>
        {expand && (
          <>
            <Col span={8}>
              <Form.Item name="consumer" label="消费成员">
                <Select allowClear placeholder="消费成员" options={cpt_const.consumer_type} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="tag" label="标签">
                <Select placeholder="标签" options={cpt_const.tag_type} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="cost_type" label="消费目的">
                <Select placeholder="消费目的" options={cpt_const.cost_type} />
              </Form.Item>
            </Col>
          </>
        )}
        <Col span={8}>
          <Form.Item name="description">
            <Input.Search placeholder="请输入描述、交易对象" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Space size="small">
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            {/* <Button
                            onClick={() => {
                                form.resetFields();
                            }}
                        >
                            AI分类
                        </Button> */}
            <a
              style={{ fontSize: 12 }}
              onClick={() => {
                setExpand(!expand);
              }}
            >
              {expand ? '收起' : '展开'}
              <DownOutlined rotate={expand ? 180 : 0} />
            </a>
          </Space>
        </Col>
      </Row>
    </Form>
  );
};
