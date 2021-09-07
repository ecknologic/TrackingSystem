import React from 'react';
import { Drawer } from 'antd';
import { CrossIconDark } from './SVG_Icons';
import DrinkIcon from '../assets/color/drink.svg'
import Scrollbars from 'react-custom-scrollbars-2';
import NotificationCard from './NotificationCard';
import '../sass/notificationDrawer.scss'

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
                <NotificationCard time='Jan 22, 1:20am' title='Particulars Out of stock' content='Kondapur WH is having 20L,300ML bottles out of stock' />
                <NotificationCard time='Jan 21, 1:20pm' title='Material Request' content='Aqua Maestro Pvt Ltd MP Has raised material request' />
                <NotificationCard time='Jan 20, 1:20am' title='Particulars Out of stock' content='JEEDIMETLA WH is having 500ML bottles and 500ML, 300ML caps out of stock' />
                <NotificationCard time='Jan 19, 1:20pm' title='Created Delivery' content='Sangareddy MP Created a delivery request to Kondapur WH' />
                <NotificationCard time='Jan 18, 1:20am' title='Customer Order' content='Console Technologies is having a delivery to be confirmed' />
                <NotificationCard time='Jan 17, 1:20pm' title='Customer Added' content='Rao Ramesh created a new corporate customer Maestro Agencies' />
                <NotificationCard time='Jan 16, 1:20am' title='Delivery Address Added' content='Rao Ramesh added new delivery address to Console Technologies' />
                <NotificationCard time='Jan 15, 1:20pm' title='Particulars Out of stock' content='Kondapur WH is having 20L,300ML bottles out of stock' />
                <NotificationCard time='Jan 14, 1:20am' title='Material Request' content='Aqua Maestro Pvt Ltd MP Has raised material request' />
                <NotificationCard time='Jan 13, 1:20pm' title='Particulars Out of stock' content='JEEDIMETLA WH is having 500ML bottles and 500ML, 300ML caps out of stock' />
                <NotificationCard time='Jan 12, 1:20am' title='Created Delivery' content='Sangareddy MP Created a delivery request to Kondapur WH' />
                <NotificationCard time='Jan 11, 1:20pm' title='Customer Order' content='Console Technologies is having a delivery to be confirmed' />
                <NotificationCard time='Jan 10, 1:20am' title='Customer Added' content='Rao Ramesh created a new corporate customer Maestro Agencies' />
                <NotificationCard time='Jan 9, 1:20pm' title='Delivery Address Added' content='Rao Ramesh added new delivery address to Console Technologies' />
                <NotificationCard time='Jan 8, 1:20am' title='Particulars Out of stock' content='Kondapur WH is having 20L,300ML bottles out of stock' />
                <NotificationCard time='Jan 7, 1:20pm' title='Material Request' content='Aqua Maestro Pvt Ltd MP Has raised material request' />
                <NotificationCard time='Jan 6, 1:20am' title='Particulars Out of stock' content='JEEDIMETLA WH is having 500ML bottles and 500ML, 300ML caps out of stock' />
                <NotificationCard time='Jan 5, 1:20pm' title='Created Delivery' content='Sangareddy MP Created a delivery request to Kondapur WH' />
                <NotificationCard time='Jan 4, 1:20am' title='Customer Order' content='Console Technologies is having a delivery to be confirmed' />
                <NotificationCard time='Jan 3, 1:20pm' title='Customer Added' content='Rao Ramesh created a new corporate customer Maestro Agencies' />
                <NotificationCard time='Jan 2, 1:20am' title='Delivery Address Added' content='Rao Ramesh added new delivery address to Console Technologies' />
                <NotificationCard time='Dec 31, 1:20pm' title='Particulars Out of stock' content='Kondapur WH is having 20L,300ML bottles out of stock' />
                <NotificationCard time='Dec 30, 1:20am' title='Material Request' content='Aqua Maestro Pvt Ltd MP Has raised material request' />
                <NotificationCard time='Dec 29, 1:20pm' title='Particulars Out of stock' content='JEEDIMETLA WH is having 500ML bottles and 500ML, 300ML caps out of stock' />
                <NotificationCard time='Dec 27, 1:20am' title='Created Delivery' content='Sangareddy MP Created a delivery request to Kondapur WH' />
                <NotificationCard time='Dec 26, 1:20pm' title='Customer Order' content='Console Technologies is having a delivery to be confirmed' />
                <NotificationCard time='Dec 25, 1:20am' title='Customer Added' content='Rao Ramesh created a new corporate customer Maestro Agencies' />
                <NotificationCard time='Dec 24, 1:20pm' title='Delivery Address Added' content='Rao Ramesh added new delivery address to Console Technologies' />
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