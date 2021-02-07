import React from 'react';
import StockBadge from './StockBadge';
import '../sass/rawMaterialStockCard.scss';

const RawMaterialStockCard = ({ data }) => {

    return (
        <div className='raw-mat-stock-card'>
            <div className='panel-details'>
                {
                    data.map((item, index) => {
                        const { itemName, itemCount, isLow } = item
                        return (
                            <div className='item' key={index}>
                                <span className='name'><span className='app-dot'></span>{itemName}</span>
                                {isLow && <StockBadge />}
                                <span className='value'>{itemCount}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default RawMaterialStockCard