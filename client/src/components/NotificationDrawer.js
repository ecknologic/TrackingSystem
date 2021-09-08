import React from 'react';
import { Drawer } from 'antd';
import { CrossIconDark } from './SVG_Icons';
import DrinkIcon from '../assets/color/drink.svg'
import Scrollbars from 'react-custom-scrollbars-2';
import NotificationCard from './NotificationCard';
import '../sass/notificationDrawer.scss'

const NotificationDrawer = ({ onClose, visible, data, onClick }) => {

    return (
        <Drawer
            title="Notifications"
            placement="right"
            onClose={onClose}
            visible={visible}
            closeIcon={<CrossIconDark />}
            width={320}
            className='notifications-drawer'
        >
            <Scrollbars renderThumbVertical={Thumb}>
                {
                    data.length
                        ? <Notifications data={data} onClick={onClick} />
                        : <NoNotifications />
                }
            </Scrollbars>
        </Drawer>
    )
}

const Notifications = ({ data, onClick }) => {
    return (
        <div className='notifications-drawer-body'>
            <div className='notifications-content'>
                {data.map(item => <NotificationCard key={item.notificationId} data={item} onClick={onClick} />)}
            </div>
        </div>
    )
}

const NoNotifications = () => {
    return (
        <div className='no-notifications-container'>
            <img src={DrinkIcon} alt='' />
            <span className='msg main'>You don't have any notifications</span>
            <span className='msg'>Please check back later.</span>
        </div>
    )
}
const Thumb = (props) => <div {...props} className="thumb-vertical" />

export default NotificationDrawer