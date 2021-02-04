import React from 'react';
import '../sass/productionStatusCard.scss';
import DifferenceBadge from './DifferenceBadge';

const ProductionStatusCard = ({ title, total }) => {


    return (
        <div className='production-status-card'>
            <div className='title'>{title}</div>
            <div className='body'>
                <div className='stats'>
                    <span className='number'>{total}</span>
                    <DifferenceBadge />
                </div>
                <span className='compare-text'>Compared to (1832 yesterday)</span>
            </div>
        </div>
    )
}

export default ProductionStatusCard