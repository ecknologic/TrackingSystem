import dayjs from 'dayjs';
import React from 'react';
import { Divider } from 'antd';
import parse from 'html-react-parser';
import '../sass/activityLog.scss'

const ActivityLog = ({ data }) => {
    const { description, createdDateTime } = data

    return (
        <div className='activity-log-container'>
            {parse(description)}
            <div className='date-time'>
                <span className='date'>{dayjs(createdDateTime).format('DD-MM-YYYY')}</span>
                <span className='time' >{dayjs(createdDateTime).format('hh:mm A')}</span>
            </div>
            <Divider />
        </div>
    )
}

export default ActivityLog