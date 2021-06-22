import React from 'react';
import CustomButton from './CustomButton';
import ChangeBadge from './ChangeBadge';
import { RightChevronIconLight } from './SVG_Icons';
import { getFormatedNumber } from '../utils/Functions';
import '../sass/orderCard.scss'
import '../sass/invoiceCard.scss'

const InvoiceCard = ({ title, percent, text = '', amount, onClick, showPercent }) => {

    return (
        <div className='order-card-container invoice-card-container'>
            <div className='title-amount'>
                <span className='title clamp-2'>{title}</span>
                <span className='stat-head'>₹ {getFormatedNumber(amount)}</span>
            </div>
            {
                showPercent && (
                    <div className='percent-text'>
                        <ChangeBadge percent={percent} />
                        <span className='address clamp-2'>{text}</span>
                    </div>
                )
            }
            <CustomButton
                text='View Details'
                className='app-btn app-view-btn'
                onClick={() => onClick(title)}
                suffix={<RightChevronIconLight className='chev' />}
            />
        </div>
    )
}

export default InvoiceCard