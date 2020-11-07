import React from 'react';
import { Input } from 'antd';
import IdentityProof from '../../../../components/IdentityProof';
import InputWithAddon from '../../../../components/InputWithAddon';
import SelectInput from '../../../../components/SelectInput';
import { businessOptions, invoiceOptions, numOptions } from '../../../../assets/fixtures'

const CorporateAccountForm = (props) => {
    const { idProofs, onChange } = props

    return (
        <div className='app-form-container form-container'>
            <IdentityProof idProofs={idProofs} />
            <div className='row'>
                <div className='input-container'>
                    <label className='app-input-label-name'>GST Number</label>
                    <InputWithAddon label='VERIFY' placeholder='GST Number' onChange={({ target: { value } }) => onChange(value, 'gstProof')} />
                </div>
                <div className='input-container'>
                    <label className='app-input-label-name'>Organization Name</label>
                    <Input size='large' placeholder='Organization Name' onChange={({ target: { value } }) => onChange(value, 'organizationName')} />
                </div>

            </div>
            <div className='row'>
                <div className='input-container stretch'>
                    <label className='app-input-label-name'>Address</label>
                    <Input size='large' placeholder='Address' onChange={({ target: { value } }) => onChange(value, 'shippingAddress')} />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <label className='app-input-label-name'>Phone Number</label>
                    <Input size='large' type='number' placeholder='Phone Number' onChange={({ target: { value } }) => onChange(value, 'mobileNumber')} />
                </div>
                <div className='input-container'>
                    <label className='app-input-label-name'>Email</label>
                    <Input size='large' type='email' placeholder='Email' onChange={({ target: { value } }) => onChange(value, 'EmailId')} />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <label className='app-input-label-name'>Account Owner</label>
                    <Input size='large' placeholder='Account Owner' onChange={({ target: { value } }) => onChange(value, 'customerName')} />
                </div>
                <div className='input-container'>
                    <label className='app-input-label-name'>Nature Of Business</label>
                    <SelectInput options={businessOptions} onSelect={(value) => onChange(value, 'natureOfBussiness')} />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <label className='app-input-label-name'>Registered Date</label>
                    <Input size='large' type='date' placeholder='Registered Date' />
                </div>
                <div className='input-container'>
                    <label className='app-input-label-name'>Invoice Type</label>
                    <SelectInput options={invoiceOptions} onSelect={(value) => onChange(value, 'invoicetype')} />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <label className='app-input-label-name'>Credit Period in Days</label>
                    <SelectInput options={numOptions} onSelect={(value) => onChange(value, 'creditPeriodInDays')} />
                </div>
                <div className='input-container'>
                    <label className='app-input-label-name'>Referred By</label>
                    <Input size='large' placeholder='Referral Name' onChange={({ target: { value } }) => onChange(value, 'referredBy')} />
                </div>
            </div>
        </div>
    )
}

export default CorporateAccountForm