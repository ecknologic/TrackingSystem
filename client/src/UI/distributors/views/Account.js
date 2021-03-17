import React from 'react';
import InputValue from '../../../components/InputValue';

const AccountView = ({ data }) => {

    const { agencyName, operationalArea, contactPerson, mobileNumber, address,
        alternatePhNo, mailId, alternateMailId } = data

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
                    <InputValue size='smaller' value='Contact Person' />
                    <InputValue size='large' value={contactPerson} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Mobile Number' />
                    <InputValue size='large' value={mobileNumber} />
                </div>
                {
                    alternatePhNo && (
                        <div className='input-container'>
                            <InputValue size='smaller' value='Alternate Mobile No' />
                            <InputValue size='large' value={alternatePhNo} />
                        </div>
                    )
                }
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Email' />
                    <InputValue size='large' value={mailId} />
                </div>
                {
                    alternateMailId && (
                        <div className='input-container'>
                            <InputValue size='smaller' value='Alternate Email' />
                            <InputValue size='large' value={alternateMailId} />
                        </div>
                    )
                }
            </div>
        </div>
    )
}
export default AccountView