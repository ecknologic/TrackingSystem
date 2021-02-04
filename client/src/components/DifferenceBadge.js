import React from 'react';
import '../sass/differenceBadge.scss';
import { ArrowIconDanger, ArrowIconGreen } from './SVG_Icons';

const DifferenceBadge = ({ amount = '14.23', sign = '+' }) => {
    const color = sign === '+' ? '#2DB744' : '#E84A50'
    const arrow = sign === '+' ? <ArrowIconGreen /> : <ArrowIconDanger style={{ transform: 'rotate(180deg)' }} />
    return (
        <div className='difference-badge'>
            {arrow}
            <span className='value' style={{ color }}>{sign}{amount}%</span>
        </div>
    )
}

export default DifferenceBadge