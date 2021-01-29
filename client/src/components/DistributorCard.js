import React from 'react';
import { Menu } from 'antd';
import Actions from './Actions';
import NameCard from './NameCard';
import PrimaryButton from './PrimaryButton';
import '../sass/accountCard.scss'
import '../sass/distributorCard.scss'

const DistributorCard = ({ data, onClick, btnTxt = 'Manage Account', isSuperAdmin, onSelect }) => {
    const { isActive, agencyName, operationalArea, contactPerson, mobileNumber, address, distributorId } = data

    const optionOne = isActive ? 'Inactive' : 'Active'

    const options = [
        <Menu.Item key={optionOne}>{optionOne}</Menu.Item>,
        <Menu.Item key="Delete">Delete</Menu.Item>
    ]

    const handleSelect = ({ key }) => {
        onSelect(key, distributorId)
    }

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
                <PrimaryButton text={btnTxt} onClick={() => onClick(distributorId)} />
                {
                    isSuperAdmin &&
                    <Actions options={options} onSelect={handleSelect} />
                }
            </div>
        </div>
    )
}

export default DistributorCard