import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Popconfirm,
  Row,
  Space,
  Steps,
  Alert,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import {
  findCategoryById,
  getCategoryString,
} from 'src/renderer/const/categroy';
import { account_type } from 'src/renderer/const/web';
import useLoadingButton from 'src/renderer/components/useButton';
import { formatMoney } from 'src/renderer/components/utils';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import UploadModal from '../../components/uploadModal';
import dayjs from 'dayjs';
import { openNotification } from 'src/renderer/components/notification';
import { ruleByAdvanced } from './ruleUtils';
import { renderIcon } from 'src/renderer/components/FontIcon';
import { getCategoryCol } from 'src/renderer/components/commonColums';

function checkNeedTransferData(data: any) {
  // 返回data中所有payee包含京东和拼多多，并且description包含京东-订单编号和商户单号的数据 ,返回index
  const jingdongData = data
    .map((obj: any, dataIndex: number) =>
      obj.payee?.includes('京东') && obj.description?.includes('京东-订单编号')
        ? { ...obj, dataIndex }
        : null,
    )
    .filter(Boolean);
  const pddData = data
    .map((obj: any, dataIndex: number) =>
      obj.payee?.includes('拼多多') && obj.description?.includes('商户单号')
        ? { ...obj, dataIndex }
        : null,
    )
    .filter(Boolean);
  const alipay1688 = data
    .map((obj: any, dataIndex: number) =>
      obj.payee?.includes('1688先采后付') &&
        obj.description?.includes('先采后付还款')
        ? { ...obj, dataIndex }
        : null,
    )
    .filter(Boolean);
  const hasJingdong = jingdongData.length > 0;
  const hasPdd = pddData.length > 0;
  const has1688 = alipay1688.length > 0;
  return {
    hasJingdong,
    hasPdd,
    // 1688 先采后付还款 数据 暂时没有
    has1688: false,

    jingdongData,
    pddData,
    // 1688 先采后付还款 数据 暂时没有
    alipay1688: [],
  };
}

export interface DataType {
  id: string;
  amount: string;
  category: string | null;
  description: string | null;
  account_type: number;
  payment_type: number;
  consumer: string;
  flow_type: string;
  creation_time: Date;
  trans_time: Date;
  modification_time: Date;
  tag: string | null;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: DataType;
  index: number;
  children: React.ReactNode;
}

