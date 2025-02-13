import { Button, Row, Space } from 'antd';
import React from 'react';

interface SelectionFooterProps {
    selectedCount: number;
    onCancel: () => void;
    onDelete: () => void;
}

export function SelectionFooter({ selectedCount, onCancel, onDelete }: SelectionFooterProps) {
    return (
        <Row justify='space-between' align='middle' className='table-footer'>
            <div>选择 {selectedCount}个</div>
            <Space>
                <Button onClick={onCancel}>取消</Button>
                <Button danger onClick={onDelete}>批量删除</Button>
                <Button type="primary">批量修改</Button>
            </Space>
        </Row>
    );
} 