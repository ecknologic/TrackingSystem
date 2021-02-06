import React from 'react';
import '../sass/productionStatusCard.scss';
import ChangeBadge from './ChangeBadge';

const ProductionStatusCard = ({ title, total }) => {


    return (
        <div className='production-status-card'>
            <div className='title'>{title}</div>
            <div className='body'>
                <div className='stats'>
                    <span className='number'>{total || 0}</span>
                    <ChangeBadge />
                </div>
                <span className='compare-text'>Compared to (1832 yesterday)</span>
            </div>
        </div>
    )
}

export default ProductionStatusCard