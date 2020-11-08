import { Input } from 'antd';
import React from 'react';
import DraggerInput from '../../../../components/DraggerInput';
import SelectInput from '../../../../components/SelectInput';
import InputWithAddon from '../../../../components/InputWithAddon';
import UploadPreviewer from '../../../../components/UploadPreviewer';
import { dayOptions, invoiceOptions, productOptions, idOptions } from '../../../../assets/fixtures'

const GeneralAccountForm = (props) => {
    const { data, onChange, onUpload, onSelect, onDeselect, onIdProofSelect } = props

    const {
        gstNo, shippingAddress, depositAmount,
        deliveryDays, customerName, mobileNumber,
        invoiceType, EmailId, contactPerson, proofName, proofSelect,
        proofInput, idProofs = []
    } = data

    const draggerDisable = idProofs.length >= 2

    return (
        <>
            <div className='form-container'>
                <div className='identity-proof-container'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Select Id Proof</label>
                        <SelectInput value={proofSelect} options={idOptions} onSelect={onIdProofSelect} />
                    </div>
                    {
                        proofSelect && (
                            <div className='input-container second'>
                                <label className='app-input-label-name'>{proofName}</label>
                                <Input size='large' value={proofInput} placeholder={`Add ${proofName}`} onChange={({ target: { value } }) => onChange(value, 'proofInput')} />
                            </div>
                        )
                    }
                    <div className='upload-container'>
                        <DraggerInput onUpload={onUpload} disabled={draggerDisable} />
                        <UploadPreviewer data={idProofs} />
                    </div>
                    <div className='upload-instructions'>
                        <span className='title'>Please help us verify your identity</span>
                        <span className='msg'>(Kindly upload the documents either in JPEG, PNG, or PDF format. The file should be less than 5MB) Need to upload front and back.</span>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>GST Number</label>
                        <InputWithAddon value={gstNo} label='VERIFY' placeholder='GST Number' onChange={({ target: { value } }) => onChange(value, 'gstNo')} />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Name</label>
                        <Input value={customerName} size='large' placeholder='Add Name' onChange={({ target: { value } }) => onChange(value, 'customerName')} />
                    </div>

                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <label className='app-input-label-name'>Address</label>
                        <Input value={shippingAddress} size='large' placeholder='Add Address' onChange={({ target: { value } }) => oncancel(value, 'shippingAddress')} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Phone Number</label>
                        <Input size='large' value={mobileNumber} type='number' placeholder='Phone Number' onChange={({ target: { value } }) => onChange(value, 'mobileNumber')} />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Email</label>
                        <Input size='large' value={EmailId} type='email' placeholder='Email' onChange={({ target: { value } }) => onChange(value, 'EmailId')} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Delivery Days</label>
                        <SelectInput value={deliveryDays} options={dayOptions} mode='multiple' onSelect={(value) => onSelect(value, 'deliveryDays')} onDeselect={(value) => onDeselect(value, 'deliveryDays')} />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Registered Date</label>
                        <Input size='large' type='date' placeholder='Registered Date' />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Deposit Amount</label>
                        <Input size='large' value={depositAmount} placeholder='Deposit Amount' onChange={({ target: { value } }) => onChange(value, 'depositAmount')} />
                    </div>

                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Contact Person</label>
                        <Input size='large' value={contactPerson} placeholder='Add Name' onChange={({ target: { value } }) => onChange(value, 'contactPerson')} />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Invoice Type</label>
                        <SelectInput value={invoiceType} options={invoiceOptions} onSelect={(value) => onChange(value, 'invoiceType')} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default GeneralAccountForm