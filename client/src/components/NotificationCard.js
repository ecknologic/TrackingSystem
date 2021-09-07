import { Badge } from 'antd';
import React from 'react';
import '../sass/notificationCard.scss'

const NotificationCard = ({ time, title, content }) => {

    return (
        <div className='notification-card'>
            <div className='time'>{time}</div>
            <Badge size="small" color="#f5222d" className='notification-card__dot' />
            <div className='header'>{title}</div>
            <div className='body'>{content}</div>
        </div>
    )
}
export default NotificationCard