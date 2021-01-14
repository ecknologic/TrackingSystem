import React from 'react';
import { Divider } from 'antd';
import InputValue from '../../../components/InputValue';
import { getRoleLabel } from '../../../utils/Functions';

const AccountView = ({ data, admin }) => {

    const { departmentName, address, phoneNumber, city, state, pinCode } = data
    const { roleId, emailid, mobileNumber, userName } = admin

    return (
        <div className='app-view-info'>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Name' />
                    <InputValue size='large' value={departmentName} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='Phone Number' />
                    <InputValue size='large' value={phoneNumber} />
                </div>
            </div>
            <div className='input-container half-stretch'>
                <InputValue size='smaller' value='Address' />
                <InputValue size='large' value={address} />
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='City' />
                    <InputValue size='large' value={city} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='State' />
                    <InputValue size='large' value={state} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='PIN Code' />
                    <InputValue size='large' value={pinCode} />
                </div>
            </div>
            <Divider className='form-divider' />
            <div className='plant-title-container inner'>
                <span className='title'>Admin Details</span>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Name' />
                    <InputValue size='large' value={userName} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='Contact Number' />
                    <InputValue size='large' value={mobileNumber} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Email' />
                    <InputValue size='large' value={emailid} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='Administrator Type' />
                    <InputValue size='large' value={getRoleLabel(roleId)} />
                </div>
            </div>
        </div>
    )
}
export default AccountView