import { Card, Row } from 'antd';
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
        <>
            <Card size="small" hoverable>
                <Row className="home-section" justify="space-between" gutter={12}>
                    <StatisticReser
                        title="公司账户（收入至今）"
                        prefix="¥"
                        value={formatMoneyObj({
                            amount: data.incomeTotal,
                            decimalPlaces: 0,
                        })}
                        valueStyle={{ color: INCOME_COLOR }}
                    />
                    <StatisticReser
                        title="公司账户（支出至今）"
                        prefix="¥"
                        value={formatMoneyObj({
                            amount: data.costTotal,
                            decimalPlaces: 0,
                        })}
                        valueStyle={{ color: EXPENSE_COLOR }}
                    />
                    <StatisticReser
                        title="结余"
                        prefix="¥"
                        value={formatMoneyObj({
                            amount: data.balanceTotal,
                            decimalPlaces: 0,
                        })}
                    />
                    <StatisticReser
                        // 显示2020年 收入 或者 2020年8月收入   
                        title={getYearTitle('收入')}
                        prefix="¥"
                        value={formatMoneyObj({
                            amount: data.income,
                            decimalPlaces: 0,
                        })}
                        valueStyle={{ color: INCOME_COLOR }}
                    />
                    <StatisticReser
                        title={getYearTitle('支出')}
                        prefix="¥"
                        value={formatMoneyObj({
                            amount: data.cost,
                            decimalPlaces: 0,
                        })}
                        valueStyle={{ color: EXPENSE_COLOR }}
                    />
                    <StatisticReser
                        title={getYearTitle('结余')}
                        prefix="¥"
                        value={formatMoneyObj({
                            amount: data.balance,
                            decimalPlaces: 0,
                        })}

                    />
                </Row>
            </Card>
        </>
    );
}