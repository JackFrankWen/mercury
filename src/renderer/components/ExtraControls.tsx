import React from 'react';
import { Space, theme } from 'antd';
import { EllipsisOutlined, FilterFilled } from '@ant-design/icons';

interface ExtraControlsProps {
    accountTypeCpt: React.ReactNode;
    consumerCpt: React.ReactNode;
    hasSearchInModal: boolean;
    onFilterClick: () => void;
}

/**
 * 额外控制组件
 * 展示账户类型、消费者选择器和过滤按钮
 */
function ExtraControls({
    accountTypeCpt,
    consumerCpt,
    hasSearchInModal,
    onFilterClick,
}: ExtraControlsProps): JSX.Element {
    const { token } = theme.useToken();

    return (
        <Space>
            {accountTypeCpt}
            {consumerCpt}
            {hasSearchInModal ? (
                <FilterFilled
                    style={{
                        color: token.colorPrimary,
                        fontSize: 16,
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                    }}
                    onClick={onFilterClick}
                />
            ) : (
                <EllipsisOutlined
                    style={{
                        color: '#999',
                        fontSize: 16,
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                    }}
                    onClick={onFilterClick}
                />
            )}
        </Space>
    );
}

export default ExtraControls;

