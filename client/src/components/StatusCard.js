import React, { memo } from 'react';
import '../sass/statusCard.scss'

const StatusCard = memo(({ count, title, showViewDetails = true }) => {

    return (
        <div className='status-card'>
            <div className='sc__count_name'>
                <span className='count'>{count}</span>
                <span className='name'>{title}</span>
            </div>
            {showViewDetails ? <div className='sc__footer'>
                <span className='text'>View Details</span>
            </div> : null}
        </div>
    )
})

export default StatusCard