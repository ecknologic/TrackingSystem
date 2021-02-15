import React from 'react';
import EmptyBottlesStockCard from './EmptyBottlesStockCard';
import ChangeBadge from './ChangeBadge';
import '../sass/totalRevenueCard.scss'

const TotalRevenueCard = ({ data }) => {
    const { product20LCount, product2LCount, product1LCount, product500MLCount, product250MLCount, product2LPercent,
        product2LCompareText, product20LPercent, product20LCompareText, product1LPercent, product1LCompareText, product500MLPercent,
        product500MLCompareText, product250MLPercent, product250MLCompareText, prevTotal, total } = data

    return (
        <div className='total-revenue-card'>
            <div className='heading'>
                <span className='title'>Total Revenue</span>
                <span className='number'>₹ {total || 0}</span>
                <ChangeBadge />
            </div>
            <span className='sub-title'>Last Week Revenue ₹ {prevTotal || 0}</span>
            <div className='sub-panel'>
                <EmptyBottlesStockCard isRs
                    title='20 Ltrs'
                    percent={product20LPercent}
                    total={product20LCount}
                    strokeColor='#F7B500'
                    text={product20LCompareText}
                />
                <EmptyBottlesStockCard isRs
                    title='2 Ltrs'
                    percent={product2LPercent}
                    total={product2LCount}
                    text={product2LCompareText}
                    strokeColor='#FA6400'
                />
            </div>
            <div className='sub-panel'>
                <EmptyBottlesStockCard isRs
                    title='1 Ltrs'
                    percent={product1LPercent}
                    total={product1LCount}
                    strokeColor='#0091FF'
                    text={product1LCompareText}
                />
                <EmptyBottlesStockCard isRs
                    title='500 ml'
                    percent={product500MLPercent}
                    total={product500MLCount}
                    strokeColor='#41B9AD'
                    text={product500MLCompareText}
                />
            </div>
            <div className='sub-panel'>
                <EmptyBottlesStockCard isRs
                    title='300 ml'
                    percent={product250MLPercent}
                    total={product250MLCount}
                    strokeColor='#0091FF'
                    text={product250MLCompareText}
                />
            </div>
        </div>
    )
}

export default TotalRevenueCard