import axios from 'axios';
import { Layout, Badge, notification } from 'antd';
import parse from 'html-react-parser';
import { useHistory } from 'react-router';
import { ClockCircleOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { http } from '../../modules/http';
import Profile from '../../components/Profile';
import useUser from '../../utils/hooks/useUser';
import { SocketContext } from '../../modules/socketContext';
import NotificationDrawer from '../../components/NotificationDrawer';
import { deepClone, playNotificationSound } from '../../utils/Functions';
import { BiboIcon, ChatIconGrey, CrossIconDark, NotificationIconGrey, SettingIconGrey } from '../../components/SVG_Icons';

const Header = () => {
    const history = useHistory()
    const { USERNAME, USERID } = useUser()
    const socket = useContext(SocketContext);
    const [loading, setLoading] = useState(true)
    const [activeN, setActiveN] = useState(null)
    const [unreadCount, setUnreadCount] = useState(0)
    const [notifications, setNotifications] = useState([])
    const [drawerOpen, setDrawerOpen] = useState(false)
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getNotifications()

        socket.on(`RECEIVE_NOTIFICATION_${USERID}`, (data) => {
            setUnreadCount(prev => prev + 1)
            setNotifications(prev => [data, ...prev])
            setActiveN(data)
        })
    }, [])

    useEffect(() => {
        if (activeN) {
            playNotificationSound()
            showNotification(activeN)
        }
    }, [activeN])

    const getNotifications = async () => {
        const url = 'notifications/getNotifications'
        try {
            const { data, unreadCount } = await http.GET(axios, url, config)
            setLoading(false)
            setNotifications(data)
            setUnreadCount(unreadCount)
        } catch (error) { }
    }

    const handleReadNotification = async (id) => {
        const url = `notifications/updateNotificationStatus/${id}`
        try {
            await http.PUT(axios, url, null, config)
            setUnreadCount(prev => prev - 1)
            optimisticRead(id)
        } catch (error) { }
    }

    const handleNavigation = ({ notificationId, navigationUrl, isRead }) => {
        setDrawerOpen(false)
        !isRead && handleReadNotification(notificationId)
        navigationUrl && history.push(navigationUrl)
    }

    const optimisticRead = (id) => {
        let clone = deepClone(notifications);
        const index = clone.findIndex(item => item.notificationId === id)
        clone[index].isRead = 1;
        setNotifications(clone)
    }

    const showNotification = (data) => {
        const { notificationId, title, description, navigationUrl } = data

        notification.open({
            message: title,
            key: notificationId,
            closeIcon: <CrossIconDark />,
            className: 'app-notification',
            placement: 'bottomRight',
            duration: 10,
            description: parse(description),
            onClick: () => handleNotificationClick(data),
            icon: <img src='/favicon.ico' alt='' width={24} />,
            style: { cursor: navigationUrl ? 'pointer' : 'default' }
        })
    }

    const handleNotificationClick = (data) => {
        notification.close(data.notificationId)
        handleNavigation(data)
    }

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
                    <NotificationIconGrey onClick={() => setDrawerOpen(true)} />
                    <Badge
                        size="small"
                        className='notification-badge'
                        style={bageStyle}
                        count={loading ? <ClockCircleOutlined style={circleStyle} /> : unreadCount}
                    />
                </div>
                <div className='nav-icon'>
                    <ChatIconGrey />
                </div>
                <Profile userName={USERNAME || 'Bibo User'} />
            </div>
            <NotificationDrawer
                onClose={() => setDrawerOpen(false)}
                visible={drawerOpen}
                data={notifications}
                onClick={handleNavigation}
            />
        </Layout.Header>
    )
}

const circleStyle = {
    color: '#f5222d',
    right: '-15px'
}

const bageStyle = {
    position: 'absolute',
    top: '-7px',
    right: '-17px',
    width: '28.9px'
}

export default Header