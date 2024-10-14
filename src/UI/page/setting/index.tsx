import React   from "react";
import {Card, Tabs} from "antd";
import BasicContent from "./basicContent";

function Setting(): JSX.Element {
    return (
        <div>
            <h1>设置</h1>
            <Card>
                <Tabs
                    defaultActiveKey="1"
                    tabPosition="left"
                >
                    <Tabs.TabPane tab="基础设置" key="1">
                        <BasicContent />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Tab 2" key="2">
                        Content of Tab Pane 2
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Tab 3" key="3">
                        Content of Tab Pane 3
                    </Tabs.TabPane>
                </Tabs>
            </Card>
        </div>
    );
}
export default Setting;