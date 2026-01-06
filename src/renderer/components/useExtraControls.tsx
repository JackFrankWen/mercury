import { useMemo } from 'react';
import { useSelect } from './useSelect';
import { useRadio } from './useRadio';
import { cpt_const } from '../const/web';

export function useExtraControls() {
    const [accountTypeVal, AccountTypeCpt] = useSelect({
        options: cpt_const.account_type,
        placeholder: '账户类型',
        style: { minWidth: 100 },
        mode: 'multiple',
    });

    const [consumerVal, ConsumerCpt] = useSelect({
        options: cpt_const.consumer_type,
        placeholder: '消费者',
        style: { minWidth: 100 },
        mode: 'multiple'
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

    return {
        accountTypeVal,
        AccountTypeCpt,
        consumerVal,
        ConsumerCpt,
        paymentTypeVal,
        PaymentTypeCpt,
        tagVal,
        TagCpt,
        flowTypeVal,
        FlowTypeCpt,
        hasSearchInModal,
    };
}

export default useExtraControls;
