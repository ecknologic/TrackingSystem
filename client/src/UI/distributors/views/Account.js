import React from 'react';
import InputValue from '../../../components/InputValue';

const AccountView = ({ data }) => {

    const { agencyName, operationalArea, contactPerson, mobileNumber, address,
        alternateNumber, mailId, alternateMailId } = data

    return (
        <div className='app-view-info'>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Agency Name' />
                    <InputValue size='large' value={agencyName} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value="Operational Area" />
                    <InputValue size='large' value={operationalArea} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container stretch'>
                    <InputValue size='smaller' value='Address' />
                    <InputValue size='large' value={address} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Mobile Number' />
                    <InputValue size='large' value={mobileNumber} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='Alternate Mobile No' />
                    <InputValue size='large' value={alternateNumber} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Email' />
                    <InputValue size='large' value={mailId} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='Alternate Email' />
                    <InputValue size='large' value={alternateMailId} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Contact Person' />
                    <InputValue size='large' value={contactPerson} />
                </div>
            </div>
        </div>
    )
}
export default AccountView