import {
  Col,
  Collapse,
  Flex,
  message,
  Modal,
  Progress,
  Row,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import type { CollapseProps, TableColumnsType, TableRowSelection } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import useModal from '../../components/useModal';
import { ModalContent } from './ModalContent';
import { AccountBookFilled } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { category_type, findCategoryById } from '../../const/categroy';
import { formatMoney } from '../../components/utils';
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
        <Typography.Text>{formatMoney(total)}</Typography.Text>
      </Col>
    </Row>
  );
};

const CategoryCollaspe = (props: {
  data: DataType[];
  formValue: FormData;
  refreshTable: () => void;
}) => {
  const { data, formValue, refreshTable } = props;
  // const [show, toggle] = useModal();
  const [visible, setVisible] = useState<boolean>(false);
  const [cate, setCate] = useState<string>('');
  const [modalData, setModaldata] = useState<any>([]);
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
        category: cate,
        trans_time: formValue.trans_time,
      });
    }
  }, [formValue, cate, visible], 'transaction');

  const refresh = () => {
    refreshTable();
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
              <Typography.Text>{formatMoney(item.value, '万')}</Typography.Text>
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
              setCate(child.category);
              setVisible(true);
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

  return (
    <>
      {<Collapse bordered={false} expandIconPosition="end" items={items} />}
      {visible && (
        <Modal
          width={1000}
          closable={true}
          footer={null}
          open={visible}
          onCancel={() => setVisible(false)}
          title="交易详情"
        >
          {formValue.type === 'year' && <BarChart data={barData} />}
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
