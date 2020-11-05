import React from 'react';
import { Input } from 'antd';
import IdentityProof from '../../../../components/IdentityProof';
import InputWithAddon from '../../../../components/InputWithAddon';
import SelectInput from '../../../../components/SelectInput';
import { dayOptions, invoiceOptions, productOptions } from '../../../../assets/fixtures'

const GeneralAccountForm = () => {

    return (
        <>
            <div className='form-container'>
                <IdentityProof />
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>GST Number</label>
                        <InputWithAddon label='VERIFY' placeholder='GST Number' />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Name</label>
                        <Input size='large' placeholder='Name' />
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
                        <label className='app-input-label-name'>Delivery Days</label>
                        <SelectInput options={dayOptions} mode='multiple' />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Registered Date</label>
                        <Input size='large' type='date' placeholder='Registered Date' />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Add Products</label>
                        <SelectInput options={productOptions} mode='multiple' />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Deposit Amount</label>
                        <Input size='large' placeholder='Deposit Amount' />
                    </div>

                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Contact Person</label>
                        <Input size='large' placeholder='Contact Person' />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Phone Number</label>
                        <Input size='large' type='number' placeholder='Phone Number' />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Invoice Type</label>
                        <SelectInput options={invoiceOptions} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default GeneralAccountForm