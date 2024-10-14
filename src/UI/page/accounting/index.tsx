import React, {useState} from "react";
import { DownOutlined } from '@ant-design/icons';

import {Card, Table, Form, Col, Row, Space, Button,Radio, theme} from "antd";
import RangePickerWrap from "../../components/rangePickerWrap";

const AdvancedSearchForm = () => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [expand, setExpand] = useState(false);

    const formStyle: React.CSSProperties = {
        maxWidth: 'none',
        // background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        padding: 24,
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
                        rules={[
                            {
                                required: true,
                                message: 'Input something!',
                            },
                        ]}
                    >
                        <Radio.Group>
                            <Radio value="1">正常</Radio>
                            <Radio value="2">未分类</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={8}>

                    <Form.Item
                        name={`exs`}
                        label="描述"
                        rules={[
                            {
                                required: true,
                                message: 'Input something!',
                            },
                        ]}
                    >
                        <RangePickerWrap bordered placeholder="placeholder" />
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
                            Clear
                        </Button>
                        <a
                            style={{ fontSize: 12 }}
                            onClick={() => {
                                setExpand(!expand);
                            }}
                        >
                            <DownOutlined rotate={expand ? 180 : 0} /> Collapse
                        </a>
                    </Space>
                </Col>
            </Row>

        </Form>
    );
};

function Accounting(): JSX.Element {
    return (
        <div>
            <h1>记账</h1>
            <Card>
               <AdvancedSearchForm />
            </Card>
            <Card>
                <Table
                    columns={[
                        {
                            title: '姓名',
                            dataIndex: 'name',
                            key: 'name',
                        },
                        {
                            title: '年龄',
                            dataIndex: 'age',
                            key: 'age',
                        },
                       ]}
                    dataSource={[
                        {
                            name: '张三',
                            age: 18,
                        },
                        {
                            name: '李四',
                            age: 19,
                        },
                        ]}
                />
            </Card>
        </div>
    );
}
export default Accounting;