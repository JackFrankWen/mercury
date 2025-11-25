import {
  Col,
  Collapse,
  message,
  Modal,
  Progress,
  Row,
  Typography,
} from 'antd';
import type { CollapseProps, TableColumnsType, TableRowSelection } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { ModalContent } from './ModalContent';
import { AccountBookFilled } from '@ant-design/icons';
import { category_type, findCategoryById } from '../../const/categroy';
import { formatMoneyObj } from '../../components/utils';
import { renderIcon } from '../../components/FontIcon';
import BarChart from 'src/renderer/components/barChart';
import { FormData } from './useReviewForm';
import { useFresh } from 'src/renderer/components/useFresh';
// import BatchUpdateArea from '../views/accounting/batch-update'

interface DataType {
  id: string;
  name: string;
  avg: string;
  value: string;
  percent: string;
  category?: string;
  color?: string;
  child: DataType[];
}

const Item = (props: {
  name: string;
  total: string;
  percent: number;
  color: string;
  icon?: string;
  onClick: () => void;
}) => {
  const { name, total, percent, color, icon, onClick } = props;
  return (
    <Row
      justify="space-between"
      align="middle"
      onClick={onClick}
      style={{
        margin: '0 10px 10px',
        borderRadius: 8,
        padding: '8px 10px',
        background: '#fff',
      }}
    >
      <Row justify="start" align="middle">
        <Col>
          {icon ? (
            <span style={{ fontSize: 16 }}>{renderIcon(icon, color)}</span>
          ) : (
            <AccountBookFilled style={{ fontSize: 16, color: color }} />
          )}
        </Col>
        <Col>
          <Typography.Text
            style={{
              fontSize: 12,
              marginLeft: 5,
            }}
          >
            {name}
          </Typography.Text>
        </Col>
      </Row>
      <Col>
        <Typography.Text>{formatMoneyObj({ amount: total })}</Typography.Text>
      </Col>
    </Row>
  );
};

const CategoryCollaspe = (props: {
  data: DataType[];
  formValue: any;
  refreshTable: () => void;
  showModal?: (category: string) => void;
  useSharedModal?: boolean;
}) => {
  const { data, formValue, refreshTable, showModal, useSharedModal = false } = props;
  // const [show, toggle] = useModal();
  const [visible, setVisible] = useState<boolean>(false);
  const [cate, setCate] = useState<string>('');
  const [modalData, setModaldata] = useState<any>([]);
  const [flowType, setFlowType] = useState<number>(0);
  const [barData, setBarData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getCategory = async (data: any, category: string) => {
    if (!category) return;

    setLoading(true);
    try {
      const { trans_time } = data;
      const params = {
        ...data,
        category,
        trans_time,
      };

      const res = await window.mercury.api.getTransactions(params);
      console.log(res, 'res=ooooooo===');
      if (res) {
        setModaldata(res);
        setFlowType(params.flow_type);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      message.error('获取交易数据失败');
    } finally {
      setLoading(false);
    }
  };
  const fetchData = async (obj: any) => {
    if (!obj) return;
    console.log(obj, 'obj=ooooooo===');

    try {
      const result = await window.mercury.api.getTransactionsByMonth(obj);
      setBarData(result);
    } catch (error) {
      message.error(error);
    }
  };

  useFresh(() => {
    if (cate && visible) {
      getCategory(formValue, cate);
    }
    if (formValue.type === 'year' && visible) {
      fetchData({
        ...formValue,
        category: cate,
        trans_time: formValue.trans_time,
      });
    }
  }, [formValue, cate, visible], 'transaction');

  const refresh = () => {
    refreshTable();
  };

  const handleCategoryClick = (categoryValue: string) => {
    if (useSharedModal && showModal) {
      showModal(categoryValue);
    } else {
      setCate(categoryValue);
      setVisible(true);
    }
  };

  const items: CollapseProps['items'] = data.map((item, index) => {
    const categoryInfo = findCategoryById(item.id);

    return {
      key: index,
      label: (
        <Row justify="start" align="bottom">
          <Col
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {categoryInfo?.icon ? (
              <span style={{ fontSize: 22 }}>
                {renderIcon(categoryInfo.icon, categoryInfo.color)}
              </span>
            ) : (
              <AccountBookFilled style={{ fontSize: 22, color: categoryInfo.color }} />
            )}
          </Col>
          <Col flex="auto" style={{ marginLeft: 8 }}>
            <Row
              justify="space-between"
              align="middle"
              style={{
                marginBottom: -5,
              }}
            >
              <Typography.Text
                style={{
                  fontSize: 12,
                  marginBottom: -10,
                }}
                strong
              >
                {item.name}
              </Typography.Text>
              <Typography.Text>{formatMoneyObj({
                amount: item.value,
                autoUnit: true,
                decimalPlaces: 0,
              })}</Typography.Text>
            </Row>
            <Row justify="space-between">
              <Col flex="auto">
                <Progress
                  size="small"
                  showInfo={false}
                  percent={parseFloat(item.percent)}
                  strokeColor={categoryInfo.color}
                />
              </Col>
              <Col>
                <Typography.Text
                  style={{
                    fontSize: 12,
                    paddingLeft: 10,
                  }}
                  type="secondary"
                >
                  {parseFloat(item.percent)}%
                </Typography.Text>
              </Col>
            </Row>
          </Col>
        </Row>
      ),
      children: item.child.map((child, index) => {
        const childCategoryInfo = findCategoryById(child.id);
        return (
          <Item
            onClick={() => {
              handleCategoryClick(child.category);
            }}
            name={child.name}
            total={child.value}
            percent={parseFloat(child.avg)}
            color={childCategoryInfo?.color || child.color || '#1677ff'}
            icon={childCategoryInfo?.icon}
          />
        );
      }),
    };
  });

  console.log(flowType, 'formValue.flowType=ooooooo===');
  return (
    <>
      {<Collapse bordered={false} expandIconPosition="end" items={items} />}
      {!useSharedModal && visible && (
        <Modal
          width={1000}
          closable={true}
          footer={null}
          open={visible}
          onCancel={() => setVisible(false)}
          title="交易详情"
        >
          {formValue.type === 'year' &&
            (<BarChart
              data={barData}
              hasElementClick={false}
              flowTypeVal={flowType} />
            )}
          {modalData.length > 0 && (
            <ModalContent
              onCancel={() => setVisible(false)}
              modalData={modalData}
              refresh={refresh}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default CategoryCollaspe;
