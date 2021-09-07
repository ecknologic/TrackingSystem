import { Layout, Badge } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import Profile from '../../components/Profile';
import useUser from '../../utils/hooks/useUser';
import { SocketContext } from '../../modules/socketContext';
import NotificationDrawer from '../../components/NotificationDrawer';
import { BiboIcon, ChatIconGrey, NotificationIconGrey, SettingIconGrey } from '../../components/SVG_Icons';

const Header = () => {
    const { USERNAME, USERID } = useUser()
    const socket = useContext(SocketContext);
    const [notifDrawerOpen, setNotifDrawerOpen] = useState(false)

    useEffect(() => {
        if (USERID) {
            socket.emit("USER_ONLINE", USERID);
        }

        return () => {
            socket.disconnect();
        }
    }, [USERID])

    return (
        <Layout.Header id='app-header'>
            <div id="logo-container">
                <BiboIcon className='app-logo' />
            </div>
            <div id='nav-container'>
                <div className='nav-icon'>
                    <SettingIconGrey />
                </div>
                <div className='nav-icon'>
                    <NotificationIconGrey onClick={() => setNotifDrawerOpen(true)} />
                    <Badge size="small" className='notification-badge' style={bageStyle} count={33} />
                </div>
                <div className='nav-icon'>
                    <ChatIconGrey />
                </div>
                <Profile userName={USERNAME || 'Bibo User'} />
            </div >
            <NotificationDrawer onClose={() => setNotifDrawerOpen(false)} visible={notifDrawerOpen} />
        </Layout.Header>
    )
}

const bageStyle = {
    position: 'absolute',
    top: '-7px',
    right: '-17px'
}
export default Header