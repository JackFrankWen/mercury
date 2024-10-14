import {Button, Col, Form, Input, InputNumber, Radio, Row, Select, Space, theme} from "antd";
import React, {useState} from "react";
import RangePickerWrap from "../../components/rangePickerWrap";
import {cpt_const} from "../../const/web";
import {DownOutlined} from "@ant-design/icons";

export const AdvancedSearchForm = () => {
    const {token} = theme.useToken();
    const [form] = Form.useForm();
    const [expand, setExpand] = useState(false);

    const formStyle: React.CSSProperties = {
        maxWidth: 'none',
        // background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
    };


    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
    };

    return (
        <Form form={form} name="advanced_search" style={formStyle} onFinish={onFinish}>
            <Row gutter={24}>
                <Col span={8}>

                    <Form.Item
                        name={`exs`}
                        label="描述"
                    >
                        <Radio.Group>
                            <Radio value="1">正常</Radio>
                            <Radio value="2">未分类</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                {
                    expand && (
                        <Col span={8}>

                            <Form.Item
                                name={`exs`}
                                label="创建时间"
                            >
                                <RangePickerWrap bordered placeholder="placeholder"/>
                            </Form.Item>
                        </Col>
                    )

                }

                <Col span={8}>
                    <Form.Item name="payment_type" label="付款方式">
                        <Select
                            allowClear
                            placeholder="付款方式"
                            options={cpt_const.payment_type}
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>

                    <Form.Item
                        name={`date`}
                        label="交易时间"

                    >
                        <RangePickerWrap bordered placeholder="placeholder"/>
                    </Form.Item>
                </Col>
                {
                    expand && (
                        <Col span={8}>
                            <Form.Item
                                name={`exs`}
                                label="金额"

                            >
                                <Form.Item style={{display: 'inline-block'}}>
                                    <InputNumber style={{width: 'calc(40% - 12px)'}}/>
                                </Form.Item>
                                <Form.Item style={{display: 'inline-block'}}>

                                    <InputNumber style={{width: 'calc(40% - 12px)'}}/>
                                </Form.Item>
                            </Form.Item>
                        </Col>
                    )
                }

                <Col span={8}>
                    <Form.Item name="account_type" label="账户">
                        <Select
                            allowClear
                            placeholder="账户"
                            options={cpt_const.account_type}
                        />
                    </Form.Item>
                </Col>
                {
                    expand && (
                        <>
                            <Col span={8}>
                                <Form.Item name="consumer" label="消费成员">
                                    <Select
                                        allowClear
                                        placeholder="消费成员"
                                        options={cpt_const.consumer_type}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="tag" label="标签">
                                    <Select placeholder="标签" options={cpt_const.tag_type}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="cost_type" label="消费目的">
                                    <Select placeholder="消费目的" options={cpt_const.cost_type}/>
                                </Form.Item>
                            </Col>

                        </>
                    )

                }
                <Col span={8}>
                    <Form.Item name="description">
                        <Input.Search
                            placeholder="请输入描述"
                            onSearch={(val) => {
                                console.log(val, 'string')
                            }}
                        />
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Space size="small">
                        <Button type="primary" htmlType="submit">
                            Search
                        </Button>
                        <Button
                            onClick={() => {
                                form.resetFields();
                            }}
                        >
                            AI分类
                        </Button>
                        <a
                            style={{fontSize: 12}}
                            onClick={() => {
                                setExpand(!expand);
                            }}
                        >
                            <DownOutlined rotate={expand ? 180 : 0}/> Collapse
                        </a>
                    </Space>
                </Col>
            </Row>

        </Form>
    );
};