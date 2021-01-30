import React from 'react';
import '../sass/notificationCard.scss'

const NotificationCard = ({ time, title, content }) => {

    return (
        <div className='notification-card'>
            <div className='time'>{time}</div>
            <div className='header'>{title}</div>
            <div className='body'>{content}</div>
        </div>
    )
}
export default NotificationCard