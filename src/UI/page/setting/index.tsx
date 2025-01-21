import React   from "react";
import {Card, Tabs, Breadcrumb} from "antd";
import BasicContent from "./basicContent";
import MatchContent from "./matchContent";

function Setting(): JSX.Element {
    return (
        <div>
           <Breadcrumb items={[{
               title: '设置',
           }]} />
            <Card>
                <Tabs
                    defaultActiveKey="1"
                    tabPosition="left"
                >
                    <Tabs.TabPane tab="基础设置" key="1">
                        <BasicContent />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="规则设置" key="2">
                        <MatchContent />
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