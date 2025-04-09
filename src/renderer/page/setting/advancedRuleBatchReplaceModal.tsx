import React, { useState, useEffect } from "react";
import {
  Modal,
  Steps,
  Button,
  Form,
  Input,
  DatePicker,
  Alert,
  Select,
  Table,
  Space,
  Spin,
  message,
  Result,
  Typography,
  Tooltip,
} from "antd";
import { RuleItemListList } from "./advancedRuleFormItem";
import { renderRuleContent } from "./advancedRule";
import type { Params_Transaction } from "src/preload/type";
import dayjs from "dayjs";
import { getCategoryString } from "../../const/categroy";
import { changeCategoryModal, MessageItem } from "../../components/notification";
import RangePickerWrap from "../../components/rangePickerWrap";
import { findMatchList } from "../upload/ruleUtils";
import { getConsumerType, getTagType } from "src/renderer/const/web";
const { Step } = Steps;
const { RangePicker } = DatePicker;

interface BatchReplaceModalProps {
  visible: boolean;
  rule: any;
  onClose: () => void;
  onSuccess: () => void;
}

interface DataPreviewItem {
  id: number;
  description: string;
  amount: number;
  category: string;
  trans_time: string;
}

const BatchReplaceModal: React.FC<BatchReplaceModalProps> = ({
  visible,
  rule,
  onClose,
  onSuccess,
}) => {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [previewData, setPreviewData] = useState<DataPreviewItem[]>([]);
  const [results, setResults] = useState<MessageItem[]>([]);
  const [api, contextHolder] = message.useMessage();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);

  // 获取满足规则条件的交易记录
  const fetchPreviewData = async (values: any) => {
    setLoading(true);
    try {
      // 构建查询参数
      const params: Params_Transaction = {
        trans_time: values.dateRange.map((item: any) => item.format("YYYY-MM-DD HH:mm:ss")),
        flow_type: "1",
      };

      console.log(params, "params");

      // 获取交易数据
      const transactions = await window.mercury.api.getTransactions(params);
      const matchList = findMatchList(transactions, rule);

      // 这里简单展示数据，实际应用中可能需要根据高级规则筛选匹配的记录
      setPreviewData(matchList);
      setDataSource(matchList);
      if (matchList.length > 0) {
        const allKeys = matchList.map((item) => item.id);
        setSelectedRowKeys(allKeys);
      }
    } catch (error) {
      console.error("获取预览数据失败:", error);
      message.error("获取预览数据失败");
    } finally {
      setLoading(false);
    }
  };

  // 执行批量替换
  const executeBatchReplace = async () => {
    setLoading(true);
    try {
      const values = form.getFieldsValue();

      if (previewData.length === 0) {
        message.warning("没有可替换的数据");
        return;
      }

      // 获取要更新的ID列表
      const ids = previewData.map((item) => item.id);

      // 构建更新参数
      const updateParams: Partial<Params_Transaction> = {
        category: rule.category,
        consumer: rule.consumer,
        tag: rule.tag,
      };
      if (!rule.consumer) {
        delete updateParams.consumer;
      }
      if (!rule.tag) {
        delete updateParams.tag;
      }

      // 执行批量更新
      await window.mercury.api.updateTransactions(ids, updateParams);

      // 构建结果数据
      const resultItems: ResultItem[] = previewData.map((item, index) => ({
        index: index,
        message: `${item.description} (${dayjs(item.trans_time).format("YYYY-MM-DD")})`,
        before: getCategoryString(item.category),
        after: getCategoryString(rule.category),
        extra: rule,
      }));

      setResults(resultItems);
      setCurrent(2); // 移动到结果步骤
    } catch (error) {
      console.error("批量替换失败:", error);
      message.error("批量替换失败");
    } finally {
      setLoading(false);
    }
  };

  // 步骤内容
  const steps = [
    {
      title: "设置条件",
      content: (
        <Form
          form={form}
          layout="vertical"
          initialValues={{ dateRange: [dayjs().startOf("year"), dayjs().endOf("year")] }}
        >
          <Form.Item
            name="dateRange"
            label="交易时间范围"
            rules={[{ required: true, message: "请选择时间范围" }]}
          >
            <RangePickerWrap bordered />
          </Form.Item>

          <Alert
            message="规则信息"
            style={{ maxHeight: 360, overflow: "auto" }}
            description={
              <div>
                <div>名称: {rule?.name}</div>
                <div>分类: {getCategoryString(rule?.category)}</div>
                <div>规则内容:</div>
                {rule?.rule && (
                  <div style={{ marginTop: 8, padding: 8, background: "#f5f5f5", borderRadius: 4 }}>
                    {renderRuleContent(JSON.parse(rule.rule))}
                  </div>
                )}
              </div>
            }
            type="info"
            showIcon
          />
        </Form>
      ),
    },
    {
      title: "预览数据",
      content: (
        <div>
          <Alert
            message="以下数据将被应用新的分类规则"
            description={`共找到 ${previewData.length} 条符合条件的数据，将被设置为：${getCategoryString(rule?.category)}${rule?.consumer ? ` · ${getConsumerType(rule?.consumer)}` : ""}${rule?.tag ? ` · ${getTagType(rule?.tag)}` : ""}`}
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Table
            rowSelection={{
              selectedRowKeys,
              onChange: (newSelectedRowKeys: React.Key[]) => {
                setSelectedRowKeys(newSelectedRowKeys);
              },
            }}
            onRow={(record) => {
              return {
                onClick: () => {
                  if (selectedRowKeys.includes(record.id)) {
                    setSelectedRowKeys(selectedRowKeys.filter((key) => key !== record.id));
                  } else {
                    setSelectedRowKeys([...selectedRowKeys, record.id]);
                  }
                },
              };
            }}
            virtual
            scroll={{ y: 300, x: 950 }}
            dataSource={previewData}
            rowKey="id"
            size="small"
            pagination={false}
            columns={[
              {
                title: "现分类",
                dataIndex: "category",
                width: 100,
                ellipsis: true,
                render: (val) => <Typography.Text delete>{getCategoryString(val)}</Typography.Text>,
              },
              {
                title: "交易对象",
                dataIndex: "payee",
                ellipsis: true,
                width: 120,
              },

              {
                title: "交易描述",
                dataIndex: "description",
                ellipsis: true,
                width: 200,
                render: (val) => (
                  <Tooltip title={val}>
                    <Typography.Text>{val}</Typography.Text>
                  </Tooltip>
                ),
              },
              {
                title: "金额",
                dataIndex: "amount",
                width: 100,
                render: (val) => `¥${Number(val).toFixed(2)}`,
              },
              {
                title: "消费者",
                dataIndex: "consumer",
                width: 100,
                render: (val) => getConsumerType(val),
              },
              {
                title: "标签",
                dataIndex: "tag",
                width: 100,
                render: (val) => getTagType(val),
              },

              {
                title: "交易时间",
                dataIndex: "trans_time",
                width: 180,
                render: (val) => dayjs(val).format("YYYY-MM-DD HH:mm:ss"),
              },
            ]}
          />
        </div>
      ),
    },
    {
      title: "完成",
      content: (
        <Result
          status="success"
          title="批量替换完成"
          subTitle={`成功更新 ${results.length} 条记录`}
          extra={
            <Button
              type="primary"
              onClick={() => {
                changeCategoryModal(results, "批量替换结果");
              }}
            >
              查看详细结果
            </Button>
          }
        />
      ),
    },
  ];

  // 处理下一步
  const handleNext = () => {
    if (current === 0) {
      form
        .validateFields()
        .then((values) => {
          fetchPreviewData(values);
          setCurrent(current + 1);
        })
        .catch((info) => {
          console.log("验证失败:", info);
        });
    } else if (current === 1) {
      executeBatchReplace();
    } else {
      onSuccess();
    }
  };

  // 处理上一步
  const handlePrev = () => {
    setCurrent(current - 1);
  };

  // 按钮文字
  const getButtonText = () => {
    if (current === 0) return "下一步";
    if (current === 1) return "执行替换";
    return "完成";
  };

  return (
    <>
      {contextHolder}
      <Modal title="批量替换" open={visible} width={1000} onCancel={onClose} footer={null}>
        <Spin spinning={loading}>
          <Steps current={current} style={{ marginBottom: 20 }}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>

          <div className="steps-content" style={{ minHeight: 300 }}>
            {steps[current].content}
          </div>

          <div
            className="steps-action"
            style={{ marginTop: 24, display: "flex", justifyContent: "space-between" }}
          >
            {current > 0 && current < 2 && <Button onClick={handlePrev}>上一步</Button>}

            <Button type="primary" onClick={handleNext} style={{ marginLeft: "auto" }}>
              {getButtonText()}
            </Button>
          </div>
        </Spin>
      </Modal>
    </>
  );
};

export default BatchReplaceModal;
