import React from 'react';
import EmptyBottlesStockCard from './EmptyBottlesStockCard';
import ChangeBadge from './ChangeBadge';
import '../sass/totalRevenueCard.scss'

const TotalRevenueCard = ({ data }) => {
    const { product20LCount, product2LCount, product1LCount, product500MLCount, product300MLCount, product2LPercent,
        product2LCompareText, product20LPercent, product20LCompareText, product1LPercent, product1LCompareText, product500MLPercent,
        product500MLCompareText, product300MLPercent, product300MLCompareText, prevTotal, total,
        product20LPartPercent, product1LPartPercent, product2LPartPercent, product500MLPartPercent, product300MLPartPercent } = data

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
                    partPercent={product20LPartPercent}
                    total={product20LCount}
                    strokeColor='#F7B500'
                    text={product20LCompareText}
                />
                <EmptyBottlesStockCard isRs
                    title='2 Ltrs'
                    percent={product2LPercent}
                    partPercent={product2LPartPercent}
                    total={product2LCount}
                    text={product2LCompareText}
                    strokeColor='#FA6400'
                />
            </div>
            <div className='sub-panel'>
                <EmptyBottlesStockCard isRs
                    title='1 Ltrs'
                    percent={product1LPercent}
                    partPercent={product1LPartPercent}
                    total={product1LCount}
                    strokeColor='#0091FF'
                    text={product1LCompareText}
                />
                <EmptyBottlesStockCard isRs
                    title='500 ml'
                    percent={product500MLPercent}
                    partPercent={product500MLPartPercent}
                    total={product500MLCount}
                    strokeColor='#41B9AD'
                    text={product500MLCompareText}
                />
            </div>
            <div className='sub-panel'>
                <EmptyBottlesStockCard isRs
                    title='300 ml'
                    percent={product300MLPercent}
                    partPercent={product300MLPartPercent}
                    total={product300MLCount}
                    strokeColor='#0091FF'
                    text={product300MLCompareText}
                />
            </div>
        </div>
    )
}

export default TotalRevenueCard