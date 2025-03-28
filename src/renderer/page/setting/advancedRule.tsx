import {
  message,
  Space,
  Table,
  Tag,
  Modal,
  Button,
  Popover,
  Typography,
  Input,
  Badge,
  Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import AdvancedNewBtn from '../../components/advancedNewBtn';
import { getCategoryString, getCategoryTypeByLabel } from '../../const/categroy';
import { getAccountType, getConsumerType } from '../../const/web';
import { getPriorityType, getConditionType, getFormulaType, priority_type } from '../../const/web';
import AdvancedRuleModal from '../../components/advancedRuleModal';
import { RuleItem, RuleItemList, RuleItemListList } from './advancedRuleFormItem';
import BatchReplaceModal from './advancedRuleBatchReplaceModal';
import { AdvancedRule } from 'src/main/sqlite3/advance-rules';
import { getCategoryCol } from 'src/renderer/components/commonColums';
import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  SwapOutlined,
  PoweroffOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { useFresh } from 'src/renderer/components/useFresh';
import emitter from 'src/renderer/events';
// Add type declarations at the top
type TypeMap = { [key: string]: string };

const renderValue = (value: RuleItem) => {
  if (value.condition === 'account_type') {
    return getAccountType(value.value);
  } else if (value.condition === 'category') {
    console.log(value.value, 'value.value');

    return getCategoryString(value.value);
  } else if (value.condition === 'consumer') {
    return getConsumerType(value.value);
  }
  return value.value;
};
export const renderRuleContent = (rule: RuleItemListList) => {
  return (
    <div>
      {rule.map((item: RuleItemList, index: number) => (
        <>
          <div
            key={index}
            style={{
              padding: '5px',
              borderRadius: '5px',
              overflow: 'hidden',
              margin: '5px',
              backgroundColor: '#f0f0f0',
            }}
          >
            {item.map((item: RuleItem) => (
              <div>
                <Typography.Text strong>{getConditionType(item.condition)}</Typography.Text>
                <Typography.Text code>{getFormulaType(item.formula)}</Typography.Text>
                <Typography.Text>{renderValue(item)}</Typography.Text>
              </div>
            ))}
          </div>
          {index !== rule.length - 1 && (
            <span>
              <Typography.Text strong>OR</Typography.Text>
            </span>
          )}
        </>
      ))}
    </div>
  );
};

const RuleTable = (props: {
  type?: 'page' | 'modal';
  onSelectChange?: (selectedRows: AdvancedRule[]) => void;
}) => {
  const { type = 'page', onSelectChange } = props;
  const [ruleData, setRuleData] = useState<any>();
  const [searchValue, setSearchValue] = useState<string>('');

  // 添加选择行状态
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<AdvancedRule[]>([]);

  const getRuleData = async (rule?: { nameOrRule?: string; active?: number }) => {
    window.mercury.api.getAllAdvancedRules(rule).then((res: any) => {
      console.log(res, '====rule');
      if (res) {
        setRuleData(res);
        // 默认选中全部
        if (type === 'modal') {
          setSelectedRowKeys(res.map((item: AdvancedRule) => item.id));
          setSelectedRows(res);
          if (onSelectChange) {
            onSelectChange(res);
          }
        }
      }
    });
  };

  // 定义所有列
  const allColumns: ColumnsType<AdvancedRule> = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 80,
      fixed: 'left',
      render: (val: string, record) => {
        const rule: RuleItemListList = record.rule ? JSON.parse(record.rule) : [];
        return (
          <Popover content={renderRuleContent(rule)}>
            <Typography.Text>{val}</Typography.Text>
          </Popover>
        );
      },
    },
    getCategoryCol({ width: 100 }),
    {
      title: '优先级',
      dataIndex: 'priority',
      width: 100,
      filters: [
        { text: getPriorityType(1), value: 1 },
        { text: getPriorityType(10), value: 10 },
        { text: getPriorityType(100), value: 100 },
      ],
      onFilter: (value, record) => record.priority === value,
      render: (val: number) => {
        if (val === 1) {
          return <Tag color="magenta">{getPriorityType(val)}</Tag>;
        } else if (val === 10) {
          return <Tag color="gold">{getPriorityType(val)}</Tag>;
        } else if (val === 100) {
          return <Tag color="geekblue">{getPriorityType(val)}</Tag>;
        }
        return <div>{getPriorityType(val)}</div>;
      },
    },
    {
      title: '状态',
      dataIndex: 'active',
      ellipsis: true,
      width: 80,
      filters: [
        { text: '启用', value: 1 },
        { text: '禁用', value: 0 },
      ],
      onFilter: (value, record) => record.active === value,
      render: (val: number) => (
        <Badge status={val === 1 ? 'success' : 'default'} text={val === 1 ? '启用' : '禁用'} />
      ),
    },
    // {
    //   title: '规则',
    //   dataIndex: 'rule',
    //   ellipsis: true,
    //   render: (val: string | undefined, record: any) => {
    //     const rule: RuleItemListList = val ? JSON.parse(val) : []
    //     if (rule.length === 0) {
    //       return <div>暂无规则</div>
    //     }

    //     return <Popover content={renderRuleContent(rule)}>
    //       <div style={{  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
    //        {renderRuleContent(rule)}
    //       </div>
    //     </Popover>
    //   },
    // },
    // {
    //   title: '消费者',
    //   width: 80,
    //   dataIndex: 'consumer',
    //   key: 'consumer',
    //   render: (val: number) => {
    //     const consumer_type: { [key: number]: string } = {
    //       1: '老公',
    //       2: '老婆',
    //       3: '家庭',
    //       4: '牧牧',
    //     }
    //     if (val === 1) {
    //       return <Tag color="cyan">{consumer_type[val]}</Tag>
    //     } else if (val === 2) {
    //       return <Tag color="magenta">{consumer_type[val]}</Tag>
    //     } else if (val === 3) {
    //       return <Tag color="geekblue">{consumer_type[val]}</Tag>
    //     } else if (val === 4) {
    //       return <Tag color="orange">{consumer_type[val]}</Tag>
    //     }
    //   },
    // },

    // {
    //   title: '标签',
    //   dataIndex: 'tag',
    //   width: 90,
    //   render: (val: string) => (val ? (tag_type as TypeMap)[val] : ''),
    // },
    // {
    //   title: 'ABC类',
    //   dataIndex: 'abc_type',
    //   width: 100,
    //   render: (val: number) => (val ? (abc_type as TypeMap)[val] : ''),
    // },
    {
      title: 'Action',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setVisiable(true);
                setRecord(record);
              }}
            />
          </Tooltip>
          <Tooltip title={record.active === 1 ? '禁用' : '启用'}>
            <Button
              type="text"
              icon={
                record.active === 1 ? (
                  <PoweroffOutlined />
                ) : (
                  <CheckOutlined style={{ color: '#52c41a' }} />
                )
              }
              onClick={() => {
                window.mercury.api
                  .updateAdvancedRule(record.id, {
                    ...record,
                    active: record.active === 1 ? 0 : 1,
                  })
                  .then((res: any) => {
                    if (res.code === 200) {
                      message.success('状态更新成功');
                      getRuleData(searchValue ? { nameOrRule: searchValue } : undefined);
                    }
                  });
              }}
            />
          </Tooltip>
          <Tooltip title="批量替换">
            <Button
              type="text"
              icon={<SwapOutlined />}
              onClick={() => {
                setSelectedRule(record);
                setBatchReplaceVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: '确定要删除吗？',
                  onOk: () => {
                    window.mercury.api.deleteAdvancedRule(record.id).then((res: any) => {
                      if (res.code === 200) {
                        message.success('删除成功');
                        getRuleData(searchValue ? { nameOrRule: searchValue } : undefined);
                      }
                    });
                  },
                });
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 根据类型过滤列
  const columns = type === 'modal' ? allColumns.filter(col => col.key !== 'action') : allColumns;

  useFresh(() => {
    getRuleData(searchValue ? { nameOrRule: searchValue } : undefined);
  }, [searchValue], 'advancedRule');

  const [visiable, setVisiable] = useState(false);
  const [record, setRecord] = useState<AdvancedRule>();
  const [batchReplaceVisible, setBatchReplaceVisible] = useState(false);
  const [selectedRule, setSelectedRule] = useState<any>(null);

  const refresh = () => {
    getRuleData(searchValue ? { nameOrRule: searchValue } : undefined);
  };

  const onSearch = (value: string) => {
    setSearchValue(value);
    getRuleData({
      nameOrRule: value,
    });
  };

  // 行选择配置
  const rowSelection =
    type === 'modal'
      ? {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[], selected: AdvancedRule[]) => {
          setSelectedRowKeys(selectedKeys);
          setSelectedRows(selected);
          if (onSelectChange) {
            onSelectChange(selected);
          }
        },
      }
      : undefined;

  return (
    <div className="match-content">
      <Space>
        <Input.Search placeholder="请输入规则内容、名称" onSearch={onSearch} enterButton />

        {type !== 'modal' && <AdvancedNewBtn refresh={refresh} />}
        {selectedRowKeys.length > 0 && (
          <div>
            <span>选择了{selectedRowKeys.length}条</span>
          </div>
        )}
      </Space>
      <Table
        size="middle"
        className="mt8"
        columns={columns}
        dataSource={ruleData}
        rowKey="id"
        rowSelection={rowSelection}
        scroll={{ y: type === 'page' ? 'calc(100vh - 200px)' : 'calc(100vh - 400px)' }}
        pagination={false}
        onRow={
          type === 'modal'
            ? record => ({
              onClick: () => {
                const key = record.id;
                const newSelectedRowKeys = selectedRowKeys.includes(key)
                  ? selectedRowKeys.filter(k => k !== key)
                  : [...selectedRowKeys, key];

                const newSelectedRows = selectedRowKeys.includes(key)
                  ? selectedRows.filter(r => r.id !== key)
                  : [...selectedRows, record];

                setSelectedRowKeys(newSelectedRowKeys);
                setSelectedRows(newSelectedRows);

                if (onSelectChange) {
                  onSelectChange(newSelectedRows);
                }
              },
            })
            : undefined
        }
      />

      {visiable && (
        <Modal
          title="高级规则"
          open={visiable}
          width={700}
          onCancel={() => setVisiable(false)}
          footer={null}
        >
          <AdvancedRuleModal data={record} refresh={refresh} onCancel={() => setVisiable(false)} />
        </Modal>
      )}

      {batchReplaceVisible && (
        <BatchReplaceModal
          visible={batchReplaceVisible}
          rule={selectedRule}
          onClose={() => setBatchReplaceVisible(false)}
          onSuccess={() => {
            emitter.emit('refresh', 'transaction');
            setBatchReplaceVisible(false);
          }}
        />
      )}
    </div>
  );
};

export default RuleTable;
