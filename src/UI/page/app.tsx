import React   from "react";
import {Layout, Menu, Tabs} from "antd";
import KeepAlive, {AliveScope} from "react-activation";
import { useNavigate } from "react-router-dom";
import Home from "./home";
import Accounting from "./accounting";
import Setting from "./setting";
import Upload from "./upload";

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
    { key: 'home', icon: <HomeOutlined />, label: '首页' },
    { key: 'accounting', icon: <FormOutlined /> , label: '记账' },
    { key: 'upload', icon: <CloudUploadOutlined />, label: '导入' },
    { key: 'setting', icon: <SettingOutlined />, label: '设置' },
];
const { Header, Content, Footer, Sider } = Layout;

function App(props: any): JSX.Element {
    const [activeKey, setActiveKey] = React.useState('home');
    return (
        <Layout
            style={{
                minHeight: '100%',
                overflow: 'hidden',
            }}>

            <Sider
                collapsed={true}

            >
                <Menu
                    onClick={({key})=>{
                        setActiveKey(key)
                    }}
                    defaultSelectedKeys={['home']}
                    mode="inline"
                    theme="dark"
                    items={items}
                />
            </Sider>
            <AliveScope>
                <Content className="mercury-content" style={{height: '100%'}}>
                    {
                        activeKey === 'home' && <KeepAlive>
                            <Home/>
                        </KeepAlive>

                    }
                    {
                        activeKey === 'accounting' && <KeepAlive>
                            <Accounting/>
                        </KeepAlive>
                    }
                    {
                        activeKey === 'upload' && <KeepAlive>
                            <Upload/>
                        </KeepAlive>
                    }
                    {
                        activeKey === 'setting' && <KeepAlive>
                            <Setting/>
                        </KeepAlive>
                    }
                </Content>
            </AliveScope>
        </Layout>
    );
}

export default App;