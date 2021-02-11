import React from 'react';
import EmptyBottlesStockCard from './EmptyBottlesStockCard';
import ChangeBadge from './ChangeBadge';
import '../sass/totalRevenueCard.scss'

const TotalRevenueCard = () => {

    return (
        <div className='total-revenue-card'>
            <div className='heading'>
                <span className='title'>Total Revenue</span>
                <span className='number'>₹ {'5,60,500' || 0}</span>
                <ChangeBadge />
            </div>
            <span className='sub-title'>Last Week Revenue ₹ 4,3,560.00</span>
            <div className='sub-panel'>
                <EmptyBottlesStockCard isRs
                    title='Business Customers'
                    total='5,60,500'
                    strokeColor='#F7B500'
                    text='Compared to (₹ 4,3,560.00 last Week)'
                />
                <EmptyBottlesStockCard isRs
                    title='Other Customers'
                    total='5,60,500'
                    text='Compared to (₹ 4,3,560.00 last Week)'
                    strokeColor='#FA6400'
                />
            </div>
            <div className='sub-panel'>
                <EmptyBottlesStockCard isRs
                    title='Memberships'
                    total='5,60,500'
                    strokeColor='#41B9AD'
                    text='Compared to (₹ 4,3,560.00 last Week)'
                />
                <EmptyBottlesStockCard isRs
                    title='Dealerships'
                    total='5,60,500'
                    strokeColor='#0091FF'
                    text='Compared to (₹ 4,3,560.00 last Week)'
                />
            </div>
        </div>
    )
}

export default TotalRevenueCard