import { Card, Col, Divider, Progress, Row, Statistic, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { AccountType, PaymentType } from 'src/renderer/const/web';
import { formatMoney, formatMoneyObj } from 'src/renderer/components/utils';
import { useFresh } from 'src/renderer/components/useFresh';
import StatisticReser from 'src/renderer/components/StatisticReser';

export default function CompanySummarize(
    props: {
        formValue: any,
    }
) {
    return <><Card size='small'>
        <Row className="home-section" justify="space-between" gutter={12}>
            <StatisticReser
                title="公司总收入"
                prefix="¥"
                value={formatMoneyObj({
                    amount: 11,
                    decimalPlaces: 0,
                })}
            />
            <StatisticReser
                title="公司总支出"
                prefix="¥"
                value={formatMoneyObj({
                    amount: 22,
                    decimalPlaces: 0,
                })}
            />
            <StatisticReser
                title="公司账户（收）"
                prefix="+"
                value={formatMoneyObj({
                    amount: 22,
                    decimalPlaces: 0,
                })}
                valueStyle={{ color: '#0f0' }}
            />

            <StatisticReser
                title="公司账户（支）"
                prefix="-"
                value={formatMoneyObj({
                    amount: 33,
                    decimalPlaces: 0,
                })}
                valueStyle={{ color: '#f00' }}
            />
            <StatisticReser
                title="公司账户（结余）"
                prefix="¥"
                value={formatMoneyObj({
                    amount: 33,
                    decimalPlaces: 0,
                })}
                // 颜色
                valueStyle={{ color: '#eccf10' }}
            />
        </Row >
    </Card></>;
}