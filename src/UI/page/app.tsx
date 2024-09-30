import React   from "react";
import {Layout, Menu} from "antd";
import {Navigate, Outlet} from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
    { key: '/', icon: <HomeOutlined />, label: '首页' },
    { key: '/accounting', icon: <FormOutlined /> , label: '记账' },
    { key: '/upload', icon: <CloudUploadOutlined />, label: '导入' },
    { key: '/setting', icon: <SettingOutlined />, label: '设置' },
];
const { Header, Content, Footer, Sider } = Layout;

function App(props: any): JSX.Element {
    const jumpTo = useNavigate()
    return (
        <Layout
            style={{
                minHeight: '100%',
            }}>
            {/*<Navigate to="/home" />*/}

            <Sider >
                <Menu
                    onClick={({key})=>{
                        jumpTo(key)
                    }}
                    defaultSelectedKeys={['/']}
                    mode="inline"
                    theme="dark"
                    items={items}
                />
            </Sider>
            <Content className="mercury-content">
              <Outlet />
            </Content>
        </Layout>
    );
}

export default App;