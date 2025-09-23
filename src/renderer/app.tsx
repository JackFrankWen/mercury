import React, { useState, useEffect } from 'react';
import { Layout, ConfigProvider, Menu, Flex, Tooltip } from "antd";
import { AliveScope, KeepAlive } from "react-activation";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import zhCN from "antd/locale/zh_CN";
import emitter from "./events";
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
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import "dayjs/locale/zh-cn";
// import dayjs from "dayjs";

// dayjs.locale('zh-cn');

type MenuItem = Required<MenuProps>["items"][number];

const { Header, Content, Footer, Sider } = Layout;

// 主应用组件包装
function App(props: any): JSX.Element {
  const [environment, setEnvironment] = useState<'production' | 'test'>('production');

  // 获取当前环境配置
  useEffect(() => {
    const getEnvironment = async () => {
      try {
        const env = await window.mercury.store.getEnvironment();
        setEnvironment(env as 'production' | 'test');
      } catch (error) {
        console.error('Failed to get environment:', error);
      }
    };

    getEnvironment();

    // Subscribe to environment change events
    const handleEnvChange = (env: 'production' | 'test') => {
      setEnvironment(env);
      // 刷新页面
      window.location.reload();
    };

    emitter.on('environmentChange', handleEnvChange);

    // Clean up subscription when component unmounts
    return () => {
      emitter.off('environmentChange', handleEnvChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <ConfigProvider
        locale={zhCN}
        theme={{
          token: {
            colorPrimary: "#eccf10",
            colorInfo: "#eccf10",
          },
          components: {
            Calendar: {},
            Menu: {
              iconSize: 16,
              activeBarBorderWidth: 0,
              itemBorderRadius: 10,
              itemMarginInline: 2,
              itemMarginBlock: 12,
            },
            Collapse: {
              contentPadding: "0 0",
            },
            Layout: {},
            Card: {
              // paddingLG: 12,
            },
          },
        }}
      >
        <AliveScope>
          <MainLayout environment={environment} />
        </AliveScope>
      </ConfigProvider>
    </BrowserRouter>
  );
}

// 主布局组件
function MainLayout({ environment }: { environment: 'production' | 'test' }): JSX.Element {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pathToKey: Record<string, string> = {
    "/": "home",
    "/accounting": "accounting",
    "/upload": "upload",
    "/setting": "setting",
  };
  const currentPath = location.pathname;
  const activeKey = pathToKey[currentPath] || "home";

  const items: MenuItem[] = [
    { key: "home", icon: <HomeOutlined />, label: "首页" },
    { key: "accounting", icon: <FormOutlined />, label: "记账" },
    { key: "upload", icon: <CloudUploadOutlined />, label: "导入" },
    { key: "setting", icon: <SettingOutlined />, label: "设置" },
  ];

  // 根据环境设置 Sider 样式
  const siderStyle = {
    // 生产环境：白色，测试环境：蓝色
    backgroundColor: environment === 'production' ? '#ffffff' : '#1890ff',
    zIndex: 15,
    // 根据背景色调整文字颜色
    color: environment === 'production' ? 'rgba(0, 0, 0, 0.85)' : '#ffffff',
  };



  return (
    <Layout className="mercury-layout">
      <Sider theme="light"
        style={siderStyle}
        collapsed={true} className="mercury-sider" collapsedWidth={70}>
        <Flex align="center" vertical>
          <div className="mercury-logo">
            <img src={icon} alt="logo" />
          </div>

          <Menu
            mode="vertical"
            style={siderStyle}
            onClick={({ key }) => {
              const routes: Record<string, string> = {
                home: "/",
                accounting: "/accounting",
                upload: "/upload",
                setting: "/setting",
              };
              navigate(routes[key]);
            }}
            selectedKeys={[activeKey]}
            theme="light"
            items={items}
          />
        </Flex>

        <div
          className="mercury-reload"
          onClick={() => {
            window.location.reload();
          }}
        >
          <Tooltip title="刷新" placement="right">
            <ReloadOutlined />
          </Tooltip>
        </div>
      </Sider>

      <Content className="mercury-content">
        <Routes>
          <Route
            path="/"
            element={
              <KeepAlive id="home-cache" name="home">
                <Home />
              </KeepAlive>
            }
          />
          <Route
            path="/accounting"
            element={
              <KeepAlive id="accounting-cache" name="accounting">
                <Accounting />
              </KeepAlive>
            }
          />
          <Route
            path="/setting"
            element={
              <KeepAlive id="setting-cache" name="setting">
                <Setting />
              </KeepAlive>
            }
          />
          <Route path="/upload" element={<Upload />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;
