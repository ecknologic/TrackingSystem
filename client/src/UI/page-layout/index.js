import React from 'react'
import { Layout } from 'antd';
import { useLocation } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import SideMenu from './SideMenu';
import { ChatIconGrey, NotificationIconGrey, SettingIconGrey } from '../../components/SVG_Icons';
import '../../sass/pageLayout.scss'

const PageLayout = ({ children }) => {
    const { pathname } = useLocation()

    return (
        <Layout id='app-container'>
            <Header id='app-header'>
                <div id="logo-container">
                    <h1 id='bibo'>Bibo</h1>
                    <h1 id='water'>Water</h1>
                </div>
                <div id='nav-container'>
                    <SettingIconGrey />
                    <NotificationIconGrey />
                    <ChatIconGrey />
                </div >
            </Header>
            <Layout id='app-content'>
                <Sider width='16em' className='app-sider'>
                    <SideMenu />
                </Sider>
                <Content key={pathname}>
                    <Scrollbars autoHide id='scroll-view'>
                        {children}
                    </Scrollbars>
                </Content>
            </Layout>
        </Layout>
    );
}

const { Header, Content, Sider } = Layout;
export default PageLayout;