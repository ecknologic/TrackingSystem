import { Badge } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import parse from 'html-react-parser';
import '../sass/notificationCard.scss'

const NotificationCard = ({ data, onClick }) => {
    const { createdDateTime, title, description, isRead, navigationUrl } = data;

    return (
        <div
            className='notification-card'
            onClick={() => onClick(data)}
            style={{ cursor: navigationUrl ? 'pointer' : 'default' }}
        >
            <div className='time'>{dayjs(createdDateTime).format('MMM DD, h:mm a')}</div>
            {!isRead && <Badge size="small" color="#f5222d" className='notification-card__dot' />}
            <div className='header'>{title}</div>
            <div className='body'>{parse(description)}</div>
        </div>
    )
}
export default NotificationCard