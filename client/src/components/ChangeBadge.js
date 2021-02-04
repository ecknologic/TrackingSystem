import React from 'react';
import { ArrowIconDanger, ArrowIconGreen } from './SVG_Icons';

const ChangeBadge = ({ amount = '14.23', sign = '+' }) => {
    const color = sign === '+' ? '#2DB744' : '#E84A50'
    const arrow = sign === '+' ? <ArrowIconGreen /> : <ArrowIconDanger style={{ transform: 'rotate(180deg)' }} />
    return (
        <div className='app-change-badge'>
            {arrow}
            <span className='value' style={{ color }}>{sign}{amount}%</span>
        </div>
    )
}

export default ChangeBadge