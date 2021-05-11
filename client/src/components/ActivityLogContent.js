import React from 'react';
import { Empty } from 'antd';
import NoContent from '../components/NoContent';
import ActivityLog from '../components/ActivityLog';
import '../sass/activityLogContent.scss'

const ActivityLogContent = ({ data = [] }) => {

    return (
        <div className='activity-log-modal-content'>
            {
                data.length ? data.map((log) => <ActivityLog key={log.auditId} data={log} />)
                    : <NoContent content={<Empty />} />
            }
        </div>
    )
}

export default ActivityLogContent