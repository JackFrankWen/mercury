import React, { useState } from 'react';
import { Col, Typography, Row, theme, Modal, DatePicker, Radio } from 'antd';
import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { FormData } from '../useReviewForm';

interface DateSelectorProps {
  value: FormData;
  onChange: (val: FormData) => void;
}

/**
 * 日期选择器组件
 * 支持年度和月度视图切换，以及前后翻页
 */
function DateSelector({ value, onChange }: DateSelectorProps): JSX.Element {
  const [modalVisible, setModalVisible] = useState(false);
  const { token } = theme.useToken();
  const viewType = value.type;

  /**
   * 更新日期（向前或向后）
   */
  const updateDate = (direction: 'left' | 'right') => {
    const operation = direction === 'left' ? 'subtract' : 'add';
    const unit = viewType === 'year' ? 'year' : 'month';
    const dateFormat = viewType === 'year' ? 'YYYY' : 'YYYY-MM';

    const date = dayjs(value.date)[operation](1, unit).format(dateFormat);
    const startTime = dayjs(value.trans_time[0])
      [operation](1, unit)
      .startOf(unit)
      .format('YYYY-MM-DD HH:mm:ss');
    const endTime = dayjs(value.trans_time[1])
      [operation](1, unit)
      .endOf(unit)
      .format('YYYY-MM-DD HH:mm:ss');

    onChange({
      ...value,
      date,
      trans_time: [startTime, endTime],
      type: viewType,
    });
  };

  /**
   * 处理日期选择变化
   */
  const handleDateChange = (val: Dayjs, viewType: 'year' | 'month') => {
    const unit = viewType;
    const dateFormat = viewType === 'year' ? 'YYYY' : 'YYYY-MM';

    onChange({
      ...value,
      date: val.format(dateFormat),
      trans_time: [
        val.startOf(unit).format('YYYY-MM-DD HH:mm:ss'),
        val.endOf(unit).format('YYYY-MM-DD HH:mm:ss'),
      ],
      type: viewType,
    });
  };

  /**
   * 处理视图类型切换（年/月）
   */
  const handleViewTypeChange = (type: 'year' | 'month') => {
    if (type !== value.type) {
      const currentDate = dayjs(value.date);
      handleDateChange(currentDate, type);
    }
  };

  /**
   * 格式化显示文本
   */
  const getDisplayText = () => {
    return viewType === 'year'
      ? `${value.date}年`
      : `${dayjs(value.date).format('YYYY年M月')}`;
  };

  return (
    <Row align="middle">
      <Col span={4} style={{ textAlign: 'left' }}>
        <LeftCircleFilled
          style={{
            fontSize: 20,
            color: token.colorPrimary,
            cursor: 'pointer',
          }}
          onClick={() => updateDate('left')}
        />
      </Col>
      <Col
        className="date-picker-col"
        flex="auto"
        style={{
          padding: '4px 0',
          textAlign: 'center',
        }}
        onClick={() => setModalVisible(true)}
      >
        <Typography.Text>{getDisplayText()}</Typography.Text>
      </Col>
      <Col span={4} style={{ textAlign: 'right' }}>
        <RightCircleFilled
          style={{
            fontSize: 20,
            cursor: 'pointer',
            color: token.colorPrimary,
          }}
          onClick={() => updateDate('right')}
        />
      </Col>

      {modalVisible && (
        <Modal
          title={viewType === 'year' ? '选择年份' : '选择月份'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <Radio.Group
            value={value.type}
            onChange={e => handleViewTypeChange(e.target.value)}
          >
            <Radio.Button value="year">年视图</Radio.Button>
            <Radio.Button value="month">月视图</Radio.Button>
          </Radio.Group>
          <DatePicker
            value={dayjs(value.date)}
            onChange={val => handleDateChange(val, viewType)}
            picker={viewType}
            style={{ marginTop: 16, width: '100%' }}
          />
        </Modal>
      )}
    </Row>
  );
}

export default DateSelector;
