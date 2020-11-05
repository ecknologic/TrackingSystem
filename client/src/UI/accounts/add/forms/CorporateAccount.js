import React from 'react';
import { Input } from 'antd';
import IdentityProof from '../../../../components/IdentityProof';
import InputWithAddon from '../../../../components/InputWithAddon';
import SelectInput from '../../../../components/SelectInput';
import { businessOptions, invoiceOptions, numOptions } from '../../../../assets/fixtures'

const CorporateAccountForm = () => {

    return (
        <div className='app-form-container form-container'>
            <IdentityProof />
            <div className='row'>
                <div className='input-container'>
                    <label className='app-input-label-name'>GST Number</label>
                    <InputWithAddon label='VERIFY' placeholder='GST Number' />
                </div>
                <div className='input-container'>
                    <label className='app-input-label-name'>Organization Name</label>
                    <Input size='large' placeholder='Organization Name' />
                </div>

            </div>
            <div className='row'>
                <div className='input-container stretch'>
                    <label className='app-input-label-name'>Address</label>
                    <Input size='large' placeholder='Address' />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <label className='app-input-label-name'>Phone Number</label>
                    <Input size='large' type='number' placeholder='Phone Number' />
                </div>
                <div className='input-container'>
                    <label className='app-input-label-name'>Email</label>
                    <Input size='large' type='email' placeholder='Email' />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <label className='app-input-label-name'>Account Owner</label>
                    <Input size='large' placeholder='Account Owner' />
                </div>
                <div className='input-container'>
                    <label className='app-input-label-name'>Nature Of Business</label>
                    <SelectInput options={businessOptions} />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <label className='app-input-label-name'>Registered Date</label>
                    <Input size='large' type='date' placeholder='Registered Date' />
                </div>
                <div className='input-container'>
                    <label className='app-input-label-name'>Invoice Type</label>
                    <SelectInput options={invoiceOptions} />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <label className='app-input-label-name'>Credit Period in Days</label>
                    <SelectInput options={numOptions} />
                </div>
                <div className='input-container'>
                    <label className='app-input-label-name'>Referred By</label>
                    <Input size='large' placeholder='Referred By' />
                </div>
            </div>
        </div>
    )
}

export default CorporateAccountForm