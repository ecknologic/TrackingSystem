import React from 'react'
import { Layout } from 'antd';
import { useLocation } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars-2';
import SideMenu from './SideMenu';
import Profile from '../../components/Profile';
import { getRoleId } from '../../utils/constants';
import { getRoleLabel } from '../../utils/Functions';
import { ChatIconGrey, NotificationIconGrey, SettingIconGrey } from '../../components/SVG_Icons';
import '../../sass/pageLayout.scss'

const PageLayout = ({ children }) => {
    const { pathname } = useLocation()
    const roleName = getRoleLabel(getRoleId()) || 'Bibo User'

    return (
        <Layout id='app-container'>
            <Header id='app-header'>
                <div id="logo-container">
                    <h1 id='bibo'>Bibo</h1>
                    <h1 id='water'>Water</h1>
                </div>
                <div id='nav-container'>
                    <SettingIconGrey className='nav-icon' />
                    <NotificationIconGrey className='nav-icon' />
                    <ChatIconGrey className='nav-icon' />
                    <Profile name={roleName} />
                </div >
            </Header>
            <Layout id='app-content'>
                <Sider width='16em' className='app-sider'>
                    <Scrollbars autoHide renderThumbVertical={Thumb}>
                        <SideMenu />
                    </Scrollbars>
                </Sider>
                <Content key={pathname}>
                    <Scrollbars autoHide id='scroll-view' renderThumbVertical={Thumb}>
                        <div id='content'>{children}</div>
                    </Scrollbars>
                </Content>
            </Layout>
        </Layout>
    );
}

const Thumb = (props) => <div {...props} className="thumb-vertical" />
const { Header, Content, Sider } = Layout;
export default PageLayout;