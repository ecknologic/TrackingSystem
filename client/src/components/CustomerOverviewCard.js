import React from 'react';
import ChangeBadge from './ChangeBadge';
import '../sass/customerOverviewCard.scss';
import CustomButton from './CustomButton';
import { RightChevronIconLight } from './SVG_Icons';

const CustomerOverviewCard = ({ title, total, pending, percent, compareText, onClick }) => {


    return (
        <div className='customer-overview-card'>
            <span className='title'>{title}</span>
            <div className='body'>
                <div className='stats'>
                    <span className='number'>{total || 0}</span>
                    <ChangeBadge percent={percent} />
                </div>
                <span className='compare-text'>{compareText || '--'}</span>
                <div className='pending'>
                    <span className='text'>Approvals Pending</span>
                    <span className='red-num'>{pending || 0}</span>
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

export default CustomerOverviewCard