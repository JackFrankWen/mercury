import { Button, Spin, Tooltip, Popconfirm, Space, Table, Transfer, message } from "antd";
import React, { useEffect, useState } from "react";
import { getCategoryString } from "src/renderer/const/categroy";
import type { GetProp, TableColumnsType, TableProps, TransferProps } from "antd";
import dayjs from "dayjs";
type TransferItem = GetProp<TransferProps, "dataSource">[number];
type TableRowSelection<T extends object> = TableProps<T>["rowSelection"];
import { getCategoryCol } from "src/renderer/components/commonColums";
import { RuleItem, RuleItemList, RuleItemListList } from "./advancedRuleFormItem";

interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource: any[];
  leftColumns: TableColumnsType<any>;
  rightColumns: TableColumnsType<any>;
}
export default function GenerateContent(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [targetKeys, setTargetKeys] = useState<TransferProps["targetKeys"]>([]);

  const [generateData, setGenerateData] = useState<any[]>([]);
  const [autoData, setAutoData] = useState<any[]>([]);
  const onGenerate = async () => {
    setLoading(true);
    // 获取当前年份 第1天
    const currentYear = dayjs().startOf("year").format("YYYY-MM-DD HH:mm:ss");
    const res = await window.mercury.api.generateRule({
      trans_time: [currentYear, dayjs().endOf("year").format("YYYY-MM-DD HH:mm:ss")],
    });
    console.log(autoData, "autoData");
    // 过滤掉autoData中重复的数据 交易对方和描述一致
    const data = res.filter(
      (item) =>
        !autoData.some(
          (autoItem) => {
            const rule: RuleItemListList = JSON.parse(autoItem.rule);
            return rule.some((ruleItem: RuleItemList) => {
              return ruleItem.every((ruleItem2: RuleItem) => {
                return (ruleItem2.condition === "description" && ruleItem2.formula === "eq" && ruleItem2.value === item.description) ||
                  (ruleItem2.condition === "payee" && ruleItem2.formula === "eq" && ruleItem2.value === item.payee)
                  ;
              });
            });
          }
        )
    );
    if (data.length > 0) {
      setGenerateData(data);
      setAutoData([]);
    } else {
      message.warning("没有生成规则");
    }
    setLoading(false);
  };
  const refreshAutoData = () => {
    window.mercury.api.getAllAdvancedRules({}).then((res) => {
      console.log(res, "=====res");
      setAutoData(res);
    });
  };
  useEffect(() => {
    refreshAutoData();
  }, []);

  const columns = [
    getCategoryCol({
      width: 100,
    }),
    {
      title: "交易对方",
      dataIndex: "payee",
      ellipsis: true,
      render: (val: string) => (
        <Tooltip title={val}>
          <span>{val}</span>
        </Tooltip>
      ),
    },
    {
      title: "交易描述",
      dataIndex: "description",
      ellipsis: true,
      render: (val: string) => (
        <Tooltip title={val}>
          <span>{val}</span>
        </Tooltip>
      ),
    },
  ];
  const columnsAuto = [
    ...columns,
    {
      title: "操作",
      dataIndex: "operation",
      render: (val: string, record: any) => (
        <Popconfirm title="确定删除吗？" onConfirm={() => onDelete(record.id)}>
          <Button type="link">删除</Button>
        </Popconfirm>
      ),
    },
  ];
  const onChange: TableTransferProps["onChange"] = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
    console.log(nextTargetKeys, "nextTargetKeys");
  };
  const onSubmit = () => {
    const toSubmitData = generateData.filter((item) => targetKeys.includes(item.id));
    console.log(toSubmitData, "toSubmitData");
    const data = toSubmitData.map((item) => {
      const rule: RuleItemListList = [[
        {
          condition: 'description',
          formula: 'eq',
          value: item.description,
        },
        {
          condition: "payee",
          formula: "eq",
          value: item.payee,
        },
      ]]
      return {
        ...item,
        active: 1,
        priority: 100,
        name: item.description,
        rule: JSON.stringify(rule),
        creation_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        modification_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      };
    });

    window.mercury.api.batchInsertAdvancedRule(data).then((res) => {
      console.log(res, "res");
      setTargetKeys([]);
      setGenerateData([]);
      refreshAutoData();
    });
  };
  const onDelete = (id: number) => {
    window.mercury.api.deleteMatchAutoRule(id).then((res) => {
      console.log(res, "res");
      refreshAutoData();
    });
  };

  return (
    <Spin spinning={loading}>
      <Space>
        <Button onClick={onGenerate} loading={loading}>
          生成规则
        </Button>
        <Button type="primary" onClick={onSubmit} disabled={targetKeys.length === 0}>
          提交
        </Button>
      </Space>
      {generateData.length > 0 && (
        <div className="mt8">
          <TableTransfer
            className="mt8"
            rowKey={(record) => record.id}
            dataSource={generateData}
            targetKeys={targetKeys}
            operations={["生成的规则", ""]}
            showSelectAll={true}
            onChange={onChange}
            leftColumns={columns}
            rightColumns={columns}
          />
        </div>
      )}

    </Spin>
  );
}
// Customize Table Transfer
const TableTransfer: React.FC<TableTransferProps> = (props) => {
  const { leftColumns, rightColumns, ...restProps } = props;
  return (
    <Transfer style={{ width: "100%" }} {...restProps}>
      {({
        direction,
        filteredItems,
        onItemSelect,
        onItemSelectAll,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
        const columns = direction === "left" ? leftColumns : rightColumns;
        const rowSelection: TableRowSelection<TransferItem> = {
          getCheckboxProps: () => ({ disabled: listDisabled }),
          onChange(selectedRowKeys) {
            onItemSelectAll(selectedRowKeys, "replace");
          },
          selectedRowKeys: listSelectedKeys,
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
        };
        console.log(filteredItems, "===aaa");

        return (
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredItems}
            rowKey={(record) => record.id}
            size="small"
            scroll={{ y: 400 }}
            pagination={false}
            style={{ pointerEvents: listDisabled ? "none" : undefined }}
            onRow={({ key, disabled: itemDisabled }) => ({
              onClick: () => {
                if (itemDisabled || listDisabled) {
                  return;
                }
                onItemSelect(key, !listSelectedKeys.includes(key));
              },
            })}
          />
        );
      }}
    </Transfer>
  );
};
