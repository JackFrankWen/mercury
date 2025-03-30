import React, { useEffect, useState } from 'react';
import { List, Button, Popconfirm, message, Typography, Empty } from 'antd';
import { AlipayCircleOutlined, WechatOutlined, DeleteOutlined } from '@ant-design/icons';
import './uploadFileList.css';
import { useFresh } from 'src/renderer/components/useFresh';

const { Title } = Typography;

// This interface matches the format in preload.ts
interface UploadFile {
  fileName: string;
  fileType: 'wechat' | 'alipay';
  createTime: string;
}

export const UploadFileList: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFileList = async () => {
    setLoading(true);
    try {
      const files = await window.mercury.store.getUploadFileList();
      console.log(files, 'files');
      setFileList(files || []);
    } catch (error) {
      console.error('Failed to fetch upload file list:', error);
      message.error('获取导入文件列表失败');
    } finally {
      setLoading(false);
    }
  };

  useFresh(() => {
    fetchFileList();
  }, [], 'fileList');

  const handleRemoveFile = async (file: UploadFile) => {
    try {
      const updatedList = fileList.filter(item => item.fileName !== file.fileName);
      await window.mercury.store.setUploadFileList(updatedList);
      setFileList(updatedList);
      message.success('文件删除成功');
    } catch (error) {
      console.error('Failed to remove file:', error);
      message.error('删除文件失败');
    }
  };

  const handleRemoveAll = async () => {
    try {
      await window.mercury.store.setUploadFileList([]);
      setFileList([]);
      message.success('所有文件已删除');
    } catch (error) {
      console.error('Failed to remove all files:', error);
      message.error('删除所有文件失败');
    }
  };

  const getFileIcon = (fileType: string) => {
    return fileType === 'alipay' ? (
      <AlipayCircleOutlined style={{ color: '#1677FF', fontSize: '28px' }} />
    ) : (
      <WechatOutlined style={{ color: '#07C160', fontSize: '28px' }} />
    );
  };

  return (
    <div className="upload-file-list-container">
      <div className="upload-file-header">
        <Title level={4}>已导入文件列表</Title>
        <Popconfirm
          title="确认删除所有文件？"
          description="此操作不可恢复！"
          onConfirm={handleRemoveAll}
          okText="是"
          cancelText="否"
          disabled={fileList.length === 0}
        >
          <Button type="primary" danger icon={<DeleteOutlined />} disabled={fileList.length === 0}>
            全部删除
          </Button>
        </Popconfirm>
      </div>

      {fileList.length > 0 ? (
        <List
          loading={loading}
          itemLayout="horizontal"
          style={{ overflow: 'auto', height: '500px' }}
          dataSource={fileList}
          pagination={{
            pageSize: 10,
            align: 'center',
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
          }}
          renderItem={(item, index) => (
            <List.Item
              key={`${item.fileName}-${index}`}
              actions={[
                <Popconfirm
                  key="delete-action"
                  title="确认删除该文件？"
                  onConfirm={() => handleRemoveFile(item)}
                  okText="是"
                  cancelText="否"
                >
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={getFileIcon(item.fileType)}
                title={item.fileName}
                description={`导入时间：${item.createTime}`}
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty description="暂无导入文件" />
      )}
    </div>
  );
};
