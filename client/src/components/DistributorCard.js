import React from 'react';
import PrimaryButton from './PrimaryButton';
import '../sass/accountCard.scss'
import '../sass/distributorCard.scss'
import NameCard from './NameCard';

const DistributorCard = ({ data, onClick, btnTxt = 'Manage Account' }) => {
    const { isActive, agencyName, operationalArea, contactPerson, mobileNumber, address } = data

    return (
        <div className='account-card-container distributor-card-container'>
            <div className={isActive ? 'badge active' : 'badge'}>{isActive ? "ACTIVE" : "DRAFT"}</div>
            <div className='header'>
                <div className={isActive ? 'inner green' : 'inner'}>
                    <div className='address-container'>
                        <span className='title clamp-1'>{agencyName}</span>
                        <span className='address clamp-2'>{address}</span>
                    </div>
                </div>
            </div>
            <div className='body'>
                <div className='contact-container'>
                    <span className='type1'>Contact Details</span>
                    <div className='contacts'>
                        <NameCard name={contactPerson} />
                        <span className='mobile'>{mobileNumber}</span>
                    </div>
                </div>
                <div className='contact-container role'>
                    <span className='type1'>Operational Area</span>
                    <div className='contacts'>
                        <span >{operationalArea}</span>
                    </div>
                </div>
            </div>
            <div className='footer'>
                <PrimaryButton text={btnTxt} onClick={onClick} />
            </div>
        </div>
    )
}

export default DistributorCard