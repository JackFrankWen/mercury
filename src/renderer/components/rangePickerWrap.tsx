import { Space, DatePicker, Statistic } from "antd";
import React, { useEffect, useState } from "react";
const { RangePicker } = DatePicker;

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

// 加载所需插件
dayjs.extend(advancedFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
function getFirstDayAndLastDay(month: number, type: "year" | "month" | "quarter") {
  const now = dayjs(); // 获取当前日期时间

  const lastYear = now.subtract(month, "year"); // 回到一年前
  const firstDayOfLastYear = lastYear.startOf("year"); // 获取上一年的第一天
  const lastDayOfLastYear = lastYear.endOf("year"); // 获取上一年的最后一天

  const firstDateOfLastMonth = now.subtract(month, "months").startOf("month"); // 上个月的第一天
  const lastDayOfLastMonth = now.subtract(month, "months").endOf("month"); // 上个月的最后一天
  if (type === "month") {
    return [firstDateOfLastMonth, lastDayOfLastMonth];
  }

  return [firstDayOfLastYear, lastDayOfLastYear];
}
// 获取季度第一天和最后一天 入参 几个季度 0是当前季度 1是上季度 2是上上季度
// 例如: 当前是2023Q4, 传入1返回2023Q3的起止时间, 传入2返回2023Q2的起止时间
function getFirstDayAndLastDayOfQuarter(quarter: number) {
  const now = dayjs();
  const currentQuarter = Math.floor(now.month() / 3);
  const targetQuarter = currentQuarter - quarter;
  const targetYear = now.year() + Math.floor(targetQuarter / 4);
  const finalQuarter = ((targetQuarter % 4) + 4) % 4;

  const firstMonth = finalQuarter * 3;
  // Get first day of the quarter
  const firstDayOfQuarter = dayjs().year(targetYear).month(firstMonth).startOf("month");
  // Get last day of the quarter (end of the last month in the quarter)
  const lastDayOfQuarter = dayjs()
    .year(targetYear)
    .month(firstMonth + 2)
    .endOf("month");

  return [firstDayOfQuarter, lastDayOfQuarter];
}
// 获取过去10年的第一天和 今年最后一天
function getFirstDayAndLastDayOfLastTenYear() {
  const now = dayjs();
  const lastTenYear = now.subtract(10, "year");
  const firstDayOfLastTenYear = lastTenYear.startOf("year");
  const lastDayOfLastTenYear = now.endOf("year");
  return [firstDayOfLastTenYear, lastDayOfLastTenYear];
}
const RangePickerWrap = (props: {
  placeholder?: string;
  bordered?: boolean;
  onChange?: (a: any) => void;
  value?: any;
  type?: "month" | "year" | "quarter" | "date";
}) => {
  const { bordered = false, onChange, value, placeholder, type = "month" } = props;

  const [date, setDate] = useState<any>(value);
  const [open, setOpen] = useState<boolean>(false);
  const setClickDate = (val: any) => {
    console.log(val,'val=ooooooo===');
    if (val && val.length === 2) {
      const newVal = val.map((item: any, index: number) => {
        if (type === 'date') {
          return item;
        } 
        if (index === 0) {
          return item.startOf("month");
        } else {
          return item.endOf("month");
        }
      });
      setDate(newVal);
      setOpen(false);
      if (onChange) onChange(newVal);
    } else {
      setDate(val);
      setOpen(false);
      if (onChange) onChange(val);
    }
  };
  const renderExtraFooter = () => {
    const curMonth = getFirstDayAndLastDay(0, "month");
    const lastMonth = getFirstDayAndLastDay(1, "month");
    const lastTwoMonth = getFirstDayAndLastDay(2, "month");
    const thisYear = getFirstDayAndLastDay(0, "year");
    const lastYear = getFirstDayAndLastDay(1, "year");
    const lastTwoyear = getFirstDayAndLastDay(2, "year");
    // 当前季度
    const curQuarter = getFirstDayAndLastDayOfQuarter(0);
    const lastQuarter = getFirstDayAndLastDayOfQuarter(1);
    const lastTwoQuarter = getFirstDayAndLastDayOfQuarter(2);
    // 过去10年
    const lastTenYear = getFirstDayAndLastDayOfLastTenYear();
    return (
      <Space>
        <a onClick={() => setClickDate(curMonth)}>当月</a>
        <a onClick={() => setClickDate(lastMonth)}>上月</a>
        <a onClick={() => setClickDate(lastTwoMonth)}>上上月</a>
        <a onClick={() => setClickDate(thisYear)}>今年</a>
        <a onClick={() => setClickDate(lastYear)}>去年</a>
        <a onClick={() => setClickDate(lastTwoyear)}>前年</a>
        <a onClick={() => setClickDate(curQuarter)}>当前季度</a>
        <a onClick={() => setClickDate(lastQuarter)}>上季度</a>
        <a onClick={() => setClickDate(lastTwoQuarter)}>上上季度</a>
        <a onClick={() => setClickDate(lastTenYear)}>过去10年</a>
      </Space>
    );
  };
  // no icon
  return (
    <RangePicker
      value={date}
      open={open}
      picker={type}
      format="YYYY-MM-DD"
      onChange={(dates) => setClickDate(dates)}
      bordered={bordered}
      onOpenChange={(visiable) => setOpen(visiable)}
      renderExtraFooter={renderExtraFooter}
      suffixIcon={null}
    />
  );
};

export default RangePickerWrap;
