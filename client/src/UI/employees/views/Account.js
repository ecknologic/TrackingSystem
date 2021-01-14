import React from 'react';
import dayjs from 'dayjs';
import InputValue from '../../../components/InputValue';
import { getRoleLabel } from '../../../utils/Functions';
const DATEFORMAT = 'DD/MM/YYYY'

const AccountView = ({ data, isDriver }) => {

    const {
        userName, parentName, gender, dob, mobileNumber, address, joinedDate, permanentAddress,
        roleId, emailid
    } = data

    return (
        <div className='app-view-info'>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Name' />
                    <InputValue size='large' value={userName} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value="Parent's Name" />
                    <InputValue size='large' value={parentName} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Email ID' />
                    <InputValue size='large' value={emailid} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='Contact Number' />
                    <InputValue size='large' value={mobileNumber} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Gender' />
                    <InputValue size='large' value={gender} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='Date of Birth' />
                    <InputValue size='large' value={dayjs(dob).format(DATEFORMAT)} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Date of Joining' />
                    <InputValue size='large' value={dayjs(joinedDate).format(DATEFORMAT)} />
                </div>
                {
                    !isDriver && (
                        <div className='input-container'>
                            <InputValue size='smaller' value='Administrator Role' />
                            <InputValue size='large' value={getRoleLabel(roleId)} />
                        </div>
                    )
                }
            </div>
            <div className='input-container half-stretch'>
                <InputValue size='smaller' value='Address of Communtication' />
                <InputValue size='large' value={address} />
            </div>
            <div className='input-container half-stretch'>
                <InputValue size='smaller' value='Permanent Address' />
                <InputValue size='large' value={permanentAddress} />
            </div>
        </div>
    )
}
export default AccountView