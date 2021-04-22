import { Layout } from 'antd';
import React, { useState } from 'react';
import Profile from '../../components/Profile';
import useUser from '../../utils/hooks/useUser';
import NotificationDrawer from '../../components/NotificationDrawer';
import { BiboIcon, ChatIconGrey, NotificationIconGrey, SettingIconGrey } from '../../components/SVG_Icons';

const Header = () => {
    const { USERNAME } = useUser()
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
                <Profile userName={USERNAME} />
            </div >
            <NotificationDrawer onClose={() => setNotifDrawerOpen(false)} visible={notifDrawerOpen} />
        </Layout.Header>
    )
}

export default Header