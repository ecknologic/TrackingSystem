import React from 'react';
import branch from '../assets/images/ic-manage-users.svg';
import NameCard from './NameCard';
import PrimaryButton from './PrimaryButton';
import '../sass/accountCard.scss'
import '../sass/addressCard.scss'

const AddressCard = ({ onClick }) => {
    const isActive = false

    return (
        <div className='account-card-container address-card-container'>
            <div className={isActive ? 'badge active' : 'badge'}>DRAFT</div>
            <div className='header'>
                <div className={isActive ? 'inner green' : 'inner'}>
                    <img src={branch} alt='' />
                    <div className='address-container'>
                        <span className='title'>Banjara Hills</span>
                    </div>
                </div>
            </div>
            <div className='body'>
                <div className='contact-container'>
                    <span className='type1'>Contact Details</span>
                    <div className='contacts'>
                        <NameCard name='Ajay Babu' />
                        <span className='mobile'>918223344556</span>
                    </div>
                </div>
                <div className='business'>
                    <span className='type1'>Assigned Route</span>
                    <span className='value'>Madhapur - Kondapur</span>
                </div>
            </div>
            <div className='footer'>
                <PrimaryButton text='View Details' onClick={onClick} />
            </div>
        </div>
    )

}

export default AddressCard