import React from "react";
import { Calendar, Col, Radio, Row, Select } from "antd";
import type { CalendarProps } from "antd";
import dayjs from "dayjs";
import classNames from "classnames";
import { Dayjs } from "dayjs";
import { HolidayUtil, Lunar } from "lunar-typescript";
import { FormData } from "./useReviewForm";

interface LunarCalendarProps {
  className?: string;
  data: FormData;
}

const LunarCalendar: React.FC<LunarCalendarProps> = (props) => {
  const { data } = props;

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
      return React.cloneElement(info.originNode, {
        ...(info.originNode as React.ReactElement<any>).props,
        className: "",
        style: {
          ...(info.originNode as React.ReactElement<any>).props.style,
          background: "transparent",
          border: "none",
        },
        children: (
          <div>
            <span>{date.get("date")}</span>
            {info.type === "date" && (
              <div>{displayHoliday || solarTerm || lunar}</div>
            )}
          </div>
        ),
      });
    }

    if (info.type === "month") {
      // Due to the fact that a solar month is part of the lunar month X and part of the lunar month X+1,
      // when rendering a month, always take X as the lunar month of the month
      const d2 = Lunar.fromDate(new Date(date.get("year"), date.get("month")));
      const month = d2.getMonthInChinese();
      return (
        <div>
          {date.get("month") + 1}月（{month}月）
        </div>
      );
    }
  };
  const calData = dayjs(data.date);

  return (
    <Calendar
      className={props.className}
      fullCellRender={cellRender}
      fullscreen={false}
      value={calData}
      headerRender={() => null}
    ></Calendar>
  );
};

export default LunarCalendar;
