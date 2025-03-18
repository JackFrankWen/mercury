import React from "react";
import { Calendar, Col, Flex, Radio, Row, Select, Typography } from "antd";
import type { CalendarProps } from "antd";
import dayjs from "dayjs";
import classNames from "classnames";
import { Dayjs } from "dayjs";
import { HolidayUtil, Lunar } from "lunar-typescript";
import { FormData } from "./useReviewForm";
import { formatMoney } from "../../components/utils";

interface LunarCalendarProps {
  className?: string;
  formValue: FormData;
  data: { date: string; total: number }[];
}

const LunarCalendar: React.FC<LunarCalendarProps> = (props) => {
  const { formValue, data } = props;

  const cellRender: CalendarProps<Dayjs>["fullCellRender"] = (date, info) => {
    const d = Lunar.fromDate(date.toDate());
    const lunar = d.getDayInChinese();
    const solarTerm = d.getJieQi();
    const isWeekend = date.day() === 6 || date.day() === 0;
    const h = HolidayUtil.getHoliday(
      date.get("year"),
      date.get("month") + 1,
      date.get("date")
    );
    const displayHoliday =
      h?.getTarget() === h?.getDay() ? h?.getName() : undefined;
    if (info.type === "date") {
      // 如果不是这个月不渲染
      if (date.month() !== dayjs(formValue.date).month()) {
        return <></>
      }
      const total = data.find((item) => item.date === date.format("YYYY-MM-DD"))?.total;
      return React.cloneElement(info.originNode, {
        ...(info.originNode as React.ReactElement<any>).props,
        className: "",
        style: {
          ...(info.originNode as React.ReactElement<any>).props.style,
          background: "transparent",
          border: "none",
        },
        children: (
          <Flex style={{
            marginRight: 4,
          }} justify="start" align="center" vertical className="lunar-calendar-cell">
            {info.type === "date" && <Typography.Text strong>{date.get("date")}</Typography.Text>}
            {info.type === "date" && (
              <Typography.Text type="secondary" style={{fontSize: 12}}>{displayHoliday || solarTerm || lunar}</Typography.Text>
            )}
            {total && (
              <Typography.Text type="success" style={{fontSize: 12}}>-{ formatMoney(total)}</Typography.Text>
            )}
          </Flex>
        ),
      });
    }
    return info.originNode;
  };
  const calData = dayjs(formValue.date);

  return (
    <Calendar
      className={props.className}
      fullCellRender={(a,b)=>cellRender(a,b, data)}
      onPanelChange={undefined}
      onSelect={undefined}
      fullscreen={false}
      value={calData}
      headerRender={() => <></>}
    ></Calendar>
  );
};

export default LunarCalendar;
