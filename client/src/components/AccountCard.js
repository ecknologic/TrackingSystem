import React from 'react';
import branch from '../assets/images/ic-manage-users.svg';
import AvatarText from './AvatarText';
import '../sass/accountCard.scss'
import NameCard from './NameCard';
import PrimaryButton from './PrimaryButton';

const AccountCard = ({ onClick }) => {
    const isActive = true
    const name = ['Ajay Babu', 'Jahan Jasper', 'Imran Khan', 'Christopher George', 'Sukesh']

    return (
        <div className='account-card-container'>
            <div className={isActive ? 'badge active' : 'badge'}>ACTIVE</div>
            <div className='header'>
                <div className={isActive ? 'inner green' : 'inner'}>
                    <img src={branch} alt='' />
                    <div className='address-container'>
                        <span className='title'>Apollo Hospitals</span>
                        <span className='address'>MLA Colony, Road 13, Banjara Hills Hyderabad</span>
                    </div>
                </div>
            </div>
            <div className='body'>
                <div className='contact-container'>
                    <span className='type1'>Contact Persons</span>
                    <div className='contacts'>
                        {
                            name.map((item, index) => index <= 2 ? <NameCard name={item} /> : null)
                        }
                        {name.length > 3 ? <div className='extra'>{`+${name.length - 3}`}</div> : null}
                    </div>
                </div>
                <div className='business'>
                    <span className='type1'>Business Type</span>
                    <span className='value'>Home/Residence</span>
                </div>
            </div>
            <div className='footer'>
                <PrimaryButton text='Manage Account' onClick={onClick} />
            </div>
        </div>
    )

}

export default AccountCard