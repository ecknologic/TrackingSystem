import { Badge } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import parse from 'html-react-parser';
import ERPIcon from '../assets/images/logo.png'
import '../sass/notificationCard.scss'

const NotificationCard = ({ data, onClick }) => {
    const { createdDateTime, title, description, isRead, navigationUrl, backgroundColor } = data;

    const background = getBgColor(isRead, backgroundColor)

    return (
        <div
            className='notification-card'
            onClick={() => onClick(data)}
            style={{ cursor: navigationUrl ? 'pointer' : 'default', background }}
        >
            <div className='time'>{dayjs(createdDateTime).format('MMM DD, h:mm a')}</div>
            {!isRead && <Badge size="small" color="#f5222d" className='notification-card__dot' />}
            <div className='header'>
                <img src={ERPIcon} alt='' width={16} />
                {title}
            </div>
            <div className='body'>{parse(description)}</div>
        </div>
    )
}

export const getBgColor = (isRead, bgColor) => {
    if (!isRead) {
        if (bgColor) {
            return bgColor
        }
        return 'rgba(63, 166, 65, 0.2)'
    }

    return '#fff'
}
export default NotificationCard