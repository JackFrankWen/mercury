import { Card, Col, Row, Space } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import CategoryTable from './categoryTable'
import { useSelect } from '../../components/useSelect'
import { cpt_const, payment_type } from 'src/UI/const/web'

function TableSection(props: { formValue: any }) {
    const { formValue } = props
    const [consumerVal, ConsumerCpt] = useSelect({
        options: cpt_const.consumer_type,
        placeholder: '消费者',
    })

    const [accountTypeVal, accountTypeCpt] = useSelect({
        options: cpt_const.account_type,
        placeholder: '账号',
        style: {
            width: '120px',
        }
    })
    const [paymentVal, PaymentCpt] = useSelect({
        options: cpt_const.payment_type,
        placeholder: '支付方式',

    })

    const [category, setCategory] = useState<any>([])

    const getCategory = async (data: any) => {
        const { trans_time } = formValue
        const start_date = trans_time?.[0]?.format('YYYY-MM-DD 00:00:00')
        const end_date = trans_time?.[1]?.format('YYYY-MM-DD 23:59:59')
        console.log(start_date, end_date, 'start_date, end_date');
        try {
            const result = await window.mercury.api.getCategoryTotalByDate({
                ...data,
                trans_time: [start_date, end_date],
            })
            console.log(result, 'result')

            setCategory(result)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        console.log('====aa');

        getCategory({
            ...formValue,
            consumer: consumerVal,
            account_type: accountTypeVal,
            payment_type: paymentVal,
        })
    }, [
        formValue,
        consumerVal,
        accountTypeVal,
        paymentVal,
    ])
    const extra = (
        <>
            <Space>
                {accountTypeCpt}
                {ConsumerCpt}
                {PaymentCpt}
            </Space>
        </>
    )
    const refreshTable = useCallback(() => {
        getCategory({
            ...formValue,
            consumer: consumerVal,
            account_type: accountTypeVal,
            payment_type: paymentVal,
        })
    }, [formValue, consumerVal])
    return (
        <Card hoverable title="分类" bordered={false} extra={extra}>
            <CategoryTable
                refreshTable={refreshTable}
                data={category}
                formValue={{
                    ...formValue,
                    consumer: consumerVal,
                    account_type: accountTypeVal,
                    payment_type: paymentVal,
                }}
            />
        </Card>
    )
}
export default TableSection