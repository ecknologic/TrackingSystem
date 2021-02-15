import React from 'react';
import '../sass/productionStatusCard.scss';
import ChangeBadge from './ChangeBadge';

const ProductionStatusCard = ({ title, total, compareText, percent }) => {


    return (
        <div className='production-status-card'>
            <div className='title'>{title}</div>
            <div className='body'>
                <div className='stats'>
                    <span className='number'>{total || 0}</span>
                    <ChangeBadge percent={percent} />
                </div>
                <span className='compare-text'>{compareText || '--'}</span>
            </div>
        </div>
    )
}

export default ProductionStatusCard