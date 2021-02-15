import React from 'react';
import EmptyBottlesStockCard from './EmptyBottlesStockCard';
import ChangeBadge from './ChangeBadge';
import '../sass/totalRevenueCard.scss'

const TotalRevenueCard = ({ data }) => {
    const { total20L = 0, total2L = 0, total1L = 0, total500ML = 0, total250ML = 0 } = data
    const total = total20L + total2L + total1L + total500ML + total250ML

    return (
        <div className='total-revenue-card'>
            <div className='heading'>
                <span className='title'>Total Revenue</span>
                <span className='number'>₹ {total || 0}</span>
                <ChangeBadge />
            </div>
            <span className='sub-title'>Last Week Revenue ₹ 4,3,560.00</span>
            <div className='sub-panel'>
                <EmptyBottlesStockCard isRs
                    title='20 Ltrs'
                    total={total20L}
                    strokeColor='#F7B500'
                    text='Compared to (₹ 4,3,560.00 last Week)'
                />
                <EmptyBottlesStockCard isRs
                    title='2 Ltrs'
                    total={total2L}
                    text='Compared to (₹ 4,3,560.00 last Week)'
                    strokeColor='#FA6400'
                />
            </div>
            <div className='sub-panel'>
                <EmptyBottlesStockCard isRs
                    title='1 Ltrs'
                    total={total1L}
                    strokeColor='#0091FF'
                    text='Compared to (₹ 4,3,560.00 last Week)'
                />
                <EmptyBottlesStockCard isRs
                    title='500 ml'
                    total={total500ML}
                    strokeColor='#41B9AD'
                    text='Compared to (₹ 4,3,560.00 last Week)'
                />
            </div>
            <div className='sub-panel'>
                <EmptyBottlesStockCard isRs
                    title='300 ml'
                    total={total250ML}
                    strokeColor='#0091FF'
                    text='Compared to (₹ 4,3,560.00 last Week)'
                />
            </div>
        </div>
    )
}

export default TotalRevenueCard