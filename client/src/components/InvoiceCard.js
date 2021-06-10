import React from 'react';
import CustomButton from './CustomButton';
import { getStatusColor } from '../utils/Functions';
import { RightChevronIconLight } from './SVG_Icons';
import '../sass/orderCard.scss'
import '../sass/invoiceCard.scss'

const InvoiceCard = ({ data, onClick }) => {
    const { dcNo, address, stock, isDelivered, ...rest } = data
    const status = renderStatus(isDelivered)
    const details = renderOrderDetails(rest)

    return (
        <div className='order-card-container invoice-card-container'>
            <span className='title clamp-2'>{dcNo}</span>
            <span className='address clamp-2'>{address}</span>
            <span className='stat-head'>₹ 4,100</span>
            <CustomButton
                text='View Details'
                className='app-btn app-view-btn'
                onClick={() => onClick(data)}
                suffix={<RightChevronIconLight className='chev' />}
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

export default InvoiceCard