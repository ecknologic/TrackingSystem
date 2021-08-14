import React from 'react';
import { Menu } from 'antd';
import Actions from './Actions';
import NameCard from './NameCard';
import PrimaryButton from './PrimaryButton';
import { BlockIconGrey, TickIconGrey, TrashIconGrey } from './SVG_Icons';
import '../sass/accountCard.scss'
import '../sass/vendorCard.scss'

const VendorCard = ({ data, onClick, btnTxt = 'Manage Account', isSuperAdmin, onSelect }) => {
    const { isActive, vendorName, contactPerson, address, vendorId } = data

    const optionOne = isActive ? 'Inactive' : 'Active'
    const iconOne = isActive ? <BlockIconGrey /> : <TickIconGrey />

    const options = [
        <Menu.Item key={optionOne} icon={iconOne}>{optionOne}</Menu.Item>,
        <Menu.Item key="Delete" icon={<TrashIconGrey />}>Delete</Menu.Item>
    ]

    const handleSelect = ({ key }) => {
        onSelect(key, vendorId)
    }

    return (
        <div className='account-card-container vendor-card-container'>
            <div className={isActive ? 'badge active' : 'badge'}>{isActive ? "ACTIVE" : "DRAFT"}</div>
            <div className='header'>
                <div className={isActive ? 'inner green' : 'inner'}>
                    <div className='address-container'>
                        <span className='title clamp-1'>{vendorName}</span>
                        <span className='address clamp-2'>{address}</span>
                    </div>
                </div>
            </div>
            <div className='body'>
                <div className='contact-container'>
                    <span className='type1'>Contact Person</span>
                    <div className='contacts'>
                        <NameCard name={contactPerson} />
                    </div>
                </div>
            </div>
            <div className='footer'>
                <PrimaryButton text={btnTxt} onClick={() => onClick(vendorId)} />
                {
                    isSuperAdmin &&
                    <Actions options={options} onSelect={handleSelect} />
                }
            </div>
        </div>
    )
}

export default VendorCard