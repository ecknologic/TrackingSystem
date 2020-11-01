import React from 'react';
import branch from '../assets/images/ic-manage-users.svg';
import '../sass/accountCard.scss'
import NameCard from './NameCard';
import PrimaryButton from './PrimaryButton';

const AccountCard = ({ customerDetails, onClick }) => {
    const isActive = customerDetails.isActive
    const name = JSON.parse(customerDetails.contactpersons)

    return (
        <div className='account-card-container'>
            <div className={isActive ? 'badge active' : 'badge'}>{isActive ? "ACTIVE" : "DRAFT"}</div>
            <div className='header'>
                <div className={isActive ? 'inner green' : 'inner'}>
                    <img src={branch} alt='' />
                    <div className='address-container'>
                        <span className='title'>{customerDetails.organizationName || customerDetails.customerName}</span>
                        <span className='address'>{customerDetails.address}</span>
                    </div>
                </div>
            </div>
            <div className='body'>
                <div className='contact-container'>
                    <span className='type1'>Contact Persons</span>
                    <div className='contacts'>
                        {
                            name.map((item, index) => index <= 2 ? <NameCard key={item} name={item} /> : null)
                        }
                        {name.length > 3 ? <div className='extra'>{`+${name.length - 3}`}</div> : null}
                    </div>
                </div>
                <div className='business'>
                    <span className='type1'>Business Type</span>
                    <span className='value'>{customerDetails.natureOfBussiness}</span>
                </div>
            </div>
            <div className='footer'>
                <PrimaryButton text='Manage Account' onClick={onClick} />
            </div>
        </div>
    )

}

export default AccountCard