import { Button, Col, Row, Space, Popconfirm, Typography, Flex } from "antd";
import React, { useState } from "react";
import { I_Transaction } from "src/main/sqlite3/transactions";
import BatchUpdateArea from "src/renderer/components/batchForm";
import { formatMoney } from "./utils";
interface SelectionFooterProps {
  selectedCount: number;
  selectedAmount: number;
  className?: string;
  onCancel: () => void;
  onDelete: () => void;
  onUpdate: (params: Partial<I_Transaction>) => void;
}

export function SelectionFooter({
  selectedCount,
  selectedAmount,
  onCancel,
  onDelete,
  onUpdate,
  className,
}: SelectionFooterProps) {
  const [formValues, setFormValues] = useState<any>({});
  const removeUndefined = (obj: any) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== undefined));
  };
  return (
    <Row className={`table-footer ${className}`}>
      <Row justify="space-between" style={{ width: "100%" }}>
        <BatchUpdateArea formValues={formValues} setFormValues={setFormValues} />
        <Space.Compact style={{ textAlign: "right" }}>
          <Button onClick={onCancel}>取消</Button>
          <Popconfirm title="确定删除吗？" onConfirm={onDelete}>
            <Button danger>批量删除</Button>
          </Popconfirm>
          <Button type="primary"
            disabled={Object.keys(formValues).length === 0}
            onClick={() => onUpdate(removeUndefined(formValues))}>
            批量修改
          </Button>
        </Space.Compact>
      </Row>
      <Col span={24} className="mt8">
        <Row justify="space-between" >
          <div>
            选择 {selectedCount}个，金额：<Typography.Text strong>¥{formatMoney(selectedAmount)}</Typography.Text>
          </div>
        </Row>
      </Col>
    </Row>
  );
}
