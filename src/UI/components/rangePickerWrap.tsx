import { Space, DatePicker, Statistic } from 'antd'
import React, { useEffect, useState } from 'react'
const { RangePicker } = DatePicker

import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

// 加载所需插件
dayjs.extend(advancedFormat)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
function getFirstDayAndLastDay(month: number, type: 'year' | 'month') {
    const now = dayjs() // 获取当前日期时间

    const lastYear = now.subtract(month, 'year') // 回到一年前
    const firstDayOfLastYear = lastYear.startOf('year') // 获取上一年的第一天
    const lastDayOfLastYear = lastYear.endOf('year') // 获取上一年的最后一天

    const firstDateOfLastMonth = now.subtract(month, 'months').startOf('month') // 上个月的第一天
    const lastDayOfLastMonth = now.subtract(month, 'months').endOf('month') // 上个月的最后一天
    if (type === 'month') {
        return [firstDateOfLastMonth, lastDayOfLastMonth]
    }
    return [firstDayOfLastYear, lastDayOfLastYear]
}
const RangePickerWrap = (props: {
    placeholder?: string
    bordered?: boolean
    onChange?: (a: any) => void
    value?: any
}) => {
    const { bordered = false, onChange, value, placeholder } = props

    const [date, setDate] = useState<any>(value)
    const [open, setOpen] = useState<boolean>(false)
    const setClickDate = (val: any) => {
        setDate(val)
        setOpen(false)
        if (onChange) onChange(val)
    }
    const renderExtraFooter = () => {
        const curMonth = getFirstDayAndLastDay(0, 'month')
        const lastMonth = getFirstDayAndLastDay(1, 'month')
        const lastTwoMonth = getFirstDayAndLastDay(2, 'month')
        const thisYear = getFirstDayAndLastDay(0, 'year')
        const lastYear = getFirstDayAndLastDay(1, 'year')
        const lastTwoyear = getFirstDayAndLastDay(2, 'year')
        return (
            <Space>
                <a onClick={() => setClickDate(curMonth)}>当月</a>
                <a onClick={() => setClickDate(lastMonth)}>上月</a>
                <a onClick={() => setClickDate(lastTwoMonth)}>上上月</a>
                <a onClick={() => setClickDate(thisYear)}>今年</a>
                <a onClick={() => setClickDate(lastYear)}>去年</a>
                <a onClick={() => setClickDate(lastTwoyear)}>前年</a>
            </Space>
        )
    }

    return (
        <RangePicker
            value={date}
            open={open}
            format="YYYY-MM-DD"
            onChange={(dates) => setClickDate(dates)}
            bordered={bordered}
            onOpenChange={(visiable) => setOpen(visiable)}
            renderExtraFooter={renderExtraFooter}
        />
    )
}

export default RangePickerWrap
