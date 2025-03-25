import { Modal, Button } from 'antd';
import React, { useState } from 'react';
import AdvancedRuleModal from './advancedRuleModal';
import { AdvancedRule } from 'src/main/sqlite3/advance-rules';
function AdvancedNewBtn(props: { refresh?: () => void }) {
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState<AdvancedRule>();
  return (
    <>
      <Button
        type="primary"
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
        新增规则
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
