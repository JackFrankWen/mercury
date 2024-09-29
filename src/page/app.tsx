import React   from "react";
import {Layout, Menu} from "antd";
import {Navigate, Outlet} from "react-router-dom";

import {
    AccountBookOutlined,
SettingOutlined,
FormOutlined,
    CloudUploadOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    { key: '1', icon: <HomeOutlined />, label: '首页' },
    { key: '2', icon: <FormOutlined /> , label: '记账' },
    { key: '3', icon: <CloudUploadOutlined />, label: '导入' },
    { key: '4', icon: <SettingOutlined />, label: '设置' },

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