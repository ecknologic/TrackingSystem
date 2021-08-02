import React from 'react';
import NameCard from './NameCard';
import PrimaryButton from './PrimaryButton';
import { getBusinessTypes } from '../utils/Functions';
import { FriendsIconGrey, FriendIconGrey } from './SVG_Icons';
import '../sass/accountCard.scss'

const ClosureCard = ({ data, onClick, btnTxt = 'Manage Account' }) => {
    const { closingId, customerId, isApproved, contactpersons, customerName, organizationName,
        status, address, natureOfBussiness, customerNo } = data

    const names = JSON.parse(contactpersons || "[]")
    const contacts = names.length

    const extra = contacts > 3 ? <span className='extra'>{`+${contacts - 3}`}</span> : null
    const NOB = getBusinessTypes(natureOfBussiness)

    return (
        <div className='account-card-container'>
            {renderStatus(status)}
            <div className='header'>
                <div className={isApproved ? 'inner green' : 'inner'}>
                    {contacts > 1 ? <FriendsIconGrey className='friends icon' /> : <FriendIconGrey className='friend icon' />}
                    <div className='address-container'>
                        <span className='title clamp-1'>{organizationName || customerName}</span>
                        <span className='id'>ID: {customerNo}</span>
                        <span className='address clamp-2'>{address}</span>
                    </div>
                </div>
            </div>
            <div className='body'>
                <div className='contact-container'>
                    <span className='type1'>Contact Persons</span>
                    <div className='contacts'>
                        {
                            names.map((item, index) => index <= 2
                                ? <NameCard
                                    key={index}
                                    name={item}
                                    extra={index === 2 && extra ? extra : null}
                                />
                                : null)
                        }
                    </div>
                </div>
                <div className='business'>
                    <span className='type1'>Business Type</span>
                    <span className='value'>{NOB}</span>
                </div>
            </div>
            <div className='footer'>
                <PrimaryButton text={btnTxt} onClick={() => onClick(closingId, customerId)} />
            </div>
        </div>
    )

}

const renderStatus = (status) => {
    const isActive = status === 'InProgress' || status === 'Confirmed'
    const text = status === 'InProgress' ? 'In Progress' : status

    return (
        <div className={isActive ? 'badge active' : 'badge closed'}>{text}</div>
    )
}

export default ClosureCard