import React from "react";
import { Layout, ConfigProvider, Menu } from "antd";
import KeepAlive, { AliveScope } from "react-activation";
import { useNavigate } from "react-router-dom";
import Home from "./page/home";
import Accounting from "./page/accounting";
import Setting from "./page/setting";
import Upload from "./page/upload";


import {
    AccountBookOutlined,
    SettingOutlined,
    FormOutlined,
    CloudUploadOutlined,
    HomeOutlined,
    ReadOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
type MenuItem = Required<MenuProps>['items'][number];



const items: MenuItem[] = [
    { key: 'home', icon: <ReadOutlined  />, label: '首页' },
    { key: 'accounting', icon: <FormOutlined />, label: '记账' },
    { key: 'upload', icon: <CloudUploadOutlined />, label: '导入' },
    { key: 'setting', icon: <SettingOutlined />, label: '设置' },
];
const { Header, Content, Footer, Sider } = Layout;


function App(props: any): JSX.Element {
    const [activeKey, setActiveKey] = React.useState('home');
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#eccf10",
                    colorInfo: "#eccf10"
                },
                components: {
                    Menu: {
                        iconSize: 16,
                        activeBarBorderWidth: 0,
                        itemBorderRadius: 10,
                        itemMarginInline:2,
                    },
                    Collapse: {
                        /* 这里是你的组件 token */
                        contentPadding: 0,
                      },
                    Layout: {
                    },
                    Card: {
                        // paddingLG: 12,
                    },

                },

            }}
        >
            <Layout
                className="mercury-layout"
                >
                <Sider
                    theme="light"
                    collapsed={true}
                    className="mercury-sider"
                    collapsedWidth={70}
                > 
                    <Menu
                    mode="vertical"
                    onClick={({key})=>{
                        setActiveKey(key)
                    }}
                    defaultSelectedKeys={['home']}
                    theme="light"
                    items={items}
                />
                </Sider>

                <Content className="mercury-content">
                    <AliveScope>
                        {
                            activeKey === 'home' && <KeepAlive>
                                <Home />
                            </KeepAlive>

                        }
                        {
                            activeKey === 'accounting' && <KeepAlive>
                                <Accounting />
                            </KeepAlive>
                        }

                        {
                            activeKey === 'setting' && <KeepAlive>
                                <Setting />
                            </KeepAlive>
                        }
                    </AliveScope>
                    {
                        activeKey === 'upload' && <KeepAlive>
                            <Upload />
                        </KeepAlive>
                    }
                </Content>
            </Layout>
        </ConfigProvider>
    );
}

export default App;