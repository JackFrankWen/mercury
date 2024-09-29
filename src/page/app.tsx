import React   from "react";
import {Layout} from "antd";
import {Navigate, Outlet} from "react-router-dom";

import {
    AppstoreOutlined,
    ContainerOutlined,
    DesktopOutlined,
    MailOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    { key: '1', icon: <PieChartOutlined />, label: 'Option 1' },
    { key: '2', icon: <DesktopOutlined />, label: 'Option 2' },
    { key: '3', icon: <ContainerOutlined />, label: 'Option 3' },

];
const { Header, Content, Footer, Sider } = Layout;

function App(props: any): JSX.Element {
    return (
        <Layout>
            <Navigate to="/home" />

            <Sider collapsed={true}>
                <Menu
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    theme="dark"
                    items={items}
                />
            </Sider>
            <Content>
              <Outlet />
            </Content>
        </Layout>
    );
}

export default App;