import { Col, Row, Space, Table, Button, Input, InputNumber, Cascader, Typography } from 'antd';
import { category_type } from 'src/renderer/const/categroy';
import React from 'react';
import { PlusOutlined, DeleteOutlined, PlusCircleFilled, MinusCircleFilled } from '@ant-design/icons';
import SelectWrap from '../../components/selectWrap';
import { cpt_const } from '../../const/web';
import { DefaultOptionType } from 'antd/es/cascader';
const { TextArea } = Input;
const { Text } = Typography;

export type RuleItem = {
  condition: string;
  formula: string;
  value: string;
};
export type RuleItemList = RuleItem[];
export type RuleItemListList = RuleItemList[];
function AdvancedRuleFormItem(props: { value: RuleItemListList; onChange: (value: RuleItemListList) => void }) {
  const { value, onChange } = props;
  return (
    <div>
      {value.map((item, index) => {
        return (
          <Row key={index}>
            {index > 0 && (
              <Col span={24} style={{ textAlign: 'left' }}>
                <h4>或者</h4>
              </Col>
            )}
            <Col span={24}>
              <AdvancedRuleItem
                groupLength={value.length}
                data={item}
                rowKey={index}
                onChange={newValue => {
                  onChange(
                    value.map((item, i) => {
                      if (i === index) {
                        return newValue;
                      }
                      return item;
                    })
                  );
                }}
                onDelete={() => {
                  onChange(value.filter((_, i) => i !== index));
                }}
                onAdd={() => {
                  onChange([...value, [{ condition: '', formula: '', value: '' }]]);
                }}
              />
            </Col>
          </Row>
        );
      })}
      <Button
        className="mt8"
        icon={<PlusOutlined />}
        onClick={() => {
          onChange([...value, [{ condition: '', formula: '', value: '' }]]);
        }}
      >
        添加规则
      </Button>
    </div>
  );
}
function AdvancedRuleItem(props: {
  groupLength: number;
  onDelete: () => void;
  onAdd: () => void;
  onChange: (newValue: RuleItemList) => void;
  rowKey: number;
  data: RuleItemList;
}) {
  const { data, onDelete, onAdd, onChange, rowKey, groupLength } = props;

  const columns = [
    {
      title: '操作',
      dataIndex: 'action',
      render: (text: string, record: any, index: number) => {
        return (
          <Space>
            <PlusCircleFilled
              onClick={() => {
                onChange([...data, { condition: '', formula: '', value: '' }]);
              }}
            />
            {data.length > 1 && (
              <MinusCircleFilled
                onClick={() => {
                  onChange(data.filter((_, i) => i !== index));
                }}
              />
            )}
          </Space>
        );
      },
    },
    {
      title: '条件',
      dataIndex: 'condition',
      render: (text: string, record: any, index: number) => {
        // 过滤已经选择了options
        let options = cpt_const.condition_type;
        const otherData = data.filter((item, i) => i !== index);
        options = options.filter(item => !otherData.some(item2 => `${item2.condition}` === `${item.value}`));
        return (
          <SelectWrap
            placeholder="条件"
            options={options}
            value={record.condition}
            onChange={value => {
              console.log(value, 'value');
              onChange(
                data.map((item, i) => {
                  if (i === index) {
                    return { condition: value, formula: '', value: '' };
                  }
                  return item;
                })
              );
            }}
          />
        );
      },
    },
    {
      title: '公式',
      dataIndex: 'formula',
      width: 100,
      render: (text: string, record: any, index: number) => {
        let options = cpt_const.formula_type;
        if (['description', 'payee'].includes(record.condition)) {
          options = options.filter(item => ['notLike', 'like', 'eq'].includes(item.value));
        } else if (['amount'].includes(record.condition)) {
          options = options.filter(item => ['gte', 'lt', 'eq'].includes(item.value));
        } else if (['account_type'].includes(record.condition)) {
          options = options.filter(item => ['eq'].includes(item.value));
        } else if (['consumer'].includes(record.condition)) {
          options = options.filter(item => ['eq', 'ne'].includes(item.value));
        } else if (['category'].includes(record.condition)) {
          options = options.filter(item => ['eq', 'ne'].includes(item.value));
        }
        console.log(options, 'options');

        return (
          <SelectWrap
            placeholder="公式"
            options={options}
            value={record.formula}
            disabled={!record.condition}
            onChange={value => {
              console.log(value, 'value');
              onChange(
                data.map((item, i) => {
                  if (i === index) {
                    return { ...item, formula: value };
                  }
                  return item;
                })
              );
            }}
          />
        );
      },
    },
    {
      title: '值',
      dataIndex: 'value',
      render: (text: string, record: any, index: number) => {
        if (record.condition === 'amount') {
          // 判断是否为数字
          const intValue = isNaN(record.value) ? 0 : record.value;
          return (
            <InputNumber
              placeholder="值"
              value={intValue}
              onChange={e => {
                console.log(e, 'value');
                onChange(
                  data.map((item, i) => {
                    if (i === index) {
                      return { ...item, value: e };
                    }
                    return item;
                  })
                );
              }}
            />
          );
        } else if (record.condition === 'account_type') {
          return (
            <SelectWrap
              placeholder="值"
              options={cpt_const.account_type}
              value={record.value}
              onChange={value => {
                onChange(
                  data.map((item, i) => {
                    if (i === index) {
                      return { ...item, value: value };
                    }
                    return item;
                  })
                );
              }}
            />
          );
        } else if (record.condition === 'consumer') {
          return (
            <SelectWrap
              placeholder="值"
              options={cpt_const.consumer_type}
              onChange={value => {
                onChange(
                  data.map((item, i) => {
                    if (i === index) {
                      return { ...item, value: value };
                    }
                    return item;
                  })
                );
              }}
            />
          );
        } else if (record.condition === 'category') {
          console.log(record.value, 'record.value');
          let calValue = record.value;
          try {
            if (record.value && typeof record.value === 'string') {
              calValue = JSON.parse(record.value);
            } else {
              calValue = record.value;
            }
          } catch (error) {
            console.log(error, 'error');
          }

          return (
            <Cascader
              allowClear
              showSearch={{
                filter: (inputValue: string, path: DefaultOptionType[]) =>
                  path.some(option => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1),
              }}
              placeholder="值"
              value={calValue}
              options={category_type}
              onChange={value => {
                onChange(
                  data.map((item, i) => {
                    console.log(value, 'value');

                    if (i === index) {
                      return { ...item, value: JSON.stringify(value) };
                    }
                    return item;
                  })
                );
              }}
            />
          );
        }
        return (
          <TextArea
            placeholder="值"
            autoSize={{ minRows: 4 }}
            value={record.value}
            onChange={e => {
              console.log(e.target.value, 'value');
              onChange(
                data.map((item, i) => {
                  if (i === index) {
                    return { ...item, value: e.target.value };
                  }
                  return item;
                })
              );
            }}
          />
        );
      },
    },
  ];
  return (
    <Row align="middle" style={{ backgroundColor: '#fff', padding: 10, borderRadius: 12 }} gutter={10}>
      <Col flex="1">
        <span style={{}}>规则组[{rowKey + 1}]</span>
        <Typography.Text type={'secondary'}> 表格中所有等式必须同时满足，规则组[{rowKey + 1}]才能生效</Typography.Text>
        <Table columns={columns} dataSource={data} pagination={false} size="small" bordered />
      </Col>
      {groupLength > 1 && (
        <Col span={1} style={{ textAlign: 'center' }}>
          <DeleteOutlined
            onClick={onDelete}
            style={{
              color: '#ff4d4f',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          />
        </Col>
      )}
    </Row>
  );
}
export default AdvancedRuleFormItem;
