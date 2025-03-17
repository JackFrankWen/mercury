import React, { useState } from 'react'
import { Col, Typography, Row, theme, Modal, DatePicker } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons'
import { Radio } from 'antd/lib'

// Define proper interfaces for better type safety
interface FormData {
  date: string;
  trans_time: string[];
  type: 'year' | 'month';
}

const useReviewForm = (): [FormData, React.ReactNode] => {
  const now = dayjs()
  const lastYear = now.subtract(1, 'year').format('YYYY')

  const [formData, setFormData] = useState<FormData>({
    date: lastYear,
    trans_time: [lastYear + '-01-01 00:00:00', lastYear + '-12-31 23:59:59'],
    type: 'year'
  })

  const cpt = (
    <IconDate value={formData} onChange={(val) => {
      setFormData(val)
    }} />
  )
  return [formData, cpt]
}

interface IconDateProps {
  value: FormData;
  onChange: (val: FormData) => void;
}

const IconDate = (props: IconDateProps) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [viewType, setViewType] = useState<'year' | 'month'>(props.value.type)
  
  // Helper function to update dates based on direction and view type
  const updateDate = (direction: 'left' | 'right') => {
    const { value } = props
    const operation = direction === 'left' ? 'subtract' : 'add'
    const unit = viewType === 'year' ? 'year' : 'month'
    const dateFormat = viewType === 'year' ? 'YYYY' : 'YYYY-MM'
    
    const date = dayjs(value.date)[operation](1, unit).format(dateFormat)
    const startTime = dayjs(value.trans_time[0])[operation](1, unit)
      .startOf(unit).format('YYYY-MM-DD HH:mm:ss')
    const endTime = dayjs(value.trans_time[1])[operation](1, unit)
      .endOf(unit).format('YYYY-MM-DD HH:mm:ss')
    
    props.onChange({
      ...value,
      date,
      trans_time: [startTime, endTime],
      type: viewType
    })
  }
  
  const clickHandler = (direction: 'left' | 'right') => {
    updateDate(direction)
  }
  
  const handleDateChange = (val: Dayjs) => {
    const unit = viewType
    const dateFormat = viewType === 'year' ? 'YYYY' : 'YYYY-MM'
    
    props.onChange({
      ...props.value,
      date: val.format(dateFormat),
      trans_time: [
        val.startOf(unit).format('YYYY-MM-DD HH:mm:ss'), 
        val.endOf(unit).format('YYYY-MM-DD HH:mm:ss')
      ],
      type: viewType
    })
  }

  const handleViewTypeChange = (type: 'year' | 'month') => {
    setViewType(type)
    // Update date format if needed when switching view types
    if (type !== props.value.type) {
      const currentDate = dayjs(props.value.date)
      handleDateChange(currentDate)
    }
  }
  
  return <Row>
    <Col span={8} style={{textAlign: 'left'}}>
      <LeftCircleFilled style={{
        fontSize: 20,
        color: theme.useToken().token.colorPrimary,
        cursor: 'pointer'
      }} onClick={() => clickHandler('left')} />
    </Col>
    <Col span={8} style={{
      borderRadius: 4,
      textAlign: 'center'}} onClick={() => setModalVisible(true)}>
      <Typography.Text>{
        viewType === 'year' 
          ? `${props.value.date}年` 
          : `${dayjs(props.value.date).format('YYYY年M月')}`
      }</Typography.Text>
    </Col>
    <Col span={8} style={{textAlign: 'right'}}>
      <RightCircleFilled style={{
        fontSize: 20,
        cursor: 'pointer',
        color: theme.useToken().token.colorPrimary
      }} onClick={() => clickHandler('right')} />
    </Col>
    {
      modalVisible && (
        <Modal
          title={viewType === 'year' ? "选择年份" : "选择月份"}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <Radio.Group 
            value={viewType} 
            onChange={(e) => handleViewTypeChange(e.target.value)}
          >
            <Radio.Button value="year">年视图</Radio.Button>
            <Radio.Button value="month">月视图</Radio.Button>
          </Radio.Group>
          <DatePicker 
            value={dayjs(props.value.date)}
            onChange={handleDateChange}
            picker={viewType}
            style={{ marginTop: 16, width: '100%' }}
          />
        </Modal>
      )
    }
  </Row>
}
export default useReviewForm
