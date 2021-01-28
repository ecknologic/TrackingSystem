import React from 'react';
import { Drawer } from 'antd';
import { CrossIconDark } from './SVG_Icons';
import DrinkIcon from '../assets/color/drink.svg'
import '../sass/notificationDrawer.scss'
import Scrollbars from 'react-custom-scrollbars-2';
import NotificationCard from './NotificationCard';

const NotificationDrawer = ({ onClose, visible }) => {

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
                <Notifications />
                {/* <NoNotifications /> */}
            </Scrollbars>
        </Drawer>
    )
}

const Notifications = () => {
    return (
        <div className='notifications-drawer-body'>
            <div className='notifications-content'>
                <NotificationCard title='Particulars Out of stock' content='Kondapur WH is having 20L,300ML bottles out of stock' />
                <NotificationCard title='Material Request' content='Aqua Maestro Pvt Ltd MP Has raised material request' />
                <NotificationCard title='Particulars Out of stock' content='JEEDIMETLA WH is having 500ML bottles and 500ML, 300ML caps out of stock' />
                <NotificationCard title='Created Delivery' content='Sangareddy MP Created a delivery request to Kondapur WH' />
                <NotificationCard title='Customer Order' content='Console Technologies is having a delivery to be confirmed' />
                <NotificationCard title='Customer Added' content='Rao Ramesh created a new corporate customer Maestro Agencies' />
                <NotificationCard title='Delivery Address Added' content='Rao Ramesh added new delivery address to Console Technologies' />
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