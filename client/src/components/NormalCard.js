import React from 'react';
import ChangeBadge from './ChangeBadge';
import CustomButton from './CustomButton';
import { RightChevronIconLight } from './SVG_Icons';
import '../sass/normalCard.scss';
import '../sass/customerOverviewCard.scss';

const NormalCard = ({ title, total, onClick }) => {


    return (
        <div className='customer-overview-card normal-card'>
            <span className='title'>{title}</span>
            <div className='body'>
                <div className='stats'>
                    <span className='number'>{total || 0}</span>
                </div>
                <CustomButton
                    text='View Details'
                    className='app-view-btn'
                    onClick={onClick}
                    suffix={<RightChevronIconLight className='chev' />}
                />
            </div>
        </div>
    )
}

export default NormalCard