import dayjs from 'dayjs';
import React from 'react';
import { Divider } from 'antd';
import parse from 'html-react-parser';
import '../sass/activityLog.scss'

const ActivityLog = ({ data }) => {
    const { description, createdDateTime, oldValue = null, newValue = null } = data
    const hasRecords = oldValue !== null && newValue !== null

    return (
        <div className='activity-log-container'>
            {parse(description)}
            <div className='date-time'>
                <span className='date'>{dayjs(createdDateTime).format('DD-MM-YYYY')}</span>
                <span className='time' >{dayjs(createdDateTime).format('hh:mm A')}</span>
            </div>
            {
                hasRecords &&
                (
                    <div className='records-container'>
                        <div className='record-box first'>
                            <div className='title'>Old Record</div>
                            {oldValue}
                        </div>
                        <div className='record-box'>
                            <div className='title'>New Record</div>
                            {newValue}
                        </div>
                    </div>
                )
            }
            <Divider />
        </div>
    )
}

export default ActivityLog