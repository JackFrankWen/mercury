import { message, Modal, Table, Tag, Tooltip, Typography } from 'antd';
import type { TableColumnsType, TableRowSelection } from 'antd';
import { getDateTostring, roundToTwoDecimalPlaces, formatMoney } from '../../components/utils';
import React, { useCallback, useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table/interface';
import useModal from '../../components/useModal';
import { tag_type } from '../../const/web';
import dayjs from 'dayjs';
import { SelectionFooter } from 'src/renderer/components/SelectionFooter';
import { I_Transaction } from 'src/main/sqlite3/transactions';
import { ModalContent } from './ModalContent';
// import BatchUpdateArea from '../views/accounting/batch-update'

interface ExpandedDataType {
  name: string;
  category: string;
  avg: string;
  value: string;
}

interface DataType {
  id: string;
  name: string;
  avg: string;
  value: string;
  child: ExpandedDataType[];
}

const columns: ColumnsType<DataType> = [
  {
    title: '一级分类',
    dataIndex: 'name',
    width: '28%',
  },
  {
    title: '二级分类',
    dataIndex: 'oo',
    width: '28%',
  },

  {
    title: '金额',
    dataIndex: 'value',
    key: 'value',
    render: (val, obj) => (
      <Typography.Text>
        {formatMoney(val)}
        <Typography.Text type="secondary" style={{ marginLeft: '2px' }}>
          (月均: {formatMoney(obj.avg, '千', true)})
        </Typography.Text>
      </Typography.Text>
    ),
  },
];

const expandedRowRender = (toggle: any) => (record: DataType) => {
  const columns: TableColumnsType<ExpandedDataType> = [
    { title: '一级分类', width: '30%', dataIndex: '' },
    { title: '二级分类', width: '33%', dataIndex: 'name' },
    {
      title: '金额',
      dataIndex: 'value',
      key: 'value',
      render: (val, obj) => (
        <Typography.Text>
          {formatMoney(val)}
          <Typography.Text type="secondary" style={{ marginLeft: '2px' }}>
            (月均: {formatMoney(obj.avg, '千', true)})
          </Typography.Text>
        </Typography.Text>
      ),
    },
  ];

  return (
    <>
      <Table
        onRow={rowCol => {
          return {
            onClick: () => {
              console.log(rowCol, 'rowCol');
              toggle(rowCol.category);
            }, // 点击行
          };
        }}
        rowClassName={(record, index) => {
          const className = index % 2 === 0 ? 'oddRow' : 'evenRow';
          return className;
        }}
        showHeader={false}
        columns={columns}
        dataSource={record.child}
        pagination={false}
      />
    </>
  );
};

const CategoryTable = (props: {
  data: DataType[];
  formValue: any;
  refreshTable: () => void;
  showModal?: (category: string) => void;
  useSharedModal?: boolean;
}) => {
  const { data, formValue, refreshTable, showModal, useSharedModal = false } = props;
  const [show, toggle] = useModal();
  const [cate, setCate] = useState<string>('');
  const [modalData, setModaldata] = useState<any>([]);
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

  useEffect(() => {
    if (cate && show) {
      getCategory(formValue, cate);
    }
  }, [formValue, cate, show]);

  const onRowClick = (val: string) => {
    if (useSharedModal && showModal) {
      showModal(val);
    } else {
      setCate(val);
      toggle();
    }
  };
  const tableSummary = (pageData: any) => {
    let totalCost = 0;
    pageData.forEach((obj: any) => {
      totalCost += Number(obj.value);
    });
    return (
      <>
        <Table.Summary.Row>
          <Table.Summary.Cell index={1}></Table.Summary.Cell>
          <Table.Summary.Cell index={1} colSpan={2}>
            汇总
          </Table.Summary.Cell>
          <Table.Summary.Cell index={2}>
            <a>{formatMoney(totalCost)}</a>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </>
    );
  };
  const refresh = useCallback(() => {
    refreshTable();
    if (cate) {
      getCategory(formValue, cate);
    }
  }, [formValue, cate, refreshTable]);
  return (
    <>
      <Table
        rowKey="id"
        columns={columns}
        expandable={{
          indentSize: 0,
          expandRowByClick: true,
          expandedRowRender: expandedRowRender(onRowClick),
        }}
        summary={tableSummary}
        dataSource={data}
        pagination={false}
      />
      {!useSharedModal && show && (
        <Modal
          width={1000}
          closable={true}
          footer={null}
          open={show}
          onCancel={toggle}
          title="交易详情"
        >
          {modalData.length > 0 && (
            <ModalContent
              loading={loading}
              onCancel={toggle}
              modalData={modalData}
              refresh={refresh}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default CategoryTable;
