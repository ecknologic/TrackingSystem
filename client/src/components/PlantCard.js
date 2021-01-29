import React from 'react';
import { Menu } from 'antd';
import Actions from './Actions';
import NameCard from './NameCard';
import PrimaryButton from './PrimaryButton';
import '../sass/accountCard.scss'
import '../sass/plantCard.scss'

const PlantCard = ({ data, onClick, btnTxt = 'Manage Account', isSuperAdmin, onSelect }) => {
    const { isApproved, departmentName, adminName, adminEmail, adminNumber, address, departmentId } = data

    const optionOne = isApproved ? 'Inactive' : 'Active'

    const options = [
        <Menu.Item key={optionOne}>{optionOne}</Menu.Item>,
        <Menu.Item key="Delete">Delete</Menu.Item>
    ]

    const handleSelect = ({ key }) => {
        onSelect(key, departmentId)
    }

    return (
        <div className='account-card-container plant-card-container'>
            <div className={isApproved ? 'badge active' : 'badge'}>{isApproved ? "ACTIVE" : "DRAFT"}</div>
            <div className='header'>
                <div className={isApproved ? 'inner green' : 'inner'}>
                    <div className='address-container'>
                        <span className='title clamp-1'>{departmentName}</span>
                        <span className='address clamp-2'>{address}</span>
                    </div>
                </div>
            </div>
            <div className='body'>
                <div className='contact-container'>
                    <span className='type1'>Admin</span>
                    <div className='contacts'>
                        <NameCard name={adminName} />
                    </div>
                </div>
                <div className='contact-container role'>
                    <span className='type1'>Contact Details</span>
                    <div className='contacts'>
                        <span >{adminEmail}</span>
                        <span >{adminNumber}</span>
                    </div>
                </div>
            </div>
            <div className='footer'>
                <PrimaryButton text={btnTxt} onClick={() => onClick(departmentId)} />
                {
                    isSuperAdmin &&
                    <Actions options={options} onSelect={handleSelect} />
                }
            </div>
        </div>
    )

}

export default PlantCard