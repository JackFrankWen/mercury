import { Card, Row } from 'antd';
import React, { useState } from 'react';
import { formatMoneyObj } from 'src/renderer/components/utils';
import { useFresh } from 'src/renderer/components/useFresh';
import StatisticReser from 'src/renderer/components/StatisticReser';
import { flow_type } from 'src/renderer/const/web';

const COMPANY_ACCOUNT_TYPE = 4; // 公司账户
const FLOW_TYPE_COST = 1; // 支出
const FLOW_TYPE_INCOME = 2; // 收入

export default function CompanySummarize(props: { formValue: any }) {
    const { formValue } = props;
    const [staticData, setStaticData] = useState<any>({
        income: 0, // 公司收入
        cost: 0, // 公司支出
        balance: 0, // 结余
    });

    const getSummarize = async (obj: any) => {
        try {
            // 获取完整的交易数据，包含flow_type信息
            const params = {
                ...obj,
                account_type: COMPANY_ACCOUNT_TYPE, // 只查询公司账户
                flow_type: FLOW_TYPE_COST,
            };
            const res = await window.mercury.api.getAccountTotal(params);
            const resIncome = await window.mercury.api.getAccountTotal({ ...params, flow_type: FLOW_TYPE_INCOME });
            console.log(resIncome, 'resIncome');
            console.log(res, 'res');

            // 计算公司收入 (account_type = 4 && flow_type = 2)
            const companyIncome = resIncome.reduce((acc: number, item: any) => {
                if (
                    Number(item.account_type) === COMPANY_ACCOUNT_TYPE
                ) {
                    acc += Math.floor(Number(item.total));
                }
                return acc;
            }, 0);

            // 计算公司支出 (account_type = 4 && flow_type = 1)
            const companyCost = res.reduce((acc: number, item: any) => {
                if (
                    Number(item.account_type) === COMPANY_ACCOUNT_TYPE
                ) {
                    acc += Math.floor(Number(item.total));
                }
                return acc;
            }, 0);
            console.log(companyIncome, 'companyIncome');
            console.log(companyCost, 'companyCost');

            setStaticData({
                income: companyIncome,
                cost: companyCost,
                balance: companyIncome - companyCost,
            });
        } catch (error) {
            console.log(error);
        }
    };

    useFresh(
        () => {
            getSummarize(formValue);
        },
        [formValue],
        'transaction'
    );

    return (
        <>
            <Card size="small">
                <Row className="home-section" justify="space-between" gutter={12}>
                    <StatisticReser
                        title="公司账户（收）"
                        prefix="¥"
                        value={formatMoneyObj({
                            amount: staticData.income,
                            decimalPlaces: 0,
                        })}
                        valueStyle={{ color: '#0f0' }}
                    />

                    <StatisticReser
                        title="公司账户（支）"
                        prefix="¥"
                        value={formatMoneyObj({
                            amount: staticData.cost,
                            decimalPlaces: 0,
                        })}
                        valueStyle={{ color: '#f00' }}
                    />
                    <StatisticReser
                        title="公司账户（结余）"
                        prefix="¥"
                        value={formatMoneyObj({
                            amount: staticData.balance,
                            decimalPlaces: 0,
                        })}
                        // 根据结余正负设置颜色
                        valueStyle={{ color: staticData.balance >= 0 ? '#0f0' : '#f00' }}
                    />
                </Row>
            </Card>
        </>
    );
}