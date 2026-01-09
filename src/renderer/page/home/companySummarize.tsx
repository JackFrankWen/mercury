import { Card, Row, Flex } from 'antd';
import React from 'react';
import { formatMoneyObj } from 'src/renderer/components/utils';
import StatisticReser from 'src/renderer/components/StatisticReser';
import { EXPENSE_COLOR, INCOME_COLOR } from 'src/renderer/const/colors';
import { CompanySummarizeData } from './types';

interface CompanySummarizeProps {
    formValue: any;
    data: CompanySummarizeData;
    onRefresh?: () => void;
}

export default function CompanySummarize(props: CompanySummarizeProps) {
    const { formValue, data } = props;

    const getYearTitle = (extra: any) => {
        const year = formValue.date.split('-')[0];
        const month = formValue.date.split('-')[1];
        if (month) {
            return `${year}年${month}月${extra}`;
        } else {
            return `${year}年${extra}`;
        }
    }

    return (
        <Card
            size="small"
            hoverable
            title="公司账户汇总"
            className='mb8'
            style={{ padding: '0' }}
        >

            <Flex justify="space-between">
                <StatisticReser
                    title="至今收入"
                    prefix="¥"
                    value={formatMoneyObj({
                        amount: data.incomeTotal,
                        decimalPlaces: 0,
                    })}
                    valueStyle={{
                        color: INCOME_COLOR,
                        fontSize: '14px',
                        fontWeight: 600
                    }}
                />
                <StatisticReser
                    title="至今支出"
                    prefix="¥"
                    value={formatMoneyObj({
                        amount: data.costTotal,
                        decimalPlaces: 0,
                    })}
                    valueStyle={{
                        color: EXPENSE_COLOR,
                        fontSize: '14px',
                        fontWeight: 600
                    }}
                />
                <StatisticReser
                    title="至今结余"
                    prefix="¥"
                    value={formatMoneyObj({
                        amount: data.balanceTotal,
                        decimalPlaces: 0,
                    })}
                    valueStyle={{
                        fontSize: '14px',
                        fontWeight: 600,
                    }}
                />

            </Flex>
            <Flex justify="space-between">
                <StatisticReser
                    title={getYearTitle('收入')}
                    prefix="¥"
                    value={formatMoneyObj({
                        amount: data.income,
                        decimalPlaces: 0,
                    })}
                    valueStyle={{
                        color: INCOME_COLOR,
                        fontSize: '14px',
                        fontWeight: 600
                    }}
                />
                <StatisticReser
                    title={getYearTitle('支出')}
                    prefix="¥"
                    value={formatMoneyObj({
                        amount: data.cost,
                        decimalPlaces: 0,
                    })}
                    valueStyle={{
                        color: EXPENSE_COLOR,
                        fontSize: '14px',
                        fontWeight: 600
                    }}
                />

                <StatisticReser
                    title={getYearTitle('结余')}
                    prefix="¥"
                    value={formatMoneyObj({
                        amount: data.balance,
                        decimalPlaces: 0,
                    })}
                    valueStyle={{
                        fontSize: '14px',
                        fontWeight: 600,
                    }}
                />
            </Flex>
        </Card >
    );
}