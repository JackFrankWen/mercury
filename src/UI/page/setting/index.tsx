import React   from "react";
import {Card, Tabs, Breadcrumb} from "antd";
import BasicContent from "./basicContent";
import MatchContent from "./matchContent";
import './index.css'
function Setting(): JSX.Element {
    return (
        <div className="setting-page" style={{height: '100vh', overflow: 'hidden'}}>
            <Card style={{height: '100%'}}>
                <Tabs
                    defaultActiveKey="1"
                    tabPosition="left"
                    className="setting-tabs"
                    style={{height: '100%'}}
                >
                    <Tabs.TabPane tab="基础设置" key="1" style={{height: '100%'}}>
                        <BasicContent />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="规则设置" key="2" className="overflow-scroll" style={{height: '100%'}}   >
                        <MatchContent />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Tab 3" key="3" style={{height: '100%'}}>
                        Content of Tab Pane 3
                    </Tabs.TabPane>
                </Tabs>
            </Card>
        </div>
    );
}
export default Setting;