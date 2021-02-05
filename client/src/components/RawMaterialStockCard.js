import React from 'react';
import StockBadge from './StockBadge';
import '../sass/rawMaterialStockCard.scss';

const RawMaterialStockCard = () => {

    const items = [{
        key: '1',
        name: '20 Ltrs Caps',
        value: '23,980'
    },
    {
        key: '2',
        name: '1 Ltrs Caps',
        value: '2980'
    },
    {
        key: '3',
        name: 'Stickers',
        value: '23,980'
    }, {
        key: '4',
        name: '20 Ltrs Caps',
        value: '23,980'
    },
    {
        key: '5',
        name: '1 Ltrs Caps',
        value: '2980',
        isLow: true
    },
    {
        key: '6',
        name: 'Stickers',
        value: '23,980'
    }, {
        key: '7',
        name: '20 Ltrs Caps',
        value: '23,980'
    },
    {
        key: '8',
        name: '1 Ltrs Caps',
        value: '2980',
        isLow: true
    },
    {
        key: '9',
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