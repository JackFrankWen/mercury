import React from "react";
import { Layout, ConfigProvider, Menu, Flex, Tooltip } from "antd";
import KeepAlive, { AliveScope } from "react-activation";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Home from "./page/home";
import Accounting from "./page/accounting";
import Setting from "./page/setting";
import Upload from "./page/upload";
import icon from "../../build/icon.png";

import {
    AccountBookOutlined,
    SettingOutlined,
    FormOutlined,
    CloudUploadOutlined,
    HomeOutlined,
    ReadOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
type MenuItem = Required<MenuProps>['items'][number];

const { Header, Content, Footer, Sider } = Layout;

// 主应用组件包装
function App(props: any): JSX.Element {
    return (
        <BrowserRouter>
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
                            itemMarginInline: 2,
                            itemMarginBlock: 12
                        },
                        Collapse: {
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
                <MainLayout />
            </ConfigProvider>
        </BrowserRouter>
    );
}

// 主布局组件
function MainLayout(): JSX.Element {
    const navigate = useNavigate();
    const location = useLocation();
    const pathToKey: Record<string, string> = {
        '/': 'home',
        '/accounting': 'accounting',
        '/upload': 'upload',
        '/setting': 'setting'
    };
    const currentPath = location.pathname;
    const activeKey = pathToKey[currentPath] || 'home';

    const items: MenuItem[] = [
        { key: 'home', icon: <ReadOutlined />, label: '首页' },
        { key: 'accounting', icon: <FormOutlined />, label: '记账' },
        { key: 'upload', icon: <CloudUploadOutlined />, label: '导入' },
        { key: 'setting', icon: <SettingOutlined />, label: '设置' },
    ];

    return (
        <Layout className="mercury-layout">
            <Sider
                theme="light"
                collapsed={true}
                className="mercury-sider"
                collapsedWidth={70}
            >
                <Flex align="center" vertical>
                    <div className="mercury-logo">
                        <img src={icon} alt="logo" />
                    </div>
                    
                    <Menu
                        mode="vertical"
                        onClick={({key}) => {
                            const routes: Record<string, string> = {
                                'home': '/',
                                'accounting': '/accounting',
                                'upload': '/upload',
                                'setting': '/setting'
                            };
                            navigate(routes[key]);
                        }}
                        selectedKeys={[activeKey]}
                        theme="light"
                        items={items}
                    />
                </Flex>
                
                <div className="mercury-reload" onClick={() => {
                    window.location.reload();
                }}>
                    <Tooltip title="刷新" placement="right">
                        <ReloadOutlined />
                    </Tooltip>
                </div>
            </Sider>

            <Content className="mercury-content">
                <AliveScope>
                    <Routes>
                        <Route path="/" element={
                            <KeepAlive name="home" cacheKey="home-cache">
                                <Home />
                            </KeepAlive>
                        } />
                        <Route path="/accounting" element={
                            <KeepAlive name="accounting" cacheKey="accounting-cache">
                                <Accounting />
                            </KeepAlive>
                        } />
                        <Route path="/setting" element={
                            <KeepAlive name="setting" cacheKey="setting-cache">
                                <Setting />
                            </KeepAlive>
                        } />
                        <Route path="/upload" element={
                            <Upload />
                        } />
                        <Route path="*" element={<navigate to="/" replace />} />
                    </Routes>
                </AliveScope>
            </Content>
        </Layout>
    );
}

export default App;