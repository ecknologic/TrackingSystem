import React from 'react';
import { Dropdown, Menu } from 'antd';
import NameCard from './NameCard';
import PrimaryButton from './PrimaryButton';
import { FriendIconGrey, MoreIconGrey } from './SVG_Icons';
import '../sass/accountCard.scss'
import '../sass/addressCard.scss'
import { getRole, SUPERADMIN } from '../utils/constants';

const AddressCard = ({ data, onClick, onSelect }) => {
    const role = getRole()
    const { isApproved, departmentName, phoneNumber, location, contactPerson, deliveryDetailsId } = data

    const handleSelect = ({ key }) => {
        onSelect(key, deliveryDetailsId)
    }

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
                <PrimaryButton text='View Details' onClick={() => onClick(data)} />
                {
                    role === SUPERADMIN &&
                    <Action onSelect={handleSelect} isApproved={isApproved} />
                }
            </div>
        </div>
    )

}

const Action = ({ onSelect, isApproved }) => {
    const menu = (
        <Menu onClick={onSelect}>
            <Menu.Item key="approve" className={isApproved ? 'disabled' : ''}>
                Approve
          </Menu.Item>
            <Menu.Item key="delete">
                Delete
          </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown
            overlay={menu}
            trigger={['click']}
            getPopupContainer={() => document.getElementById('content')}
        >
            <MoreIconGrey className='action-dots' />
        </Dropdown>
    )
}

export default AddressCard