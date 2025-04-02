import React from 'react';
import { Modal, Alert, Typography, notification, Popover } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { renderRuleContent } from 'src/renderer/page/setting/advancedRule';
import { AdvancedRule } from 'src/main/sqlite3/advance-rules';
const { Text, Paragraph } = Typography;

export interface MessageItem {
  index: number;
  message: string;
  changeContent: {
    before: string;
    after: string;
  }[];
  extra?: AdvancedRule;
}

export function changeCategoryModal(messageList: MessageItem[], title: string) {
  // 先保存原始记录数量
  const totalCount = messageList.length;

  // 如果记录超过200条，则只显示200条
  const displayedMessages = messageList.length > 200 ? messageList.slice(0, 200) : messageList;

  const content = displayedMessages.map(item => {
    const extra = item.extra ? JSON.parse(item.extra.rule) : '';
    const name = item.extra ? item.extra.name : '';

    const changeContent = item.changeContent || [];
    console.log(item, changeContent, 'changeContent======');

    return (
      <Typography key={item.index}>
        <Paragraph>{item.message}</Paragraph>
        <Paragraph>
          <pre>
            {changeContent.map(({ before, after }, index) => {
              return (
                <>
                  {index > 0 && <Text>{'、'}</Text>}
                  <Text>『{before}』</Text>
                  <Text>变成</Text>

                  <Text mark>『{after}』</Text>
                </>
              );
            })}
            {extra && (
              <Popover title={`规则名称【${name}】`} content={renderRuleContent(extra)}>
                <ExclamationCircleFilled style={{ color: 'red', marginLeft: '10px' }} />
              </Popover>
            )}
          </pre>
        </Paragraph>
      </Typography>
    );
  });

  Modal.info({
    title: title || '替换的记录',
    width: 600,
    okText: '知道了',
    maskClosable: true,
    icon: <></>,
    content: (
      <>
        {totalCount > 200 && (
          <Alert
            style={{ marginBottom: '10px' }}
            message={`共有 ${totalCount} 条记录，限制显示前 200 条`}
            type="warning"
            showIcon
          />
        )}
        <Alert
          style={{}}
          message={<div style={{ maxHeight: '400px', overflow: 'auto' }}>{content}</div>}
          type="success"
        />
      </>
    ),
  });
}

export function openNotification(messageList: MessageItem[], api: any, title: string) {
  if (messageList.length === 0) {
    return;
  }

  api.open({
    message: title || '替换成功',
    description: `共替换${messageList.length}条交易，点击查看`,
    showProgress: true,
    pauseOnHover: true,
    onClick: () => {
      changeCategoryModal(messageList, title);
    },
  });
}
