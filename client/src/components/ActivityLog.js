import dayjs from 'dayjs';
import React from 'react';
import { Divider } from 'antd';
import parse from 'html-react-parser';
import '../sass/activityLog.scss'

const ActivityLog = ({ text }) => {

    return (
        <div className='activity-log-container'>
            {parse(text)}
            <div className='date-time'>
                <span className='date'>{dayjs().format('DD-MM-YYYY')}</span>
                <span className='time' >{dayjs().format('hh:mm A')}</span>
            </div>
            <Divider />
        </div>
    )
}

export default ActivityLog