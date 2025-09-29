import React, { useMemo, useState } from 'react';
import { Cascader, Space, theme } from 'antd';
import { EllipsisOutlined, FilterFilled } from '@ant-design/icons';
import { DefaultOptionType } from 'antd/es/cascader';
import { useSelect } from './useSelect';
import { useRadio } from './useRadio';
import { cpt_const } from '../const/web';

export function useExtraControls(props: {
    onFilterClick: () => void;
}) {
    const { onFilterClick } = props;
    const { token } = theme.useToken();

    const [accountTypeVal, AccountTypeCpt] = useSelect({
        options: cpt_const.account_type,
        placeholder: '账户类型',
    });

    const [consumerVal, ConsumerCpt] = useSelect({
        options: cpt_const.consumer_type,
        placeholder: '消费者',
    });

    const [paymentTypeVal, PaymentTypeCpt] = useSelect({
        options: cpt_const.payment_type,
        placeholder: '支付方式',
    });
    const [flowTypeVal, FlowTypeCpt] = useRadio({
        defaultValue: 1,
        options: cpt_const.flow_type,
    });

    const [tagVal, TagCpt] = useSelect({
        options: cpt_const.tag_type,
        placeholder: '标签',
    });

    const hasSearchInModal = useMemo(() => {
        if (!paymentTypeVal && !tagVal) {
            return false;
        }
        return true;
    }, [paymentTypeVal, tagVal]);

    const extraComponent = (
        <Space>

            {AccountTypeCpt}
            {ConsumerCpt}
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

    return [
        extraComponent,
        {
            accountTypeVal,
            consumerVal,
            paymentTypeVal,
            tagVal,
            PaymentTypeCpt,
            FlowTypeCpt,
            flowTypeVal,
            TagCpt,
        },
    ] as const;
}

export default useExtraControls;
