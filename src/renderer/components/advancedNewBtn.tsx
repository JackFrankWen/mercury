import { Modal, Button } from 'antd';
import React, { useState } from 'react';
import AdvancedRuleModal from './advancedRuleModal';
import { AdvancedRule } from 'src/main/sqlite3/advance-rules';
import { PlusOutlined } from '@ant-design/icons';
function AdvancedNewBtn(props: { refresh?: () => void }) {
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState<AdvancedRule>();
  return (
    <>
      <Button
        type="primary" 
        icon={<PlusOutlined />} 
        shape="round"
        style={{ 
          background: '#1890ff', 
          boxShadow: '0 2px 6px rgba(24, 144, 255, 0.3)'
        }}
        onClick={() => {
          setVisible(true);
          setRecord({
            active: 1,
            consumer: '',
            name: '',
            priority: 1,
            tag: '',
            rule: '',
            category: '',
          });
        }}
      >
        规则
      </Button>
      {visible && (
        <Modal
          title="新建规则"
          open={visible}
          footer={null}
          width={700}
          onCancel={() => {
            setVisible(false);
          }}
        >
          <AdvancedRuleModal
            data={record}
            refresh={props.refresh}
            onCancel={() => setVisible(false)}
          />
        </Modal>
      )}
    </>
  );
}

export default AdvancedNewBtn;
