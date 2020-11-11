import React from 'react'
import { Scrollbars } from 'react-custom-scrollbars';
import { Layout, Menu, Breadcrumb } from 'antd';
import dashboardIcon from '../assets/images/ic-manage-users.svg';
import dashboardIcon12 from '../assets/images/ic-manage-accounts.svg';
import dashboardIcon13 from '../assets/images/ic-chat.svg';
import dashboardIcon14 from '../assets/images/ic-cettings.svg';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;


const LayoutPage = (props) => {
    return (
        <div>
            <Layout>
                <Header className="header">
                    <div className="logo">
                        <h2><span className="bibotext">Bibo</span> <span>Water</span></h2>
                    </div>
                    <Menu className="TopNavbar" theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                        <Menu.Item key="1"><img src={dashboardIcon14} alt="contest-cover"/></Menu.Item>
                        <Menu.Item key="2"><img src={dashboardIcon13} alt="contest-cover"/></Menu.Item>
                        <Menu.Item key="3"><img src={dashboardIcon13} alt="contest-cover"/></Menu.Item>
                    </Menu>
                </Header>
                <Layout>
                    <Sider width={200} style={{ height: '89.8vh' }} className="sider_bar_component site-layout-background">
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{ height: '100%', borderRight: 0 }}
                        >
                            <Menu.Item key="1" key="sub1"><span></span> <span>Dashboard</span></Menu.Item>
                            <Menu.Item key="2" key="sub2"><span><img src={dashboardIcon12} alt="contest-cover"/></span> <span>Manage Stock</span></Menu.Item>
                            <Menu.Item key="3" key="sub3"><span><img src={dashboardIcon} alt="contest-cover"/></span> <span>Manage Routes</span></Menu.Item>
                            <Menu.Item key="4" key="sub4"><span></span> <span>Reports</span></Menu.Item>
                            {/* <SubMenu key="sub1" icon={<UserOutlined />} title="Dashboard">
                                <Menu.Item key="1">option1</Menu.Item>
                                <Menu.Item key="2">option2</Menu.Item>
                                <Menu.Item key="3">option3</Menu.Item>
                                <Menu.Item key="4">option4</Menu.Item>
                            </SubMenu> */}
                            {/* <SubMenu key="sub2" icon={<LaptopOutlined />} title="Manage Stock">
                                <Menu.Item key="5">option5</Menu.Item>
                                <Menu.Item key="6">option6</Menu.Item>
                                <Menu.Item key="7">option7</Menu.Item>
                                <Menu.Item key="8">option8</Menu.Item>
                            </SubMenu> */}
                            {/* <SubMenu key="sub3" icon={<NotificationOutlined />} title="Manage Stock">
                                <Menu.Item key="9">option9</Menu.Item>
                                <Menu.Item key="10">option10</Menu.Item>
                                <Menu.Item key="11">option11</Menu.Item>
                                <Menu.Item key="12">option12</Menu.Item>
                            </SubMenu> */}

                            {/* <SubMenu key="sub4" icon={<NotificationOutlined />} title="Reports">
                                <Menu.Item key="13">option9</Menu.Item>
                                <Menu.Item key="14">option10</Menu.Item>
                                <Menu.Item key="15">option11</Menu.Item>
                                <Menu.Item key="16">option12</Menu.Item>
                            </SubMenu> */}
                        </Menu>
                    </Sider>
                    <Layout style={{ padding: '0 0px 0px' }}>
                        <Scrollbars style={{ width: '100%', height: '90vh' }}>
                            <Content
                                className="site-layout-background"
                                style={{
                                    margin: 0,
                                    minHeight: 280,
                                    backgroundColor: '#fafafb'
                                }}
                            >
                                <div>
                                    {props.children}
                                </div>

                            </Content>
                        </Scrollbars>
                    </Layout>
                </Layout>
            </Layout>
        </div>
    );
}

export default LayoutPage;