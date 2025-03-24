import React, { useState } from 'react';
import { Calendar, Flex, Modal, Typography, message } from 'antd';
import type { CalendarProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import classNames from 'classnames';
import { HolidayUtil, Lunar } from 'lunar-typescript';
import { FormData } from './useReviewForm';
import { formatMoney } from '../../components/utils';
import { ModalContent } from './ModalContent';
import { I_Transaction } from 'src/main/sqlite3/transactions';

interface LunarCalendarProps {
  className?: string;
  formValue: FormData & {
    consumer: number;
    account_type: number;
    payment_type: number;
  };
  data: { date: string; total: number }[];
  refresh: () => void;
}

const LunarCalendar: React.FC<LunarCalendarProps> = (props) => {
  const { formValue, data, refresh } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [modalData, setModalData] = useState<I_Transaction[]>([]);
  const openModal = async (data: string) => {
    try {
      const res = await window.mercury.api.getTransactions({
        ...formValue,
        trans_time: [`${data} 00:00:00`, `${data} 23:59:59`],
        flow_type: '1',
      });
      setModalData(res);
      setVisible(true);
    } catch (error) {
      message.error(error);
    }
  };
  const cellRender = (date, info, fullData) => {
    const d = Lunar.fromDate(date.toDate());
    const lunar = d.getDayInChinese();
    const solarTerm = d.getJieQi();
    const isWeekend = date.day() === 6 || date.day() === 0;
    const h = HolidayUtil.getHoliday(
      date.get('year'),
      date.get('month') + 1,
      date.get('date'),
    );
    const displayHoliday =
      h?.getTarget() === h?.getDay() ? h?.getName() : undefined;
    if (info.type === 'date') {
      // 如果不是这个月不渲染
      if (date.month() !== dayjs(formValue.date).month()) {
        return <></>;
      }
      const total = fullData.find(
        (item) => item.date === date.format('YYYY-MM-DD'),
      )?.total;
      return React.cloneElement(info.originNode, {
        ...(info.originNode as React.ReactElement<any>).props,
        className: '',
        style: {
          ...(info.originNode as React.ReactElement<any>).props.style,
          background: 'transparent',
          border: 'none',
        },
        children: (
          <Flex
            style={{
              marginRight: 4,
            }}
            justify="start"
            align="center"
            vertical
            onClick={() => {
              openModal(date.format('YYYY-MM-DD'));
            }}
            className="lunar-calendar-cell"
          >
            {info.type === 'date' && (
              <Typography.Text strong>{date.get('date')}</Typography.Text>
            )}
            {info.type === 'date' && (
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {displayHoliday || solarTerm || lunar}
              </Typography.Text>
            )}
            <Typography.Text
              type={total ? 'danger' : 'secondary'}
              style={{
                fontSize: 12,
              }}
            >
              {total ? `-${formatMoney(total)}` : '0'}
            </Typography.Text>
          </Flex>
        ),
      });
    }
    return info.originNode;
  };
  const calData = dayjs(formValue.date);

  return (
    <>
      <Calendar
        className={props.className}
        fullCellRender={(a, b) => cellRender(a, b, data)}
        onPanelChange={undefined}
        onSelect={undefined}
        fullscreen={false}
        value={calData}
        headerRender={() => <></>}
      ></Calendar>
      {visible && (
        <Modal
          width={1000}
          closable={true}
          footer={null}
          open={visible}
          onCancel={() => setVisible(false)}
          title="交易详情"
        >
          <ModalContent modalData={modalData} withCategory refresh={refresh} />
        </Modal>
      )}
    </>
  );
};

export default LunarCalendar;
