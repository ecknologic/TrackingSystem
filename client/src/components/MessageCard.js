import dayjs from 'dayjs';
import React from 'react';
import '../sass/messageCard.scss'
import { getStatusColor } from '../utils/Functions';
const DATEFORMAT = 'DD/MM/YYYY'

const MessageCard = ({ data, onSelect, active }) => {

    const { createdDateTime, invoiceId, totalAmount, amountPaid, customerName, status } = data
    const color = getStatusColor(status)
    const classname = active.invoiceId === invoiceId ? 'selected' : ''

    return (
        <div className={`message-card ${classname} ${invoiceId}`} onClick={() => onSelect(data)}>
            <div className='header'>
                <span className='title clamp-1'>{customerName}</span>
                <span className='amount'>₹{totalAmount || amountPaid}</span>
            </div>
            <div className='footer'>
                <div className='left-part'>
                    <span className='app-link'>{invoiceId}</span>
                    <span className='date'>{dayjs(createdDateTime).format(DATEFORMAT)}</span>
                </div>
                <div className='status'>
                    <span className='app-dot' style={{ background: color }}></span>
                    <span className='status-text'>{status}</span>
                </div>
            </div>
        </div>
    )
}
export default MessageCard