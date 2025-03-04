import {Form, Radio, Button, Breadcrumb, Space, message} from 'antd';
import React from 'react';

function BasicContent() {
    
    const onExportCsv = async () => {
        try {
            const result = await window.mercury.api.exportToCsv();
            if (result.code === 200) {
                message.success('导出成功');
            } else {
                message.error(result.message);
            }
        } catch (error) {
            console.error('Export error:', error);
            message.error('导出失败');
        }
    }
    const onExportJson = () => {
        console.log('导出json');
    }
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
            <Form.Item label="导出"  tooltip="This is a required field">
                <Space>
                    <Button onClick={onExportCsv}>导出csv</Button>
                    <Button onClick={onExportJson}>导出json</Button>
                </Space>
            </Form.Item>

        </Form>
    );
}
export default BasicContent;