import {
  Button,
  Cascader,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  theme,
} from 'antd';
import React, { useState } from 'react';
import RangePickerWrap from '../../components/rangePickerWrap';
import { cpt_const } from '../../const/web';
import { DownOutlined } from '@ant-design/icons';
import { Params_Transaction } from 'src/preload/index';
import dayjs from 'dayjs';
import { I_FormValue } from './index';
import { DefaultOptionType } from 'antd/es/cascader';
import { category_type } from 'src/renderer/const/categroy';

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
      flow_type: values.flow_type === 'all' ? undefined : values.flow_type,
      all_flow_type: values.flow_type === 'all',
      trans_time: values.trans_time?.map((date: any) =>
        dayjs(date).format('YYYY-MM-DD HH:mm:ss')
      ),
      creation_time: values.creation_time?.map((date: any) =>
        dayjs(date).format('YYYY-MM-DD HH:mm:ss')
      ),
      modify_time: values.modify_time?.map((date: any) =>
        dayjs(date).format('YYYY-MM-DD HH:mm:ss')
      ),
    };
    // 写个方法，根据description找到

    console.log('params', params);

    props.setFormValue(params);
    props.getTransactions(params);
  };

  return (
    <Form
      form={form}
      initialValues={{
        ...formValue,
        trans_time: formValue.trans_time ? [dayjs(formValue.trans_time[0]), dayjs(formValue.trans_time[1])] : undefined,
        creation_time: formValue.creation_time ? [dayjs(formValue.creation_time[0]), dayjs(formValue.creation_time[1])] : undefined,
        modify_time: formValue.modify_time ? [dayjs(formValue.modify_time[0]), dayjs(formValue.modify_time[1])] : undefined,
      }}
      onValuesChange={(changedValues, allValues) => {
        const new_allValues = { ...allValues };
        if (changedValues?.chose_unclassified === 'unclassified') {
          new_allValues.category = undefined;
        }
        if (changedValues?.category && changedValues?.category.length === 0) {
          new_allValues.category = undefined;
        }
        form.setFieldsValue(new_allValues);
        // const trans_time = allValues.trans_time;
        // if (Array.isArray(trans_time) && trans_time.length === 2) {
        //   new_allValues.trans_time = [
        //     dayjs(trans_time[0]).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
        //     dayjs(trans_time[1]).endOf('month').format('YYYY-MM-DD HH:mm:ss'),
        //   ];
        // }
        // console.log(new_allValues, 'new_allValues');
        // props.setFormValue(new_allValues);
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
        <Col span={8}>
          <Form.Item name={`trans_time`} label="交易时间">
            <RangePickerWrap bordered type="date" placeholder="placeholder" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="payment_type" label="付款方式">
            <Select allowClear placeholder="付款方式" options={cpt_const.payment_type} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        {expand && (
          <><Col span={8}>
            <Form.Item name="flow_type" label="收支类型">
              <Radio.Group block optionType="button" buttonStyle="solid">
                <Radio value="all">全部</Radio>
                <Radio value="2">收入</Radio>
                <Radio value="1">支出</Radio>
                {/* <Radio value="3">不计支出</Radio> */}
              </Radio.Group>
            </Form.Item>
          </Col>
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

        {expand && (
          <Col span={8}>
            <Form.Item label="金额区间">
              <Space.Compact>
                <Form.Item
                  className="no-margin"
                  name={`min_money`}
                  style={{ display: 'inline-block', width: '50%' }}
                >
                  <InputNumber placeholder="最小金额" />
                </Form.Item>

                <Form.Item
                  className="no-margin"
                  name={`max_money`}
                  style={{ display: 'inline-block', width: '50%' }}
                >
                  <InputNumber placeholder="最大金额" />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          </Col>
        )}


        {expand && (
          <>
            <Col span={8}>
              <Form.Item name="consumer" label="消费成员">
                <Select allowClear placeholder="消费成员" options={cpt_const.consumer_type} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="tag" label="标签">
                <Select allowClear placeholder="标签" options={cpt_const.tag_type} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="category" label="交易分类">
                <Cascader
                  options={category_type}
                  allowClear
                  multiple
                  placeholder="请选择分类"
                  showSearch={{
                    filter: (inputValue: string, path: DefaultOptionType[]) =>
                      path.some(
                        option =>
                          (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) >
                          -1
                      ),
                  }}
                />
              </Form.Item>
            </Col>

          </>
        )}

      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item name="account_type" label="账户">
            <Select allowClear placeholder="账户" options={cpt_const.account_type} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="description">
            <Input.Search
              placeholder="请输入描述、交易对象"
              onSearch={() => {
                form.submit();
              }}
            />
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
