import React from 'react';
import { Input } from 'antd';
import InputWithAddon from '../../../../components/InputWithAddon';
import SelectInput from '../../../../components/SelectInput';
import DraggerInput from '../../../../components/DraggerInput';
import UploadPreviewer from '../../../../components/UploadPreviewer';
import { invoiceOptions, numOptions, idOptions, businessOptions } from '../../../../assets/fixtures'

const CorporateAccountForm = ({ data, onChange, onUpload, onIdProofSelect }) => {

    const {
        gstNo, natureOfBussiness, organizationName,
        address, customerName, mobileNumber, invoicetype,
        creditPeriodInDays, EmailId, referredBy, proofName, proofSelect,
        proofInput, idProofs = []
    } = data

    const draggerDisable = idProofs.length >= 2

    return (
        <div className='app-form-container form-container'>
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
                    <DraggerInput onUpload={(file) => onUpload(file, 'idProofs')} disabled={draggerDisable} />
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
                    <label className='app-input-label-name'>Organization Name</label>
                    <Input size='large' value={organizationName} placeholder='Organization Name' onChange={({ target: { value } }) => onChange(value, 'organizationName')} />
                </div>

            </div>
            <div className='row'>
                <div className='input-container stretch'>
                    <label className='app-input-label-name'>Address</label>
                    <Input size='large' value={address} placeholder='Add Address' onChange={({ target: { value } }) => onChange(value, 'address')} />
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
                    <label className='app-input-label-name'>Account Owner</label>
                    <Input size='large' value={customerName} placeholder='Account Owner' onChange={({ target: { value } }) => onChange(value, 'customerName')} />
                </div>
                <div className='input-container'>
                    <label className='app-input-label-name'>Nature Of Business</label>
                    <SelectInput value={natureOfBussiness} options={businessOptions} onSelect={(value) => onChange(value, 'natureOfBussiness')} />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <label className='app-input-label-name'>Registered Date</label>
                    <Input size='large' type='date' placeholder='Registered Date' />
                </div>
                <div className='input-container'>
                    <label className='app-input-label-name'>Invoice Type</label>
                    <SelectInput value={invoicetype} options={invoiceOptions} onSelect={(value) => onChange(value, 'invoicetype')} />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <label className='app-input-label-name'>Credit Period in Days</label>
                    <SelectInput value={creditPeriodInDays} options={numOptions} onSelect={(value) => onChange(value, 'creditPeriodInDays')} />
                </div>
                <div className='input-container'>
                    <label className='app-input-label-name'>Referred By</label>
                    <Input size='large' value={referredBy} placeholder='Referral Name' onChange={({ target: { value } }) => onChange(value, 'referredBy')} />
                </div>
            </div>
        </div>
    )
}

export default CorporateAccountForm