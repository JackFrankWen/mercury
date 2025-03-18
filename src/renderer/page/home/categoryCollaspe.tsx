import { Col, Collapse, Flex, message, Modal, Progress, Row, Table, Tag, Tooltip, Typography } from 'antd'
import type { CollapseProps, TableColumnsType, TableRowSelection } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import useModal from '../../components/useModal'
import { ModalContent } from './ModalContent'
import { AccountBookFilled } from '@ant-design/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { category_type, findCategoryById } from '../../const/categroy'
import { formatMoney } from '../../components/utils'
import { renderIcon } from '../../components/FontIcon'
// import BatchUpdateArea from '../views/accounting/batch-update'



interface DataType {
  id: string
  name: string
  avg: string
  value: string
  percent: string
  child: DataType[]
}

const Item = (props: {
    name: string,
    total: string,
    percent: number,
    color: string,
    icon?: string,
    onClick: () => void,
}) => {
    const { name, total, percent, color, icon, onClick } = props;
    return (
        <Row justify='space-between'
        align='middle'
        onClick={onClick}
         style={{
          margin: '0 10px 10px',
          borderRadius: 8,
          padding: '8px 10px',
          background: '#fff'
        }}>
            <Row
                justify='start'
                align='middle'
                
            >
              <Col>
              
                {icon ? 
                    <span style={{ fontSize: 16 }}>{renderIcon(icon, color)}</span> :
                    <AccountBookFilled style={{ fontSize: 16, color: color }} />
                }
              </Col>
              <Col >
              
                 <Typography.Text style={{
                        fontSize: 12,
                        marginLeft: 5
                    }} >{name}</Typography.Text>
            
              </Col>
              </Row>
            <Col>
                  <Typography.Text>{formatMoney(total)}元</Typography.Text>
            </Col>
            
        </Row>
    )
}

const CategoryCollaspe = (props: {
  data: DataType[]
  formValue: any
  refreshTable: () => void
}) => {
  const { data, formValue, refreshTable } = props
  const [show, toggle] = useModal()
  const [cate, setCate] = useState<string>('')
  const [modalData, setModaldata] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)

  const getCategory = async (data: any, category: string) => {
    if (!category) return;
    
    setLoading(true);
    try {
      const { trans_time } = data;
      const params = {
        ...data,
        category,
        trans_time,
      }
      
      const res = await window.mercury.api.getTransactions(params);
      if (res) {
        setModaldata(res);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      message.error("获取交易数据失败");
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    if (cate && show) {
      getCategory(formValue, cate);
    }
  }, [formValue, cate, show]);

  
  const refresh = useCallback(() => {
    refreshTable();
    if (cate) {
      getCategory(formValue, cate);
    }
  }, [formValue, cate, refreshTable]);

  const items: CollapseProps['items'] = data.map((item, index) => {
    const categoryInfo = findCategoryById(item.id);
    
    return {
        key: index,
        label: <Row justify='start'
        align='bottom'>
            <Col
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                {categoryInfo?.icon ? 
                    <span style={{ fontSize: 22 }}>{renderIcon(categoryInfo.icon, categoryInfo.color)}</span> :
                    <AccountBookFilled style={{ fontSize: 22, color: categoryInfo.color }} />
                }
            </Col>
            <Col flex='auto' style={{ marginLeft: 8 }}>
                <Row justify='space-between' 
                align='middle'
                style={{
                  marginBottom: -5,
                }}>
                    <Typography.Text style={{
                        fontSize: 12,
                        marginBottom: -10
                    }} strong>{item.name}</Typography.Text>
                  <Typography.Text>{formatMoney(item.value, '万')}</Typography.Text>
                </Row>
                <Row justify='space-between'>
                  <Col flex='auto'>
                    <Progress size='small' showInfo={false} percent={parseFloat(item.percent)} strokeColor={categoryInfo.color} />
                  </Col>
                  <Col>
                    <Typography.Text style={{
                      fontSize: 12,
                      paddingLeft: 10
                    }} type='secondary'>{parseFloat(item.percent)}%</Typography.Text>
                  </Col>
                </Row>
            </Col>
        </Row>,
        children: item.child.map((child, index) => {
            const childCategoryInfo = findCategoryById(child.id);
            return <Item 
                onClick={() => {
                  setCate(child.category);
                  toggle();
                }}
                name={child.name} 
                total={child.value} 
                percent={parseFloat(child.avg)} 
                color={childCategoryInfo?.color || child.color || '#1677ff'} 
                icon={childCategoryInfo?.icon} 
            />
        })
    }
  })
  
  return (
    <>
        {
           <Collapse
           bordered={false}
           
           expandIconPosition="end" 
           items={items}
           />
        } 
      {show && (
        <Modal 
          width={1000} 
          closable={true}
          footer={null} 
          open={show} 
          onCancel={toggle}
          title="交易详情"
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
          ) : (
            <ModalContent modalData={modalData} refresh={refresh} />
          )}
        </Modal>
      )}
    </>
  )
}

export default CategoryCollaspe
