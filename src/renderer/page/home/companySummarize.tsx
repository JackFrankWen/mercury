import { Card, Row } from 'antd';
import React from 'react';
import { formatMoneyObj } from 'src/renderer/components/utils';
import StatisticReser from 'src/renderer/components/StatisticReser';
import { EXPENSE_COLOR, INCOME_COLOR } from 'src/renderer/const/colors';

interface StaticData {
    income: number; // 公司当期收入
    cost: number; // 公司当期支出
    balance: number; // 当期结余
    incomeTotal: number; // 公司总收入
    costTotal: number; // 公司总支出
    balanceTotal: number; // 总结余
}

interface CompanySummarizeProps {
    formValue: any;
    data: StaticData;
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
            <Card size="small">
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