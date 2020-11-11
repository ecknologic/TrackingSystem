import { Input } from 'antd';
import React, { useEffect, useState } from 'react';
import InputWithAddon from '../../../../components/InputWithAddon';
import SelectInput from '../../../../components/SelectInput';
import DraggerInput from '../../../../components/DraggerInput';
import UploadPreviewer from '../../../../components/UploadPreviewer';
import { invoiceOptions, idOptions, businessOptions } from '../../../../assets/fixtures'
import { getIdProofName } from '../../../../utils/Functions';

const CorporateAccountForm = ({ data, IDProofs, onChange, onUpload, disabled, onRemove }) => {

    const {
        gstNo, natureOfBussiness, organizationName, address, customerName,
        mobileNumber, invoicetype, creditPeriodInDays, EmailId, referredBy, idProofType,
        registeredDate, gstProof
    } = data

    const [proofName, setProofName] = useState('')
    const { Front, Back } = IDProofs

    useEffect(() => {
        setProofName(getIdProofName(idProofType))
    }, [idProofType])

    const idUploadDisable = Front && Back
    const gstUploadDisable = gstProof

    return (
        <div className='app-form-container form-container'>
            <div className='app-identity-proof-container identity-proof-container'>
                <div className='input-container'>
                    <label className='app-input-label-name'>Select Id Proof</label>
                    <SelectInput value={idProofType} options={idOptions} disabled={disabled} onSelect={(value) => onChange(value, 'idProofType')} />
                </div>
                {
                    idProofType && (
                        <div className='input-container second'>
                            <label className='app-input-label-name'>{proofName}</label>
                            <Input size='large' value={data[idProofType]} placeholder={`Add ${proofName}`} disabled={disabled} onChange={({ target: { value } }) => onChange(value, idProofType)} />
                        </div>
                    )
                }
                <div className='upload-container'>
                    <DraggerInput onUpload={(file) => onUpload(file, 'idProofs')} disabled={idUploadDisable || disabled} />
                    <div className='upload-preview-container'>
                        <UploadPreviewer value={Front} title='Front' disabled={disabled} onRemove={() => onRemove('Front')} />
                        <UploadPreviewer value={Back} title='Back' disabled={disabled} onRemove={() => onRemove('Back')} />
                    </div>
                </div>
                <div className='upload-instructions'>
                    <span className='title'>Please help us verify your identity</span>
                    <span className='msg'>(Kindly upload the documents either in JPEG, PNG, or PDF format. The file should be less than 5MB) Need to upload front and back.</span>
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <label className='app-input-label-name'>GST Number</label>
                    <InputWithAddon value={gstNo} label='VERIFY' disabled={disabled} placeholder='GST Number' onChange={({ target: { value } }) => onChange(value, 'gstNo')} />
                </div>
                <div className='input-container app-upload-file-container'>
                    <DraggerInput onUpload={(file) => onUpload(file, 'gstProof')} disabled={gstUploadDisable || disabled} />
                    <div className='upload-preview-container'>
                        <UploadPreviewer value={gstProof} title='GST Proof' disabled={disabled} onRemove={() => onRemove('gstProof')} />
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <label className='app-input-label-name'>Organization Name</label>
                    <Input size='large' value={organizationName} placeholder='Organization Name' disabled={disabled} onChange={({ target: { value } }) => onChange(value, 'organizationName')} />
                </div>

            </div>
            <div className='row'>
                <div className='input-container stretch'>
                    <label className='app-input-label-name'>Address</label>
                    <Input size='large' value={address} placeholder='Add Address' disabled={disabled} onChange={({ target: { value } }) => onChange(value, 'address')} />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <label className='app-input-label-name'>Phone Number</label>
                    <Input size='large' value={mobileNumber} type='number' disabled={disabled} placeholder='Phone Number' onChange={({ target: { value } }) => onChange(value, 'mobileNumber')} />
                </div>
                <div className='input-container'>
                    <label className='app-input-label-name'>Email</label>
                    <Input size='large' value={EmailId} type='email' disabled={disabled} placeholder='Email' onChange={({ target: { value } }) => onChange(value, 'EmailId')} />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <label className='app-input-label-name'>Account Owner</label>
                    <Input size='large' value={customerName} disabled={disabled} placeholder='Account Owner' onChange={({ target: { value } }) => onChange(value, 'customerName')} />
                </div>
                <div className='input-container'>
                    <label className='app-input-label-name'>Nature Of Business</label>
                    <SelectInput value={natureOfBussiness} disabled={disabled} options={businessOptions} onSelect={(value) => onChange(value, 'natureOfBussiness')} />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <label className='app-input-label-name'>Registered Date</label>
                    <Input size='large' value={registeredDate} placeholder='Registered Date' disabled />
                </div>
                <div className='input-container'>
                    <label className='app-input-label-name'>Invoice Type</label>
                    <SelectInput value={invoicetype} options={invoiceOptions} disabled={disabled} onSelect={(value) => onChange(value, 'invoicetype')} />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <label className='app-input-label-name'>Credit Period in Days</label>
                    <Input size='large' value={creditPeriodInDays} disabled={disabled} type='number' placeholder='Credit Period' onChange={({ target: { value } }) => onChange(value, 'creditPeriodInDays')} />
                </div>
                <div className='input-container'>
                    <label className='app-input-label-name'>Referred By</label>
                    <Input size='large' value={referredBy} disabled={disabled} placeholder='Referral Name' onChange={({ target: { value } }) => onChange(value, 'referredBy')} />
                </div>
            </div>
        </div>
    )
}

export default CorporateAccountForm