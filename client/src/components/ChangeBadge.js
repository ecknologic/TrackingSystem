import React from 'react';
import { ArrowIconDanger, ArrowIconGreen } from './SVG_Icons';

const ChangeBadge = ({ percent = '0.00%' }) => {
    const signNum = Math.sign(parseInt(percent))
    const color = signNum === 1 ? '#2DB744' : '#E84A50'
    const arrow = signNum === -1 ? <ArrowIconDanger className='rotate-180' /> : signNum === 1 ? <ArrowIconGreen /> : null
    return (
        <div className='app-change-badge'>
            {arrow}
            <span className='value' style={{ color }}>{percent}</span>
        </div>
    )
}

export default ChangeBadge