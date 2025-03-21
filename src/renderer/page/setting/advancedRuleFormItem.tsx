import { Col, Row, Space, Table, Button, Input, InputNumber, Cascader } from "antd";
import { category_type } from "src/renderer/const/categroy";
import React from "react";
import {
  PlusOutlined,
  MinusOutlined,
  PlusCircleFilled,
  MinusCircleFilled,
} from "@ant-design/icons";
import SelectWrap from "../../components/selectWrap";
import { cpt_const } from "../../const/web";
import { DefaultOptionType } from "antd/es/cascader";
const { TextArea } = Input;

export type RuleItem = {
  condition: string;
  formula: string;
  value: string;
};
export type RuleItemList = RuleItem[];
export type RuleItemListList = RuleItemList[];
function AdvancedRuleFormItem(props: {
  value: RuleItemListList;
  onChange: (value: RuleItemListList) => void;
}) {
  const { value, onChange } = props;
  return (
    <div>
      {value.map((item, index) => {
        return (
          <Row key={index}>
            {index > 0 && (
              <Col span={24} style={{ textAlign: "left" }}>
                或
              </Col>
            )}
            <Col span={24}>
              <AdvancedRuleItem
                data={item}
                rowKey={index}
                onChange={(newValue) => {
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
                  onChange([...value, [{ condition: "", formula: "", value: "" }]]);
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
          onChange([...value, [{ condition: "", formula: "", value: "" }]]);
        }}
      >
        添加规则
      </Button>
    </div>
  );
}
function AdvancedRuleItem(props: {
  onDelete: () => void;
  onAdd: () => void;
  onChange: (newValue: RuleItemList) => void;
  rowKey: number;
  data: RuleItemList;
}) {
  const { data, onDelete, onAdd, onChange, rowKey } = props;

  const columns = [
    {
      title: "操作",
      dataIndex: "action",
      render: (text: string, record: any, index: number) => {
        return (
          <Space>
            
            <PlusCircleFilled
              onClick={() => {
                onChange([...data, { condition: "", formula: "", value: "" }]);
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
      title: "条件",
      dataIndex: "condition",
      render: (text: string, record: any, index: number) => {
        return (
          <SelectWrap
            placeholder="条件"
            options={cpt_const.condition_type}
            value={record.condition}
            onChange={(value) => {
              console.log(value, "value");
              onChange(
                data.map((item, i) => {
                  if (i === index) {
                    return { ...item, condition: value, formula: undefined, value: undefined };
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
      title: "公式",
      dataIndex: "formula",
      width: 100,
      render: (text: string, record: any, index: number) => {
        let options = cpt_const.formula_type;
        if (["description", "payee"].includes(record.condition)) {
          options = options.filter((item) => ["notLike", "like", "eq"].includes(item.value));
        } else if (["amount"].includes(record.condition)) {
          options = options.filter((item) => ["gte", "lt", "eq"].includes(item.value));
        } else if (["account_type"].includes(record.condition)) {
          options = options.filter((item) => ["eq"].includes(item.value));
        } else if (["consumer"].includes(record.condition)) {
          options = options.filter((item) => ["eq", "ne"].includes(item.value));
        } else if (["category"].includes(record.condition)) {
          options = options.filter((item) => ["eq",'ne'].includes(item.value));
        }
        console.log(options, "options");

        return (
          <SelectWrap
            placeholder="公式"
            options={options}
            value={record.formula}
            disabled={!record.condition}
            onChange={(value) => {
              console.log(value, "value");
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
      title: "值",
      dataIndex: "value",
      render: (text: string, record: any, index: number) => {
        if (record.condition === "amount") {
          // 判断是否为数字
          const intValue = isNaN(record.value) ? 0 : record.value;
          return (
            <InputNumber
              placeholder="值"
              value={intValue}
              onChange={(e) => {
                console.log(e, "value");
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
        } else if (record.condition === "account_type") {
          return (
            <SelectWrap
              placeholder="值"
              options={cpt_const.account_type}
              value={record.value}
              onChange={(value) => {
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
        } else if (record.condition === "consumer") {
          return (
            <SelectWrap
              placeholder="值"
              options={cpt_const.consumer_type}
              onChange={(value) => {
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
        } else if (record.condition === "category") {
          return (
            <Cascader
              allowClear
              showSearch={{
                filter: (inputValue: string, path: DefaultOptionType[]) =>
                  path.some(
                    (option) =>
                      (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1
                  ),
              }}
              placeholder="值"
              value={ typeof record.value === 'string' ? JSON.parse(record.value) : record.value}
              options={category_type}
              onChange={(value) => {
                onChange(
                  data.map((item, i) => {
                    console.log(value, "value");
                    
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
            autoSize={{ minRows: 3, maxRows: 5 }}
            value={record.value}
            onChange={(e) => {
              console.log(e.target.value, "value");
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
    <Row align="middle" style={{ backgroundColor: "#f5f5f5", padding: 10 }} gutter={10}>
      <Col span={1} style={{ textAlign: "center" }}>
        且
      </Col>
      <Col flex="1">
        <Table columns={columns} dataSource={data} pagination={false} size="small" bordered />
      </Col>
      <Col span={1} style={{ textAlign: "center" }}>
        <MinusOutlined onClick={onDelete} />{" "}
      </Col>
    </Row>
  );
}
export default AdvancedRuleFormItem;
