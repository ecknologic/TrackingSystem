import React from 'react'
import { Layout } from 'antd';
import { useLocation } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars-2';
import Header from './header';
import SideMenu from './SideMenu';
import '../../sass/pageLayout.scss'

const PageLayout = ({ children }) => {
    const { pathname } = useLocation()

    return (
        <Layout id='app-container'>
            <Header />
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
const { Content, Sider } = Layout;
export default PageLayout;