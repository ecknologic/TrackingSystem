import dayjs from 'dayjs';
import React from 'react';
import NameCard from './NameCard';
import '../sass/revisitCard.scss';
const format = 'DD/MM/YYYY'

const RevisitCard = ({ data }) => {
    const { customerName, mobileNumber, address, revisitDate, contactperson, customertype } = data
    return (
        <div className='revisit-card-container'>
            <div className='revisit-title'>
                <span>Revisit Date: {dayjs(revisitDate).format(format)}</span>
            </div>
            <div className='business'>
                <span className='type1'>{customerName}</span>
                <span className='value clamp-1'>{address}</span>
            </div>
            <div className='business'>
                <span className='type1'>Account Type</span>
                <span className='value'>{customertype}</span>
            </div>
            <div className='contact-container'>
                <span className='type1'>Contact Details</span>
                <div className='contacts'>
                    <NameCard name={contactperson} />
                    <span className='mobile'>{mobileNumber}</span>
                </div>
            </div>
        </div>
    )
}

export default RevisitCard