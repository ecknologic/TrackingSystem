import dayjs from 'dayjs';
import React from 'react';
import NameCard from './NameCard';
import PrimaryButton from './PrimaryButton';
import '../sass/accountCard.scss'
import '../sass/distributorCard.scss'
import { getAccountStatusUI } from '../utils/Functions';

const VisitedCustomerCard = ({ data, onClick, btnTxt = 'View Details' }) => {
    const { revisitDate, customerName, accountStatus, contactperson, mobileNumber, address, enquiryId } = data

    return (
        <div className='account-card-container distributor-card-container'>
            <div className='header'>
                <div className='inner trans'>
                    <div className='address-container'>
                        <span className='title clamp-1'>{customerName}</span>
                        <span className='address clamp-2'>{address}</span>
                    </div>
                </div>
            </div>
            <div className='body'>
                <div className='contact-container'>
                    <span className='type1'>Contact Details</span>
                    <div className='contacts'>
                        <NameCard name={contactperson} />
                        <span className='mobile'>{mobileNumber}</span>
                    </div>
                </div>
                <div className='contact-container role'>
                    <span className='type1'>Account Status</span>
                    <div className='contacts'>
                        <span >{getAccountStatusUI(accountStatus)}</span>
                    </div>
                </div>
            </div>
            <div className='footer'>
                <PrimaryButton text={btnTxt} onClick={() => onClick(enquiryId)} />
                {
                    revisitDate &&
                    <span className='footer-date'>Revisit Date: {dayjs(revisitDate).format('DD/MM/YYYY')}</span>
                }
            </div>
        </div>
    )
}

export default VisitedCustomerCard