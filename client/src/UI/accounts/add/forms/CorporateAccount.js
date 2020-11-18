import { Input, InputNumber } from 'antd';
import React, { useEffect, useState } from 'react';
import InputWithAddon from '../../../../components/InputWithAddon';
import SelectInput from '../../../../components/SelectInput';
import DraggerInput from '../../../../components/DraggerInput';
import UploadPreviewer from '../../../../components/UploadPreviewer';
import { invoiceOptions, idOptions, businessOptions } from '../../../../assets/fixtures'
import { getIdProofName, getIDInputValidationProps } from '../../../../utils/Functions';
import InputLabel from '../../../../components/InputLabel';

const CorporateAccountForm = ({ data, IDErrors, IDProofs, onChange, onUpload, disabled, onRemove, track }) => {

    const {
        gstNo, natureOfBussiness, organizationName, address, customerName,
        mobileNumber, invoicetype, creditPeriodInDays, EmailId, referredBy, idProofType,
        registeredDate, gstProof
    } = data

    const [proofName, setProofName] = useState('')
    const [idProps, setIdProps] = useState({})
    const { Front, Back } = IDProofs
    const { maxLength } = idProps

    useEffect(() => {
        setProofName(getIdProofName(idProofType))
        const props = getIDInputValidationProps(idProofType)
        setIdProps(props)
    }, [idProofType])

    const idUploadDisable = Front && Back
    const gstUploadDisable = gstProof

    return (
        <div className='app-form-container form-container'>
            <div className='app-identity-proof-container identity-proof-container'>
                <div className='input-container'>
                    <label className='app-input-label-name'>Select Id Proof</label>
                    <SelectInput track={track} value={idProofType} options={idOptions} disabled={disabled} onSelect={(value) => onChange(value, 'idProofType')} />
                </div>
                {
                    idProofType && (
                        <div className='input-container second'>
                            <InputLabel name={proofName} error={IDErrors[idProofType]} />
                            <Input maxLength={maxLength} size='large' value={data[idProofType]} placeholder={`Add ${proofName}`} className={`app-id-input ${IDErrors[idProofType] ? 'app-input-error' : ''}`} disabled={disabled} onChange={({ target: { value } }) => onChange(value, idProofType)} />
                        </div>
                    )
                }
                <div className='upload-container'>
                    <DraggerInput onUpload={(file) => onUpload(file, 'idProofs')} disabled={idUploadDisable || disabled} />
                    <div className='upload-preview-container'>
                        <UploadPreviewer value={Front} title='Front' disabled={disabled} onRemove={() => onRemove('Front')} />
                        <UploadPreviewer value={Back} title='Back' disabled={disabled} onRemove={() => onRemove('Back')} className='last' />
                    </div>
                </div>
                <div className='upload-instructions'>
                    <span className='title'>Please help us verify your identity</span>
                    <span className='msg'>(Kindly upload the documents either in JPEG, PNG, or PDF format. The file should be less than 5MB) Need to upload front and back.</span>
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='GST Number' />
                    <InputWithAddon value={gstNo} label='VERIFY' disabled={disabled} placeholder='GST Number' onChange={({ target: { value } }) => onChange(value, 'gstNo')} />
                </div>
                <div className='input-container app-upload-file-container app-gst-upload-container'>
                    <DraggerInput onUpload={(file) => onUpload(file, 'gstProof')} disabled={gstUploadDisable || disabled} />
                    <div className='upload-preview-container'>
                        <UploadPreviewer value={gstProof} title='GST Proof' disabled={disabled} onRemove={() => onRemove('gstProof')} className='last' />
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Organization Name' />
                    <Input size='large' value={organizationName} placeholder='Organization Name' disabled={disabled} onChange={({ target: { value } }) => onChange(value, 'organizationName')} />
                </div>

            </div>
            <div className='row'>
                <div className='input-container stretch'>
                    <InputLabel name='Address' />
                    <Input size='large' value={address} placeholder='Add Address' disabled={disabled} onChange={({ target: { value } }) => onChange(value, 'address')} />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Phone Number' />
                    <InputNumber size="large" value={mobileNumber} disabled={disabled} placeholder='Phone Number' onChange={(value) => onChange(value, 'mobileNumber')} />
                </div>
                <div className='input-container'>
                    <InputLabel name='Email' />
                    <Input size='large' value={EmailId} type='email' disabled={disabled} placeholder='Email' onChange={({ target: { value } }) => onChange(value, 'EmailId')} />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Account Owner' />
                    <Input size='large' value={customerName} disabled={disabled} placeholder='Account Owner' onChange={({ target: { value } }) => onChange(value, 'customerName')} />
                </div>
                <div className='input-container'>
                    <InputLabel name='Nature Of Business' />
                    <SelectInput track={track} value={natureOfBussiness} disabled={disabled} options={businessOptions} onSelect={(value) => onChange(value, 'natureOfBussiness')} />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Registered Date' />
                    <Input size='large' value={registeredDate} placeholder='Registered Date' disabled />
                </div>
                <div className='input-container'>
                    <InputLabel name='Invoice Type' />
                    <SelectInput track={track} value={invoicetype} options={invoiceOptions} disabled={disabled} onSelect={(value) => onChange(value, 'invoicetype')} />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Credit Period in Days' />
                    <InputNumber size="large" value={creditPeriodInDays} disabled={disabled} placeholder='Credit Period' onChange={(value) => onChange(value, 'creditPeriodInDays')} />
                </div>
                <div className='input-container'>
                    <InputLabel name='Referred By' />
                    <Input size='large' value={referredBy} disabled={disabled} placeholder='Referral Name' onChange={({ target: { value } }) => onChange(value, 'referredBy')} />
                </div>
            </div>
        </div>
    )
}

export default CorporateAccountForm