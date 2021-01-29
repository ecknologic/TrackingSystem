import React from 'react';
import { Menu } from 'antd';
import NameCard from './NameCard';
import PrimaryButton from './PrimaryButton';
import { FriendIconGrey } from './SVG_Icons';
import { getRole, SUPERADMIN } from '../utils/constants';
import Actions from '../components/Actions'
import '../sass/accountCard.scss'
import '../sass/addressCard.scss'

const AddressCard = ({ data, onClick, onSelect }) => {
    const role = getRole()
    const { isApproved, departmentName, phoneNumber, location, contactPerson, deliveryDetailsId } = data
    const optionOne = isApproved ? 'Draft' : 'Active'

    const handleSelect = ({ key }) => {
        onSelect(key, deliveryDetailsId)
    }

    const options = [
        <Menu.Item key={optionOne}>{optionOne}</Menu.Item>,
        <Menu.Item key="Delete">Delete</Menu.Item>
    ]

    return (
        <div className='account-card-container address-card-container'>
            <div className={isApproved ? 'badge active' : 'badge'}>{isApproved ? "ACTIVE" : "DRAFT"}</div>
            <div className='header'>
                <div className={isApproved ? 'inner green' : 'inner'}>
                    <FriendIconGrey className='friend icon' />
                    <div className='address-container'>
                        <span className='title clamp-1'>{location}</span>
                    </div>
                </div>
            </div>
            <div className='body'>
                <div className='contact-container'>
                    <span className='type1'>Contact Details</span>
                    <div className='contacts'>
                        <NameCard name={contactPerson} />
                        <span className='mobile'>{phoneNumber}</span>
                    </div>
                </div>
                <div className='business'>
                    <span className='type1'>Assigned Warehouse</span>
                    <span className='value'>{departmentName}</span>
                </div>
            </div>
            <div className='footer'>
                <PrimaryButton text='View Details' onClick={() => onClick(deliveryDetailsId)} />
                {
                    role === SUPERADMIN &&
                    <Actions options={options} onSelect={handleSelect} />
                }
            </div>
        </div>
    )
}

export default AddressCard