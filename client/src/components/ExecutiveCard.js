import React, { memo } from 'react';
import AvatarText from './AvatarText';
import '../sass/executiveCard.scss'
const ExecutiveCard = memo(({ item }) => {
    const { totalCustomersCount, userName } = item
    return (
        <div className='executive-card'>
            <div className='ec__image'>
                <AvatarText name={userName} />
            </div>
            <span className='ec__name'>{userName}</span>
            <span className='ec__designation'>Sales & Marketing Admin</span>
            <span className='ec__footer'>Total Visited Customers - {totalCustomersCount || 0}</span>
        </div>
    )
})

export default ExecutiveCard