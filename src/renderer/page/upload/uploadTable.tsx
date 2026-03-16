import { Button, Col, Input, message, notification, Row, Space, Table, Tooltip, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import useLoadingButton from '../../components/useButton';
import { formatMoney } from '../../components/utils';
import { SearchOutlined } from '@ant-design/icons';
import UploadModal from '../../components/uploadModal';
import dayjs from 'dayjs';
import { openNotification } from '../../components/notification';
import { ruleByAdvanced } from './ruleUtils';
import { calculateCounts, calculateTotals, checkNeedTransferData } from './uploadTable.helpers';
import type { TableHeader, GetColumnSearchProps } from './uploadTable.types';
import { createUploadTableColumns } from './uploadTable.columns';
interface BasicTableProps {
  // 这里保持宽松类型以兼容上传解析后的原始数据结构
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableData: any[];
  tableHeader: TableHeader;
  onCancel: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmitSuccess: (arr: any[]) => void;
  step: number;
  setStep: (step: number) => void;
  setLoading: (loading: boolean) => void;
}

const BasicTable = (props: BasicTableProps) => {
  const { tableData, tableHeader, onCancel, onSubmitSuccess, step, setStep, setLoading } = props;
  const [api, contextHolder] = notification.useNotification();

  const [data, setData] = useState<any[]>(tableData);
  const [LoadingBtn, setBtnLoading, setLoadingFalse] = useLoadingButton();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState<{ payee: string; description: string }>({
    payee: '',
    description: '',
  });

  // 写一个方法缓存needTransferData，根据data
  const needTransferData = useMemo(() => {
    const { hasJingdong, hasPdd, jingdongData, pddData } =
      checkNeedTransferData(data);
    return {
      hasJingdong,
      hasPdd,
      jingdongData,
      pddData,
    };
  }, [data]);

  useEffect(() => {
    goStep2(needTransferData);
    console.log('check needTransferData');
  }, [needTransferData]);

  const onDelete = (record: any) => {
    const newData = data.filter((obj: any) => obj.id !== record.id);
    setData(newData);
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: keyof typeof searchText
  ) => {
    confirm();
    setSearchText({ ...searchText, [dataIndex]: selectedKeys[0] });
  };

  const handleReset = (clearFilters: () => void, dataIndex: keyof typeof searchText) => {
    clearFilters();
    setSearchText({ ...searchText, [dataIndex]: '' });
  };

  const getColumnSearchProps: GetColumnSearchProps = (dataIndex: keyof typeof searchText) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`搜索${dataIndex === 'payee' ? '交易对方' : '交易描述'}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, dataIndex)}
            size="small"
            style={{ width: 90 }}
          >
            重置
          </Button>
        </Space>
      </div>
    ),

    onFilter: (value: string, record: any) => {
      const field = record[dataIndex];
      return field ? field.toString().toLowerCase().includes(value.toLowerCase()) : false;
    },
    filteredValue: searchText[dataIndex] ? [searchText[dataIndex]] : null,
  });

  const columns = createUploadTableColumns({
    getColumnSearchProps,
    onDelete,
  });

  const goStep2 = ({ hasJingdong, hasPdd }: { hasJingdong: boolean; hasPdd: boolean }) => {
    if (!hasJingdong && !hasPdd && step === 2) {
      // 替换为京东-订单编号
      setStep(3);
    } else if (step === 2) {
      setModalVisible(true);
    }
  };
  const goStep3 = async () => {
    // 根据用户规则分类
    // 根据ai 分类
    // 根据规则分类
    try {
      const rules = await window.mercury.api.getAllAdvancedRules({
        active: 1,
      });
      const newData = await ruleByAdvanced(data, rules, api);
      // 根据用户手动分类
      setData(newData);
      setStep(4);
      console.log(step, 'step aaaa====');

      setLoadingFalse();
    } catch (error) {
      message.error('分类失败');
    }
  };
  const submit = async () => {
    // 判断 描述中是否包含京东-订单编号
    setLoading(true);

    setTimeout(() => {
      if (step === 2) {
        goStep2(needTransferData);
      } else if (step === 3) {
        // 分类
        goStep3();
      } else if (step === 4) {
        // 上传
        onSubmitSuccess(data);
      }
      setLoading(false);
    }, 0);
  };
  const tableSummary = (pageData: any) => {
    let totalCost = 0;
    let totalIncome = 0;
    pageData.forEach((obj: any) => {
      if (obj?.flow_type === 1) {
        totalCost += Number(obj.amount);
      } else if (obj?.flow_type === 2) {
        totalIncome += Number(obj.amount);
      }
    });
    return (
      <>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0}>累加支出:</Table.Summary.Cell>
          <Table.Summary.Cell index={1}>
            <a>{formatMoney(totalCost)}</a>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={2}>累加收入:</Table.Summary.Cell>
          <Table.Summary.Cell index={3}>
            <a>{formatMoney(totalIncome)}</a>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </>
    );
  };
  console.log(step, 'step====');
  const { totalCost, totalIncome, totalNoCost } = calculateTotals(data);
  const { totalNoCostCount, totalIncomeCount, totalCostCount } = calculateCounts(data);

  return (
    <div>
      {contextHolder}
      <Row align="middle" justify="center">
        <Col span={24} style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '24px', marginRight: '12px' }}>
            支出：
            <Typography.Text type="danger">{formatMoney(tableHeader.titleCost)}元</Typography.Text>
          </span>
          <span style={{ fontSize: '24px' }}>
            收入：
            <Typography.Text type="success">
              {formatMoney(tableHeader?.titleIncome)}元
            </Typography.Text>
          </span>
        </Col>
        <Col span={24} style={{ textAlign: 'center' }}>
          <span style={{ marginRight: '12px' }}>
            <Typography.Text type="secondary">{tableHeader.titleCostLabel}</Typography.Text>
          </span>
          <span>
            <Typography.Text type="secondary">{tableHeader.titleIncomeLabel}</Typography.Text>
          </span>
        </Col>
      </Row>

      <Table
        virtual
        rowKey="id"
        rowClassName={record => {
          // 金额如果包含中文，则返回警告
          if (/[\u4e00-\u9fa5]/.test(record.amount)) {
            return 'mercury-warning';
          }
          if (
            record.description?.includes('京东-订单编号') ||
            record.description?.includes('先采后付还款') ||
            record.description?.includes('商户单号')
          ) {
            return 'mercury-warning';
          }
          return '';
        }}
        dataSource={data}
        size="small"
        columns={columns}
        // summary={tableSummary}
        scroll={{ x: 1400, y: 300 }}
        pagination={false}
      />
      <Row justify="space-between" align="middle" style={{ marginBottom: '10px' }}>
        <Space>
          <span style={{ fontSize: '12px' }}>{tableHeader?.fileName}</span>
          <span style={{ fontSize: '12px' }}>账号:{tableHeader?.name}</span>
          <span style={{ fontSize: '12px' }}>{tableHeader?.date}</span>
        </Space>
        <Space>
          <span style={{ fontSize: '12px' }}>支出：{formatMoney(totalCost)}元, 共{totalCostCount}笔</span>
          <span style={{ fontSize: '12px' }}>收入：{formatMoney(totalIncome)}元, 共{totalIncomeCount}笔</span>
          <span style={{ fontSize: '12px' }}>不计支出：{formatMoney(totalNoCost)}元, 共{totalNoCostCount}笔</span>
        </Space>
        <Space>
          <Button onClick={onCancel}>取消</Button>

          <LoadingBtn type="primary" onClick={submit}>
            {step !== 4 ? '下一步' : '提交'}
          </LoadingBtn>
        </Space>
      </Row>
      {modalVisible && (
        <UploadModal
          visible={modalVisible}
          setLoading={setLoading}
          onCancel={() => {
            setModalVisible(false);
            setLoadingFalse();
          }}
          onOk={() => {
            setModalVisible(false);
            goStep3();
          }}
          needTransferData={needTransferData}
          onUploadSuccess={(type: string, transferData: any[]) => {
            const messageList: {
              index: number;
              message: string;
              changeContent: { before: string | null; after: string | null }[];
            }[] = [];
            console.log(type, transferData, 'transferData====');
            const newData = data.map((obj: any, index: number) => {
              // Skip if no description or wrong description format
              if (type === 'jd' && !obj.description?.includes('订单编号')) {
                return obj;
              }
              if (type === 'pdd' && !obj.description?.includes('商户单号')) {
                return obj;
              }


              // Find matching transfer data
              const matchingItem = transferData.find((item: any) => {
                // 时间误差在3分钟
                const isSameTime = dayjs(obj.trans_time).diff(dayjs(item.trans_time), 'minute') < 5;
                const isSameAmount =
                  Math.round(Number(obj.amount)) === Math.round(Number(item.amount));
                const timeMatched = dayjs(obj.trans_time).format('YYYY-MM-DD HH:mm:ss') === dayjs(item.trans_time).format('YYYY-MM-DD HH:mm:ss');

                return (isSameTime && isSameAmount) || timeMatched;
              });

              if (matchingItem) {
                messageList.push({
                  index,
                  message: `第 ${index + 1} 条：`,
                  changeContent: [
                    {
                      before: obj.description,
                      after: matchingItem.description,
                    },
                  ],
                });
                return {
                  ...obj,
                  description: matchingItem.description,
                };
              }

              return obj;
            });

            setData(newData);
            openNotification(messageList, api);
            setLoading(false);
            setModalVisible(false);
            setLoadingFalse();
          }}
        />
      )}
    </div>
  );
};

export default BasicTable;
