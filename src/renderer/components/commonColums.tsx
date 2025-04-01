import { ColumnsType, Tag } from "antd";
import React from "react";
import { getCategoryString } from "../const/categroy";
import { findCategoryById } from "../const/categroy";
import { renderIcon } from "../components/FontIcon";
import { Space } from "antd";

export function getCategoryCol(props: ColumnsType) {
  return {
    title: "分类",
    dataIndex: "category",
    key: "category",
    width: 140,
    render: (val: string) => {
      if (!val) {
        return <Tag color="default">未分类</Tag>;
      }
      const cate = JSON.parse(val);
      const category = findCategoryById(cate[1]);
      return (
        <Space>
          {renderIcon(category.icon, category.color)}
          {getCategoryString(val)}
        </Space>
      );
    },
    ...props,
  };
}
export function getPaymentAccountCol(props: ColumnsType) {
  return {
    title: '交易账号',
    dataIndex: 'payment_account',
    width: 100,
    ...props,
  };
}