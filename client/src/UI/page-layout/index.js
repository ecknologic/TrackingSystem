import React from 'react'
import { Layout } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import dashboardIcon13 from '../../assets/images/ic-chat.svg';
import dashboardIcon14 from '../../assets/images/ic-cettings.svg';
import '../../sass/pageLayout.scss'
import SideMenu from './SideMenu';

const { Header, Content, Sider } = Layout;

const PageLayout = ({ children }) => {
    return (
        <Layout id='app-container'>
            <Header id='app-header'>
                <div id="logo-container">
                    <h1 id='bibo'>Bibo</h1>
                    <h1 id='water'>Water</h1>
                </div>
                <div id='nav-container'>
                    <img src={dashboardIcon14} alt="" />
                    <img src={dashboardIcon13} alt="" />
                    <img src={dashboardIcon13} alt="" />
                </div >
            </Header>
            <Layout id='app-content'>
                <Sider width='16em' className='app-sider'>
                    <SideMenu />
                </Sider>
                <Content>
                    <Scrollbars autoHide>
                        {children}
                    </Scrollbars>
                </Content>
            </Layout>
        </Layout>
    );
}

export default PageLayout;