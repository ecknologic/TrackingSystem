import React, { useState } from 'react';
import { Drawer, Layout } from 'antd';
import Profile from '../../components/Profile';
import { getUsername } from '../../utils/constants';
import { ChatIconGrey, NotificationIconGrey, SettingIconGrey } from '../../components/SVG_Icons';
import NotificationDrawer from '../../components/NotificationDrawer';

const Header = () => {
    const userName = getUsername() || 'Bibo User'
    const [notifDrawerOpen, setNotifDrawerOpen] = useState(false)

    return (
        <Layout.Header id='app-header'>
            <div id="logo-container">
                <h1 id='bibo'>Bibo</h1>
                <h1 id='water'>Water</h1>
            </div>
            <div id='nav-container'>
                <SettingIconGrey className='nav-icon' />
                <NotificationIconGrey className='nav-icon' onClick={() => setNotifDrawerOpen(true)} />
                <ChatIconGrey className='nav-icon' />
                <Profile userName={userName} />
            </div >
            <NotificationDrawer onClose={() => setNotifDrawerOpen(false)} visible={notifDrawerOpen} />
        </Layout.Header>
    )
}

export default Header