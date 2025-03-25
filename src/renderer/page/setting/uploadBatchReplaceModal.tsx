import React, { useState } from 'react';
import { Modal, Steps, Radio, Upload, Table, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { I_Transaction } from 'src/main/sqlite3/transactions';
import dayjs from 'dayjs';

const { Step } = Steps;

interface BatchReplaceDrawerProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const sourceTypes = [
    { label: '京东', value: 'jd' },
    { label: '拼多多', value: 'pdd' },
    { label: '大众点评', value: 'dianping' },
];

export function BatchReplaceDrawer({ visible, onClose, onSuccess }: BatchReplaceDrawerProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [sourceType, setSourceType] = useState<string>();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [matchedRecords, setMatchedRecords] = useState<I_Transaction[]>([]);
    const [loading, setLoading] = useState(false);

    // 处理文件上传
    const handleFileUpload = async (file: File) => {
        try {
            // TODO: 解析CSV文件的逻辑
            const reader = new FileReader();
            reader.onload = async (e) => {
                const text = e.target?.result;
                // 这里需要根据不同来源类型解析CSV
                console.log('File content:', text);

                // 获取过去十年的交易记录
                const endDate = dayjs().format('YYYY-MM-DD');
                const startDate = dayjs().subtract(10, 'year').format('YYYY-MM-DD');

                const transactions = await window.mercury.api.getAllTransactions({
                    trans_time: [startDate, endDate]
                });

                // TODO: 匹配逻辑，这里需要根据实际情况实现
                setMatchedRecords(transactions);
                setCurrentStep(2);
            };
            reader.readAsText(file);
            return false; // 阻止自动上传
        } catch (error) {
            message.error('文件解析失败');
            return false;
        }
    };

    // 表格列定义
    const columns = [
        {
            title: '交易时间',
            dataIndex: 'trans_time',
            key: 'trans_time',
            render: (text: Date) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '金额',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '支付方式',
            dataIndex: 'payment_type',
            key: 'payment_type',
        },
    ];

    // 处理批量替换
    const handleReplace = async () => {
        try {
            setLoading(true);
            await window.mercury.api.batchReplaceTransactions(matchedRecords);
            message.success('替换成功');
            onSuccess();
            onClose();
        } catch (error) {
            message.error('替换失败');
        } finally {
            setLoading(false);
        }
    };

    // 渲染步骤内容
    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <Radio.Group onChange={(e) => setSourceType(e.target.value)} value={sourceType}>
                        {sourceTypes.map(type => (
                            <Radio key={type.value} value={type.value}>{type.label}</Radio>
                        ))}
                    </Radio.Group>
                );
            case 1:
                return (
                    <Upload
                        fileList={fileList}
                        beforeUpload={handleFileUpload}
                        onChange={({ fileList }) => setFileList(fileList)}
                        accept=".csv"
                    >
                        <Button icon={<UploadOutlined />}>选择CSV文件</Button>
                    </Upload>
                );
            case 2:
                return (
                    <Table
                        columns={columns}
                        dataSource={matchedRecords}
                        rowKey="id"
                        scroll={{ y: 400 }}
                        pagination={false}
                    />
                );
            default:
                return null;
        }
    };
    const steps = [
        {
            title: '选择来源',
            content: <Radio.Group onChange={(e) => setSourceType(e.target.value)} value={sourceType}>
                {sourceTypes.map(type => (
                    <Radio key={type.value} value={type.value}>{type.label}</Radio>
                ))}
            </Radio.Group>
        },
        {
            title: '上传文件',
            content: <Upload
                fileList={fileList}
                beforeUpload={handleFileUpload}
                onChange={({ fileList }) => setFileList(fileList)}
                accept=".csv"
            >
                <Button icon={<UploadOutlined />}>选择CSV文件</Button>
            </Upload>
        },
        {
            title: '确认替换',
            content: <Button
                type="primary"
                loading={loading}
                onClick={handleReplace}
            >
                确认替换
            </Button>
        }
    ];

    return (
        <Modal
            title="批量替换交易"
            open={visible}
            onCancel={onClose}
            width={800}
            footer={[
                <Button key="back" onClick={onClose}>
                    取消
                </Button>,
                currentStep > 0 && (
                    <Button key="prev" onClick={() => setCurrentStep(currentStep - 1)}>
                        上一步
                    </Button>
                ),
                currentStep < 2 ? (
                    <Button
                        key="next"
                        type="primary"
                        disabled={currentStep === 0 && !sourceType || currentStep === 1 && fileList.length === 0}
                        onClick={() => setCurrentStep(currentStep + 1)}
                    >
                        下一步
                    </Button>
                ) : (
                    <Button
                        key="submit"
                        type="primary"
                        loading={loading}
                        onClick={handleReplace}
                    >
                        确认替换
                    </Button>
                ),
            ]}
        >
            <Steps current={currentStep} className="mb-4" steps={steps}>
                <Step title="选择来源" />
                <Step title="上传文件" />
                <Step title="确认替换" />
            </Steps>
            {renderStepContent()}
        </Modal>
    );
}

export default BatchReplaceDrawer; 