import React from 'react';
import '../sass/accountCard.scss'
import NameCard from './NameCard';
import PrimaryButton from './PrimaryButton';
import { FriendsIconGrey, FriendIconGrey } from './SVG_Icons';

const AccountCard = ({ customerDetails, onClick }) => {
    const isActive = customerDetails.isActive
    const names = JSON.parse(customerDetails.contactpersons)
    const contacts = names.length

    return (
        <div className='account-card-container'>
            <div className={isActive ? 'badge active' : 'badge'}>{isActive ? "ACTIVE" : "DRAFT"}</div>
            <div className='header'>
                <div className={isActive ? 'inner green' : 'inner'}>
                    {contacts > 1 ? <FriendsIconGrey className='friends icon' /> : <FriendIconGrey className='friend icon' />}
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
                            names.map((item, index) => index <= 2 ? <NameCard key={index} name={item} /> : null)
                        }
                        {contacts > 3 ? <div className='extra'>{`+${contacts - 3}`}</div> : null}
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