import React from 'react';
import '../sass/orderCard.scss'
import CustomButton from './CustomButton';
import { getStatusColor, renderProductDetails } from '../utils/Functions';

const CustomerCard = ({ data, onClick }) => {
    const { dcNo, address, stock, isDelivered, ...rest } = data
    const status = renderStatus(isDelivered)
    const details = renderProductDetails(rest)

    return (
        <div className='order-card-container'>
            <span className='title clamp-2'>{dcNo}</span>
            <span className='address clamp-2'>{address}</span>
            <span className='stock clamp-2'>{details}</span>
            <span className='stat-head'>Delivery Status</span>
            {status}
            <CustomButton
                text='View Details'
                className='app-extra-btn inverse small-btn'
                onClick={() => onClick(data)}
            />
        </div>
    )
}

const renderStatus = (status) => {
    const color = getStatusColor(status)
    const text = status === 'Completed' ? 'Delivered' : status === 'Postponed' ? status : 'Pending'
    return (
        <div className='status'>
            <span className='app-dot' style={{ background: color }}></span>
            <span className='status-text'>{text}</span>
        </div>
    )
}

export default CustomerCard