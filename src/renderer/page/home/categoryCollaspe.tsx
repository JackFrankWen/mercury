import { Col, Collapse, Flex, message, Modal, Progress, Table, Tag, Tooltip, Typography } from 'antd'
import type { CollapseProps, TableColumnsType, TableRowSelection } from 'antd'
import { getDateTostring, roundToTwoDecimalPlaces, formatMoney } from '../../components/utils'
import React, { useCallback, useEffect, useState } from 'react'
import { ColumnsType } from 'antd/es/table/interface'
import useModal from '../../components/useModal'
import { abc_type, cost_type, tag_type } from '../../const/web'
import dayjs from 'dayjs'
import { SelectionFooter } from 'src/renderer/components/SelectionFooter'
import { I_Transaction } from 'src/main/sqlite3/transactions'
import { ModalContent } from './ModalContent'
import { AccountBookFilled } from '@ant-design/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { category_type } from '../../const/categroy'
// import BatchUpdateArea from '../views/accounting/batch-update'

// Initialize FontAwesome library
library.add(fas)

// Helper function to find category and icon by id
const findCategoryById = (id: string | number): { label: string, icon: string } | undefined => {
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  
  // Search through all categories and their children
  for (const category of category_type) {
    if (category.value === numId) {
      return { label: category.label, icon: category.icon };
    }
    
    for (const child of category.children) {
      if (child.value === numId) {
        return { label: child.label, icon: child.icon };
      }
    }
  }
  
  return undefined;
}

// Render FontAwesome icon from string
const renderIcon = (iconString: string) => {
  if (!iconString) return null;
  
  const iconParts = iconString.split(' ');
  if (iconParts.length < 2) return null;
  
  const iconName = iconParts[1].replace('fa-', '');
  return <FontAwesomeIcon icon={['fas', iconName]} />;
}

interface ExpandedDataType {
  name: string
  category: string
  avg: string
  value: string
}

interface DataType {
  id: string
  name: string
  avg: string
  value: string
  child: DataType[]
}

const Item = (props: {
    name: string,
    total: string,
    percent: number,
    color: string,
    icon?: string,
}) => {
    const { name, total, percent, color, icon } = props;
    return (
        <Flex justify='start' align='center'>
            <Col
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                {icon ? 
                    <span>{renderIcon(icon)}</span> :
                    <AccountBookFilled style={{ fontSize: 32, color: color }} />
                }
            </Col>
            <Col flex='auto' >
                <Flex justify='space-between'>
                    <Typography.Text style={{
                        fontSize: 12,
                        marginBottom: -5,
                    }} type='secondary'>{name}</Typography.Text>
                </Flex>
                <Progress size='small' showInfo={false} percent={percent} strokeColor={color} />
            </Col>
            <Flex vertical align='center'>
                <Typography.Text >{total}</Typography.Text>
                <Typography.Text style={{ fontSize: 12 }} type='secondary'>{percent}%</Typography.Text>
            </Flex>
        </Flex>
    )
}

const CategoryTable = (props: {
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
  console.log(data, 'datappppp=====');
  const items: CollapseProps['items'] = data.map((item, index) => {
    const categoryInfo = findCategoryById(item.id);
    
    return {
        key: index,
        label: <Flex justify='space-between' align='center'>
            <Flex align='center' gap={10}>
                {categoryInfo?.icon && (
                    <span style={{ fontSize: 16 }}>{renderIcon(categoryInfo.icon)}</span>
                )}
                <Typography.Text style={{ fontSize: 12, fontWeight: 500 }}>{item.name}</Typography.Text>
            </Flex>
            <Typography.Text style={{ fontSize: 12, fontWeight: 500 }}>{formatMoney(item.value, '万')}</Typography.Text>
        </Flex>,
        children: item.child.map((child, index) => {
            const childCategoryInfo = findCategoryById(child.id);
            return <Item 
                name={child.name} 
                total={child.value} 
                percent={parseFloat(child.avg)} 
                color={child.color || '#1677ff'} 
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

export default CategoryTable
