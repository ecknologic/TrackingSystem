import React, { memo } from 'react';
import Profile from '../assets/images/profile.jpg'
import '../sass/executiveCard.scss'
const ExecutiveCard = memo(({ count, title }) => {
    const totalCount = 10
    return (
        <div className='executive-card'>
            <div className='ec__image'>
                <img src={Profile} alt='' />
            </div>
            <span className='ec__name'>Srinivas K.</span>
            <span className='ec__designation'>Business Manager</span>
            <span className='ec__footer'>Total Visited Customers - {totalCount || 0}</span>
        </div>
    )
})

export default ExecutiveCard