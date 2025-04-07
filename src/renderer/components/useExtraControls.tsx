import React, { useMemo, useState } from 'react';
import { Cascader, Space, theme } from 'antd';
import { EllipsisOutlined, FilterFilled } from '@ant-design/icons';
import { DefaultOptionType } from 'antd/es/cascader';
import { useSelect } from './useSelect';
import { cpt_const } from '../const/web';

export function useExtraControls(props: {
    showCategory?: boolean;
    category_type: any[];
    onFilterClick: () => void;
}) {
    const { showCategory = true, category_type, onFilterClick } = props;
    const { token } = theme.useToken();
    const [categoryVal, setCategoryVal] = useState<string[]>([]);

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
            {showCategory && (
                <Cascader
                    options={category_type}
                    allowClear
                    multiple
                    value={categoryVal}
                    style={{ width: '100px' }}
                    onChange={val => setCategoryVal(val as string[])}
                    placeholder="分类"
                    showSearch={{
                        filter: (inputValue: string, path: DefaultOptionType[]) =>
                            path.some(
                                option =>
                                    (option.label as string)
                                        .toLowerCase()
                                        .indexOf(inputValue.toLowerCase()) > -1
                            ),
                    }}
                />
            )}
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
            categoryVal,
            accountTypeVal,
            consumerVal,
            paymentTypeVal,
            tagVal,
            PaymentTypeCpt,
            TagCpt,
        },
    ] as const;
}

export default useExtraControls;
