import React from 'react';
import '../sass/notificationCard.scss'

const NotificationCard = ({ title, content }) => {

    return (
        <div className='notification-card'>
            <div className='header'>{title}</div>
            <div className='body'>{content}</div>
        </div>
    )
}
export default NotificationCard