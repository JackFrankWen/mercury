import React from 'react';
import { Breadcrumb, Button, Row, Space, Tooltip } from 'antd';
import { SwapOutlined, PlusOutlined } from '@ant-design/icons';
import AdvancedNewBtn from 'src/renderer/components/advancedNewBtn';

interface TableHeaderProps {
  onAddClick: () => void;
  onBatchReplaceClick: () => void;
}

export function TableHeader({ onAddClick, onBatchReplaceClick }: TableHeaderProps): JSX.Element {
  return (
    <Row justify={'space-between'}>
      <Breadcrumb items={[{ title: '交易表格' }]} />
      <Space>
        <Button
          type="primary"
          icon={<SwapOutlined />}
          shape="round"
          style={{
            background: '#faad14',
            boxShadow: '0 2px 6px rgba(250, 173, 20, 0.3)'
          }}
          onClick={onBatchReplaceClick}
        >
          快速分类
        </Button>
        <AdvancedNewBtn />
        <Tooltip title="新增交易">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            shape="round"
            style={{
              background: '#000',
              boxShadow: '0 2px 6px rgba(82, 196, 26, 0.3)',
            }}
            onClick={onAddClick}
          >
            交易
          </Button>
        </Tooltip>
      </Space>
    </Row>
  );
}

