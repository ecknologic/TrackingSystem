import React from 'react';
import CustomButton from './CustomButton';
import { RightChevronIconLight } from './SVG_Icons';
import { getFormatedNumber } from '../utils/Functions';
import '../sass/orderCard.scss'
import '../sass/invoiceCard.scss'

const InvoiceCard = ({ data, onClick }) => {
    const { invoiceId, customerName, billingAddress, pendingAmount } = data

    return (
        <div className='order-card-container invoice-card-container'>
            <span className='title clamp-2'>Invoice Number - {invoiceId} - {customerName}</span>
            <span className='address clamp-2'>{billingAddress}</span>
            <span className='stat-head'>₹ {getFormatedNumber(pendingAmount)}</span>
            <CustomButton
                text='View Details'
                className='app-btn app-view-btn'
                onClick={() => onClick(invoiceId)}
                suffix={<RightChevronIconLight className='chev' />}
            />
        </div>
    )
}

export default InvoiceCard