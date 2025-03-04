import {Form, Radio, Button, Breadcrumb} from 'antd';
import React from 'react';

function BasicContent() {
    return (
        <Form
            style={{height: '100%'}}
            layout="vertical"
        >
            <Form.Item label="运行环境" name="requiredMarkValue">
                <Radio.Group>
                    <Radio value>生产环境</Radio>
                    <Radio value="optional">测试环境</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="当前版本"  tooltip="This is a required field">
                <p>1.0.0</p>
            </Form.Item>
            <Form.Item label="Field A"  tooltip="This is a required field">
                <Button>备份数据</Button>
            </Form.Item>

        </Form>
    );
}
export default BasicContent;