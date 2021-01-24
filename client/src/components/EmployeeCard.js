import React from 'react';
import PrimaryButton from './PrimaryButton';
import { getRoleLabel } from '../utils/Functions';
import '../sass/accountCard.scss'
import '../sass/employeeCard.scss'

const EmployeeCard = ({ data, onClick, btnTxt = 'Manage Account', isDriver }) => {
    const { RoleId, isActive, userName, mobileNumber, emailid, address, departmentName } = data
    let role, label

    if (isDriver) {
        label = departmentName ? 'Assigned To' : 'Not Assigned'
        role = departmentName && departmentName
    }
    else {
        label = departmentName ? 'Assigned To' : 'Role'
        role = departmentName ? departmentName : getRoleLabel(RoleId)
    }

    return (
        <div className='account-card-container employee-card-container'>
            <div className={isActive ? 'badge active' : 'badge'}>{isActive ? "ACTIVE" : "DRAFT"}</div>
            <div className='header'>
                <div className={isActive ? 'inner green' : 'inner'}>
                    <div className='address-container'>
                        <span className='title clamp-1'>{userName}</span>
                        <span className='address clamp-2'>{address}</span>
                    </div>
                </div>
            </div>
            <div className='body'>
                <div className='contact-container'>
                    <span className='type1'>Contact Details</span>
                    <div className='contacts'>
                        <span >{emailid}</span>
                        <span >{mobileNumber}</span>
                    </div>
                </div>
                <div className='contact-container role'>
                    <span className='type1'>{label}</span>
                    <div className='contacts'>
                        <span >{role}</span>
                    </div>
                </div>
            </div>
            <div className='footer'>
                <PrimaryButton text={btnTxt} onClick={onClick} />
            </div>
        </div>
    )
}

export default EmployeeCard