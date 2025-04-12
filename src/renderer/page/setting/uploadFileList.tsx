import React, { useEffect, useState } from 'react';
import { List, Button, Modal, message, Typography, Empty } from 'antd';
import { AlipayCircleOutlined, WechatOutlined, DeleteOutlined } from '@ant-design/icons';
import './uploadFileList.css';
import { useFresh } from 'src/renderer/components/useFresh';
import emitter from 'src/renderer/events';

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
      // Sort files by createTime in descending order
      const sortedFiles = (files || []).sort((a, b) => 
        new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
      );
      setFileList(sortedFiles);
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
      const result = await window.mercury.api.deleteAllTransactions({
        upload_file_name: file.fileName,
        all_flow_type: true,
      });
      if (result.code === 200) {
        emitter.emit('refresh', 'transaction');
        emitter.emit('refresh', 'fileList');
        message.success(`成功删除 ${result.message || 0} 条交易记录`);
      } else {
        message.error(result.message);
      }
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
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          disabled={fileList.length === 0}
          onClick={() => {
            Modal.confirm({
              title: '确认删除所有文件？',
              content: '保留交易数据，可以重新导入文件！',
              okText: '是',
              cancelText: '否',
              onOk: handleRemoveAll
            });
          }}
        >
          全部删除
        </Button>
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
                <Button
                  key="delete-action"
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    Modal.confirm({
                      title: '确认删除该文件，并且删除上传的交易数据？',
                      content: '删除后无法恢复！',
                      okText: '是',
                      cancelText: '否',
                      onOk: () => handleRemoveFile(item)
                    });
                  }}
                />
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
