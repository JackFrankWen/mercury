import { Modal, Alert, Typography, notification } from 'antd';
const { Text } = Typography;

interface MessageItem {
  index: number;
  message: string;
  before: string;
  after: string;
}

export function changeCategoryModal(messageList: MessageItem[]) {
  const content = messageList.map(item => {
    return (
      <div key={item.index}>
        <span>{item.message}</span>
        <Text delete style={{ width: '50px', marginRight: '10px' }}>{item.before}</Text>
        <Text type="warning">{item.after}</Text>
      </div>
    );
  });

  Modal.info({
    title: '替换的记录',
    width: 600,
    okText: '知道了',
    icon: <></>,
    content: <Alert style={{}} message={<div style={{ maxHeight: '200px', overflow: 'auto' }}>{content}</div>} type="success" />,
  });
}

export function openNotification(messageList: MessageItem[], api: any) {
  if (messageList.length === 0) {
    return;
  }

  api.open({
    message: '替换成功',
    description: `一共替换${messageList.length}条数据，点击查看`,
    showProgress: true,
    pauseOnHover: true,
    onClick: () => {
      changeCategoryModal(messageList);
    },
  });
}