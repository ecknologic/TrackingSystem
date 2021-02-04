import React from 'react';
import StockBadge from './StockBadge';
import '../sass/rawMaterialStockCard.scss';

const RawMaterialStockCard = () => {

    const items = [{
        name: '20 Ltrs Caps',
        value: '23,980'
    },
    {
        name: '1 Ltrs Caps',
        value: '2980'
    },
    {
        name: 'Stickers',
        value: '23,980'
    }, {
        name: '20 Ltrs Caps',
        value: '23,980'
    },
    {
        name: '1 Ltrs Caps',
        value: '2980',
        isLow: true
    },
    {
        name: 'Stickers',
        value: '23,980'
    }, {
        name: '20 Ltrs Caps',
        value: '23,980'
    },
    {
        name: '1 Ltrs Caps',
        value: '2980',
        isLow: true
    },
    {
        name: 'Stickers',
        value: '23,980'
    }]

    return (
        <div className='raw-mat-stock-card'>
            <div className='panel-details'>
                {
                    items.map((item) => {
                        const { name, value, isLow } = item
                        return (
                            <div className='item'>
                                <span className='name'><span className='app-dot'></span>{name}</span>
                                {isLow && <StockBadge />}
                                <span className='value'>{value}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default RawMaterialStockCard