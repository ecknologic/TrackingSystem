import React from 'react';
import NameCard from './NameCard';
import PrimaryButton from './PrimaryButton';
import '../sass/accountCard.scss'
import '../sass/plantCard.scss'

const PlantCard = ({ data, onClick, btnTxt = 'Manage Account' }) => {
    const { isApproved, departmentName, adminName, address } = data

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
            </div>
            <div className='footer'>
                <PrimaryButton text={btnTxt} onClick={onClick} />
            </div>
        </div>
    )

}

export default PlantCard