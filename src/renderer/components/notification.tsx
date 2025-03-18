import React from "react";
import { Modal, Alert, Typography, notification, Popover } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { renderRuleContent } from "src/renderer/page/setting/advancedRule";
import { AdvancedRule } from "src/main/sqlite3/advance-rules";
const { Text } = Typography;

interface MessageItem {
  index: number;
  message: string;
  before: string;
  after: string;
  extra?: AdvancedRule;
}

export function changeCategoryModal(messageList: MessageItem[], title: string) {
  const content = messageList.map((item) => {
    const extra = item.extra ? JSON.parse(item.extra.rule) : "";
    const name = item.extra ? item.extra.name : "";
    return (
      <div key={item.index}>
        <span>{item.message}</span>
        <Text delete style={{ width: "50px", marginRight: "10px" }}>
          {item.before}
        </Text>
        <Text type="warning">{item.after}</Text>
        {extra && (
          <Popover title={`规则名称【${name}】`} content={renderRuleContent(extra)}>
            <ExclamationCircleFilled style={{ color: "red", marginLeft: "10px" }} />
          </Popover>
        )}
      </div>
    );
  });

  Modal.info({
    title: title || "替换的记录",
    width: 600,
    okText: "知道了",
    icon: <></>,
    content: (
      <Alert
        style={{}}
        message={<div style={{ maxHeight: "200px", overflow: "auto" }}>{content}</div>}
        type="success"
      />
    ),
  });
}

export function openNotification(messageList: MessageItem[], api: any, title: string) {
  if (messageList.length === 0) {
    return;
  }

  api.open({
    message: title || "替换成功",
    description: `一共替换${messageList.length}条数据，点击查看`,
    showProgress: true,
    pauseOnHover: true,
    onClick: () => {
      changeCategoryModal(messageList, title);
    },
  });
}
