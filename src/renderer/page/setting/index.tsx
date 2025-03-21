import React from 'react';
import { Card, Tabs, Breadcrumb } from 'antd';
import BasicContent from './basicContent';
import GenerateContent from './generateContent';
import './index.css';
import AdvancedRule from './advancedRule';
function Setting(): JSX.Element {
  return (
    <div className="setting-page">
      <Card size="small" className="mb16">
        <Tabs
          size="small"
          defaultActiveKey="1"
          tabPosition="left"
          className="setting-tabs"
          style={{ height: '100%' }}
        >
          <Tabs.TabPane tab="基础设置" key="1" style={{ height: '100%' }}>
            <BasicContent />
          </Tabs.TabPane>

          {/* <Tabs.TabPane tab="生成规则" key="3" style={{ height: '100%' }}>
            <GenerateContent />
          </Tabs.TabPane> */}
          <Tabs.TabPane tab="高级规则" key="4" style={{ height: '100%' }}>
            <AdvancedRule />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
export default Setting;
