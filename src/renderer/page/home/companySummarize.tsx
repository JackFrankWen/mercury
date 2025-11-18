import { Card, Row } from 'antd';
import React, { useState } from 'react';
import { formatMoneyObj } from 'src/renderer/components/utils';
import { useFresh } from 'src/renderer/components/useFresh';
import StatisticReser from 'src/renderer/components/StatisticReser';
import { EXPENSE_COLOR, INCOME_COLOR } from 'src/renderer/const/colors';

const COMPANY_ACCOUNT_TYPE = 4; // 公司账户
const FLOW_TYPE_COST = 1; // 支出
const FLOW_TYPE_INCOME = 2; // 收入

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
}

export default function CompanySummarize(props: CompanySummarizeProps) {
    const { formValue } = props;
    const [staticData, setStaticData] = useState<StaticData>({
        income: 0,
        cost: 0,
        balance: 0,
        incomeTotal: 0,
        costTotal: 0,
        balanceTotal: 0,
    });

    const getSummarize = async (obj: any) => {
        try {
            // 基础查询参数
            const baseParams = {
                ...obj,
                account_type: COMPANY_ACCOUNT_TYPE, // 只查询公司账户
            };

            // 并行获取当期和总计数据
            const [currentCostRes, currentIncomeRes, totalCostRes, totalIncomeRes] = await Promise.all([
                // 当期支出
                window.mercury.api.getAccountTotal({
                    ...baseParams,
                    flow_type: FLOW_TYPE_COST,
                }),
                // 当期收入
                window.mercury.api.getAccountTotal({
                    ...baseParams,
                    flow_type: FLOW_TYPE_INCOME,
                }),
                // 总支出 (从2020年开始到2099年)
                window.mercury.api.getAccountTotal({
                    ...baseParams,
                    flow_type: FLOW_TYPE_COST,
                    trans_time: ['2020-01-01', '2099-01-01'],
                }),
                // 总收入 (从2020年开始到2099年)
                window.mercury.api.getAccountTotal({
                    ...baseParams,
                    flow_type: FLOW_TYPE_INCOME,
                    trans_time: ['2020-01-01', '2099-01-01'],
                }),
            ]);

            // 通用计算函数
            const calculateTotal = (data: any[], accountType: number): number => {
                if (!Array.isArray(data)) {
                    console.warn('数据格式不正确，期望数组格式');
                    return 0;
                }

                return data.reduce((acc: number, item: any) => {
                    if (
                        !item ||
                        typeof item.account_type === 'undefined' ||
                        typeof item.total === 'undefined'
                    ) {
                        return acc;
                    }

                    if (Number(item.account_type) === accountType) {
                        const total = Number(item.total) || 0;
                        acc += Math.floor(total);
                    }
                    return acc;
                }, 0);
            };

            // 计算各项数据
            const currentIncome = calculateTotal(currentIncomeRes, COMPANY_ACCOUNT_TYPE);
            const currentCost = calculateTotal(currentCostRes, COMPANY_ACCOUNT_TYPE);
            const totalIncome = calculateTotal(totalIncomeRes, COMPANY_ACCOUNT_TYPE);
            const totalCost = calculateTotal(totalCostRes, COMPANY_ACCOUNT_TYPE);

            console.log('当期数据:', { currentIncome, currentCost });
            console.log('总计数据:', { totalIncome, totalCost });

            setStaticData({
                income: currentIncome,
                cost: currentCost,
                balance: currentIncome - currentCost,
                incomeTotal: totalIncome,
                costTotal: totalCost,
                balanceTotal: totalIncome - totalCost,
            });
        } catch (error) {
            console.error('获取公司汇总数据失败:', error);
            // 保持原有数据不变，避免界面闪烁
        }
    };

    useFresh(
        () => {
            getSummarize(formValue);
        },
        [formValue],
        'transaction'
    );

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
                            amount: staticData.incomeTotal,
                            decimalPlaces: 0,
                        })}
                        valueStyle={{ color: INCOME_COLOR }}
                    />
                    <StatisticReser
                        title="公司账户（支出至今）"
                        prefix="¥"
                        value={formatMoneyObj({
                            amount: staticData.costTotal,
                            decimalPlaces: 0,
                        })}
                        valueStyle={{ color: EXPENSE_COLOR }}
                    />
                    <StatisticReser
                        title="结余"
                        prefix="¥"
                        value={formatMoneyObj({
                            amount: staticData.balanceTotal,
                            decimalPlaces: 0,
                        })}
                    />
                    <StatisticReser
                        // 显示2020年 收入 或者 2020年8月收入   
                        title={getYearTitle('收入')}
                        prefix="¥"
                        value={formatMoneyObj({
                            amount: staticData.income,
                            decimalPlaces: 0,
                        })}
                        valueStyle={{ color: INCOME_COLOR }}
                    />
                    <StatisticReser
                        title={getYearTitle('支出')}
                        prefix="¥"
                        value={formatMoneyObj({
                            amount: staticData.cost,
                            decimalPlaces: 0,
                        })}
                        valueStyle={{ color: EXPENSE_COLOR }}
                    />
                    <StatisticReser
                        title={getYearTitle('结余')}
                        prefix="¥"
                        value={formatMoneyObj({
                            amount: staticData.balance,
                            decimalPlaces: 0,
                        })}

                    />
                </Row>
            </Card>
        </>
    );
}