export interface tableHeaderI {
  name: string;
  date: string;
  account_type: number;
  fileName: string;
  titleCostLabel: string;
  titleCost: string;
  titleIncome: string;
  titleIncomeLabel: string;
}
const BasicTable = (props: {
  tableData: any;
  tableHeader: tableHeaderI;
  onCancel: () => void;
  onSubmitSuccess: (arr: any) => void;
  step: number;
  setStep: (step: number) => void;
  setLoading: (loading: boolean) => void;
}) => {
  const {
    tableData,
    tableHeader,
    onCancel,
    onSubmitSuccess,
    step,
    setStep,
    setLoading,
    loading,
  } = props;
  const [api, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();
  const [data, setData] = useState(tableData);
  const [LoadingBtn, setBtnLoading, setLoadingFalse] = useLoadingButton();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState({ payee: '', description: '' });
  const [searchedColumn, setSearchedColumn] = useState('');

  // 写一个方法缓存needTransferData，根据data
  const needTransferData = useMemo(() => {
    const { hasJingdong, hasPdd, jingdongData, pddData, has1688, alipay1688 } =
      checkNeedTransferData(data);
    return {
      hasJingdong,
      hasPdd,
      jingdongData,
      pddData,
      has1688,
      alipay1688,
    };
  }, [data]);

  useEffect(() => {
    goStep2(needTransferData);
    console.log('check needTransferData');
  }, [needTransferData]);
  const edit = (record: DataType) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record });
  };
  const onDelete = (record: DataType) => {
    const newData = data.filter((obj: DataType) => obj.id !== record.id);
    setData(newData);
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: string,
  ) => {
    confirm();
    setSearchText({ ...searchText, [dataIndex]: selectedKeys[0] });
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void, dataIndex: string) => {
    clearFilters();
    setSearchText({ ...searchText, [dataIndex]: '' });
  };

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`搜索${dataIndex === 'payee' ? '交易对方' : '描述'}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
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
      return record[dataIndex]
        ? record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
        : false;
    },
    filteredValue: searchText[dataIndex] ? [searchText[dataIndex]] : null,
  });

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 50,
      fixed: 'left',
      render: (val: number, ctn: any, index: number) => index + 1,
    },
    {
      title: '交易时间',
      dataIndex: 'trans_time',
      width: 180,
      defaultCheck: true,
      fixed: 'left',
    },
    {
      title: '金额',
      dataIndex: 'amount',

      render: (val: string, { flow_type }: { flow_type: number }) => {
        if (!val) return '';
        if (!flow_type) return 'flow_type 为空';
        // 金额如果包含中文，则返回警告
        if (/[\u4e00-\u9fa5]/.test(val)) {
          return (
            <Typography.Text type="warning">这条数据有问题</Typography.Text>
          );
        }
        const child = flow_type === 1 ? '支：' : '收：';
        const type = flow_type === 1 ? 'danger' : 'success';
        return (
          <Space>
            <Typography.Text type={type}>
              {child} ¥{val}
            </Typography.Text>
          </Space>
        );
      },
      width: 140,
    },
    getCategoryCol({
      width: 120,
      defaultCheck: false,
    }),
    {
      title: '交易对方',
      dataIndex: 'payee',
      ellipsis: true,
      width: 120,
      ...getColumnSearchProps('payee'),
      render: (val: string) => (
        <Tooltip title={val}>
          <span>{val}</span>
        </Tooltip>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
      ...getColumnSearchProps('description'),
      render: (val: string) => (
        <Tooltip title={val}>
          <span>{val}</span>
        </Tooltip>
      ),
    },
    {
      title: '消费者',
      width: 80,
      dataIndex: 'consumer',
      defaultCheck: false,
      key: 'consumer',
      render: (val: number) => {
        const consumer_type = {
          1: '老公',
          2: '老婆',
          3: '家庭',
          4: '牧牧',
        };
        if (val === 1) {
          return <Tag color="cyan">{consumer_type[val]}</Tag>;
        } else if (val === 2) {
          return <Tag color="magenta">{consumer_type[val]}</Tag>;
        } else if (val === 3) {
          return <Tag color="geekblue">{consumer_type[val]}</Tag>;
        } else if (val === 4) {
          return <Tag color="orange">{consumer_type[val]}</Tag>;
        }
      },
    },

    {
      title: '账户',
      dataIndex: 'account_type',
      width: 80,
      defaultCheck: false,
      render: (val: number) => (val ? account_type[val] : ''),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 40,
      render: (_: any, record: DataType) => {
        return (
          <Space>
            <Popconfirm
              title="Are you sure to delete this task?"
              onConfirm={() => onDelete(record)}
              onCancel={() => { }}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined style={{ color: 'red' }} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const goStep2 = ({
    hasJingdong,
    hasPdd,
  }: {
    hasJingdong: boolean;
    hasPdd: boolean;
  }) => {
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
      const newData = await ruleByAdvanced(data, api);
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
          <Table.Summary.Cell index={0}>支出</Table.Summary.Cell>
          <Table.Summary.Cell index={1}>
            <a>{formatMoney(totalCost)}</a>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={2}>收入</Table.Summary.Cell>
          <Table.Summary.Cell index={3}>
            <a>{formatMoney(totalIncome)}</a>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </>
    );
  };
  console.log(step, 'step====');
  return (
    <div>
      {contextHolder}
      <Row align="middle" justify="center">
        <Col span={24} style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '24px', marginRight: '12px' }}>
            支出：
            <Typography.Text type="danger">
              {formatMoney(tableHeader.titleCost)}元
            </Typography.Text>
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
            <Typography.Text type="secondary">
              {tableHeader.titleCostLabel}
            </Typography.Text>
          </span>
          <span>
            <Typography.Text type="secondary">
              {tableHeader.titleIncomeLabel}
            </Typography.Text>
          </span>
        </Col>
      </Row>

      <Form form={form} component={false}>
        <Table
          virtual
          rowKey="id"
          onRow={(record) => {
            return {
              onDoubleClick: () => edit(record),
            };
          }}
          rowClassName={(record) => {
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
          summary={tableSummary}
          scroll={{ x: 1200, y: 300 }}
          pagination={false}
        />
      </Form>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: '10px' }}
      >
        <Space>
          <span style={{ fontSize: '12px' }}>{tableHeader?.fileName}</span>
          <span style={{ fontSize: '12px' }}>账号:{tableHeader?.name}</span>
          <span style={{ fontSize: '12px' }}>{tableHeader?.date}</span>
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
          onUploadSuccess={(type: string, transferData: []) => {
            let messageList = [];
            const newData = data.map((obj: any, index: number) => {
              // Skip if no description or wrong description format
              if (type === 'jd' && !obj.description?.includes('订单编号')) {
                return obj;
              }
              if (type === 'pdd' && !obj.description?.includes('商户单号')) {
                return obj;
              }
              if (
                type === 'alipay1688' &&
                !obj.description?.includes('先采后付还款')
              ) {
                return obj;
              }

              // Find matching transfer data
              const matchingItem = transferData.find((item: any) => {
                // 时间误差在3分钟
                const isSameTime =
                  dayjs(obj.trans_time).diff(dayjs(item.trans_time), 'minute') <
                  3;
                const isSameAmount =
                  Math.round(Number(obj.amount)) ===
                  Math.round(Number(item.amount));

                return isSameTime && isSameAmount;
              });

              if (matchingItem) {
                messageList.push({
                  index,
                  message: `第 ${index + 1} 条：`,
                  before: obj.description,
                  after: matchingItem.description,
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
