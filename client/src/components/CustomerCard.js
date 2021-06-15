import React from 'react';
import '../sass/orderCard.scss'
import { getStatusColor } from '../utils/Functions';
import CustomButton from './CustomButton';

const CustomerCard = ({ data, onClick }) => {
    const { dcNo, address, stock, isDelivered, ...rest } = data
    const status = renderStatus(isDelivered)
    const details = renderOrderDetails(rest)

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

const renderOrderDetails = ({ product20L, product2L, product1L, product500ML, product300ML }) => {
    return `
    20 ltrs - ${Number(product20L)}, 2 ltrs - ${Number(product2L)} boxes, 1 ltr - ${Number(product1L)} boxes, 
    500 ml - ${Number(product500ML)} boxes, 300 ml - ${Number(product300ML)} boxes
    `
}

export default CustomerCard