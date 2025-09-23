import React from 'react';
import { Statistic, StatisticProps } from 'antd';
import './StatisticReser.css';

interface StatisticReserProps extends StatisticProps {
    /** 是否使用自定义样式 */
    customStyle?: boolean;
    /** 背景颜色 */
    backgroundColor?: string;
    /** 边框颜色 */
    borderColor?: string;
    /** 文字颜色 */
    textColor?: string;
    /** 数值颜色 */
    valueColor?: string;
    /** 是否显示阴影 */
    showShadow?: boolean;
    /** 圆角大小 */
    borderRadius?: number;
    /** 内边距 */
    padding?: string;
    /** 主题类型 */
    theme?: 'default' | 'success' | 'warning' | 'danger';
}

function StatisticReser(props: StatisticReserProps) {
    const {
        customStyle = true,
        backgroundColor = '#ffffff',
        borderColor = 'transparent',
        textColor = '#666666',
        valueColor = '#1890ff',
        showShadow = false,
        borderRadius = 8,
        padding = '16px',
        theme = 'default',
        className,
        ...statisticProps
    } = props;



    const getThemeClassName = () => {
        if (!customStyle) return '';
        switch (theme) {
            case 'success':
                return 'statistic-reser-success';
            case 'warning':
                return 'statistic-reser-warning';
            case 'danger':
                return 'statistic-reser-danger';
            default:
                return '';
        }
    };

    const combinedClassName = [
        'statistic-reser',
        customStyle ? 'statistic-reser-custom' : '',
        getThemeClassName(),
        className || '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={combinedClassName}>
            <Statistic
                {...statisticProps}
                className="statistic-reser-inner"
                style={{
                    ...statisticProps.style,
                }}
            />
        </div>
    );
}

export default StatisticReser;
