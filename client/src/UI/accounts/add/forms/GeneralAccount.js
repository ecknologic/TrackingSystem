import React from 'react';
import { Input } from 'antd';
import IdentityProof from '../../../../components/IdentityProof';
import InputWithAddon from '../../../../components/InputWithAddon';
import SelectInput from '../../../../components/SelectInput';
import { dayOptions, invoiceOptions, productOptions } from '../../../../assets/fixtures'

const GeneralAccountForm = (props) => {
    const { onChange } = props

    return (
        <>
            <div className='form-container'>
                <IdentityProof />
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>GST Number</label>
                        <InputWithAddon label='VERIFY' placeholder='GST Number' onChange={({ target: { value } }) => onChange(value, 'gstProof')} />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Name</label>
                        <Input size='large' placeholder='Name' onChange={({ target: { value } }) => onChange(value, 'customerName')} />
                    </div>

                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <label className='app-input-label-name'>Address</label>
                        <Input size='large' placeholder='Add Address' onChange={({ target: { value } }) => onChange(value, 'shippingAddress')} />
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
                        <label className='app-input-label-name'>Delivery Days</label>
                        <SelectInput options={dayOptions} mode='multiple' onSelect={(value) => onChange(value, 'deliveryDays')} />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Registered Date</label>
                        <Input size='large' type='date' placeholder='Registered Date' />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Add Products</label>
                        <SelectInput options={productOptions} mode='multiple' onSelect={(value) => onChange(value, 'products')} />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Deposit Amount</label>
                        <Input size='large' placeholder='Deposit Amount' onChange={({ target: { value } }) => onChange(value, 'depositAmount')} />
                    </div>

                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Contact Person</label>
                        <Input size='large' placeholder='Add Name' onChange={({ target: { value } }) => onChange(value, 'contactPerson')} />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Invoice Type</label>
                        <SelectInput options={invoiceOptions} onSelect={(value) => onChange(value, 'invoiceType')} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default GeneralAccountForm