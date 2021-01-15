import React from 'react';
import PrimaryButton from './PrimaryButton';
import '../sass/accountCard.scss'
import '../sass/employeeCard.scss'
import { getRoleLabel } from '../utils/Functions';

const EmployeeCard = ({ data, onClick, btnTxt = 'Manage Account' }) => {
    const { RoleId, isActive, userName, mobileNumber, emailid, address, userId } = data

    const styles = {
        container: userId ? { height: '22.1em' } : {},
        body: userId ? { height: '9.5em' } : {},
        role: { paddingTop: '.5em' }
    }

    return (
        <div className='account-card-container employee-card-container' style={styles.container}>
            <div className={isActive ? 'badge active' : 'badge'}>{isActive ? "ACTIVE" : "DRAFT"}</div>
            <div className='header'>
                <div className={isActive ? 'inner green' : 'inner'}>
                    <div className='address-container'>
                        <span className='title clamp-1'>{userName}</span>
                        <span className='address clamp-2'>{address}</span>
                    </div>
                </div>
            </div>
            <div className='body' style={styles.body}>
                <div className='contact-container'>
                    <span className='type1'>Contact Details</span>
                    <div className='contacts'>
                        <span >{emailid}</span>
                        <span >{mobileNumber}</span>
                    </div>
                </div>
                {
                    userId &&
                    <div className='contact-container' style={styles.role}>
                        <span className='type1'>Role</span>
                        <div className='contacts'>
                            <span >{getRoleLabel(RoleId)}</span>
                        </div>
                    </div>
                }
            </div>
            <div className='footer'>
                <PrimaryButton text={btnTxt} onClick={onClick} />
            </div>
        </div>
    )
}

export default EmployeeCard