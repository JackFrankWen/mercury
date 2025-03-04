import { Card, Col, Row, Space } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import CategoryTable from './categoryTable'
import { useSelect } from '../../components/useSelect'
import { cpt_const, payment_type } from 'src/renderer/const/web'
import DonutChart from 'src/renderer/components/donutChart'
import { CategoryReturnType } from 'src/preload/index'

// 写一个方法  CategoryReturnType中 child 每一条数据    转化成 PieChart 的 data 用reduce  
// 转化 {value: item.child.value, name: item.child.name, type: item.    value}

function convertCategoryReturnTypeToPieChartData(category: CategoryReturnType) {
    return category.reduce((acc: any, item: any) => {
        item.child.forEach((child: any) => {
            acc.push({
                value: Number(child.value),
                name: child.name,
                type: item.name,
            })
        })  
        return acc
    }, [])
}
function TableSection(props: { formValue: any }) {
    const { formValue } = props
    const [consumerVal, ConsumerCpt] = useSelect({
        options: cpt_const.consumer_type,
        placeholder: '消费者',
    })

    const [accountTypeVal, accountTypeCpt] = useSelect({
        options: cpt_const.account_type,
        placeholder: '账户类型',
        
    })
    const [paymentVal, PaymentCpt] = useSelect({
        options: cpt_const.payment_type,
        placeholder: '支付方式',

    })

    const [category, setCategory] = useState<CategoryReturnType>([])

    const getCategory = async (data: any) => {
        const { trans_time } = formValue
       
        try {
            const result = await window.mercury.api.getCategoryTotalByDate({
                ...data,
                trans_time, 
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
            
            <div className="">
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
            </div>
            <DonutChart data={convertCategoryReturnTypeToPieChartData(category)} />
        </Card>
    )
}
export default TableSection