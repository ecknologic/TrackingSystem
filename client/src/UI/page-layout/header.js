import { Layout } from 'antd';
import React, { useState } from 'react';
import Profile from '../../components/Profile';
import { getUsername } from '../../utils/constants';
import { BiboIcon, ChatIconGrey, NotificationIconGrey, SettingIconGrey } from '../../components/SVG_Icons';
import NotificationDrawer from '../../components/NotificationDrawer';

const Header = () => {
    const userName = getUsername() || 'Bibo User'
    const [notifDrawerOpen, setNotifDrawerOpen] = useState(false)

    return (
        <Layout.Header id='app-header'>
            <div id="logo-container">
                <BiboIcon className='app-logo' />
            </div>
            <div id='nav-container'>
                {/* Below 3 lines should be: uncommented */}
                {/* <SettingIconGrey className='nav-icon' /> */}
                {/* <NotificationIconGrey className='nav-icon' onClick={() => setNotifDrawerOpen(true)} /> */}
                {/* <ChatIconGrey className='nav-icon' /> */}
                <Profile userName={userName} />
            </div >
            <NotificationDrawer onClose={() => setNotifDrawerOpen(false)} visible={notifDrawerOpen} />
        </Layout.Header>
    )
}

export default Header