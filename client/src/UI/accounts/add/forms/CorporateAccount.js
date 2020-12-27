import React, { useEffect, useState } from 'react';
import InputWithAddon from '../../../../components/InputWithAddon';
import SelectInput from '../../../../components/SelectInput';
import DraggerInput from '../../../../components/DraggerInput';
import UploadPreviewer from '../../../../components/UploadPreviewer';
import { invoiceOptions, idOptions, businessOptions } from '../../../../assets/fixtures'
import { getIdProofName, getIDInputValidationProps, resetTrackForm, trackAccountFormOnce, removeFormTracker } from '../../../../utils/Functions';
import InputLabel from '../../../../components/InputLabel';
import CustomInput from '../../../../components/CustomInput';

const CorporateAccountForm = ({ data, errors, IDProofs, IDProofErrors, onChange, onBlur, onUpload, disabled, onRemove }) => {

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

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            removeFormTracker()
        }
    }, [])

    const idUploadDisable = Front && Back
    const gstUploadDisable = gstProof

    return (
        <div className='app-form-container'>
            <div className='app-identity-proof-container identity-proof-container'>
                <div className='input-container'>
                    <InputLabel name='Select Id Proof' error={errors.idProofType} mandatory />
                    <SelectInput track value={idProofType} options={idOptions} disabled={disabled} error={errors.idProofType} onSelect={(value) => onChange(value, 'idProofType')} />
                </div>
                {
                    idProofType && (
                        <div className='input-container second'>
                            <InputLabel name={proofName} error={errors[idProofType]} mandatory />
                            <CustomInput
                                disabled={disabled} maxLength={maxLength} uppercase
                                value={data[idProofType]} error={errors[idProofType]}
                                placeholder={`Add ${proofName}`}
                                onChange={(value) => onChange(value, idProofType)}
                                onBlur={(value) => onBlur(value, idProofType)}
                            />
                        </div>
                    )
                }
                <div className='upload-container'>
                    <DraggerInput onUpload={(file) => onUpload(file, 'idProofs')} disabled={idUploadDisable || disabled} />
                    <div className='upload-preview-container'>
                        <UploadPreviewer track value={Front} title='Front' disabled={disabled} onUpload={(file) => onUpload(file, 'Front')} onRemove={() => onRemove('Front')} error={IDProofErrors.Front} />
                        <UploadPreviewer track value={Back} title='Back' disabled={disabled} onUpload={(file) => onUpload(file, 'Back')} onRemove={() => onRemove('Back')} className='last' error={IDProofErrors.Back} />
                    </div>
                </div>
                <div className='upload-instructions'>
                    <span className='title'>Please help us verify your identity</span>
                    <span className='msg'>(Kindly upload the documents either in JPEG, PNG, or PDF format. The file should be less than 5MB) Need to upload front and back.</span>
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='GST Number' error={errors.gstNo} mandatory />
                    <InputWithAddon
                        maxLength={15} value={gstNo}
                        label='VERIFY' disabled={disabled} uppercase
                        placeholder='GST Number' error={errors.gstNo}
                        onBlur={(value) => onBlur(value, 'gstNo')}
                        onChange={(value) => onChange(value, 'gstNo')}
                    />
                </div>
                <div className='input-container app-upload-file-container app-gst-upload-container'>
                    <DraggerInput onUpload={(file) => onUpload(file, 'gstProof')} disabled={gstUploadDisable || disabled} />
                    <div className='upload-preview-container'>
                        <UploadPreviewer track value={gstProof} title='GST Proof' disabled={disabled} onUpload={(file) => onUpload(file, 'gstProof')} onRemove={() => onRemove('gstProof')} className='last' error={errors.gstProof} />
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Organization Name' error={errors.organizationName} mandatory />
                    <CustomInput
                        value={organizationName}
                        placeholder='Organization Name'
                        disabled={disabled}
                        error={errors.organizationName}
                        onChange={(value) => onChange(value, 'organizationName')}
                    />
                </div>

            </div>
            <div className='row'>
                <div className='input-container stretch'>
                    <InputLabel name='Address' error={errors.address} mandatory />
                    <CustomInput
                        value={address} placeholder='Add Address'
                        disabled={disabled} error={errors.address}
                        onChange={(value) => onChange(value, 'address')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Phone Number' error={errors.mobileNumber} mandatory />
                    <CustomInput
                        maxLength={10}
                        value={mobileNumber} disabled={disabled}
                        placeholder='Phone Number'
                        error={errors.mobileNumber}
                        onBlur={(value) => onBlur(value, 'mobileNumber')}
                        onChange={(value) => onChange(value, 'mobileNumber')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Email' error={errors.EmailId} mandatory />
                    <CustomInput
                        value={EmailId} type='email' disabled={disabled}
                        placeholder='Email' error={errors.EmailId}
                        onChange={(value) => onChange(value, 'EmailId')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Account Owner' error={errors.customerName} mandatory />
                    <CustomInput
                        value={customerName}
                        disabled={disabled}
                        placeholder='Account Owner'
                        error={errors.customerName}
                        onChange={(value) => onChange(value, 'customerName')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Nature Of Business' error={errors.natureOfBussiness} mandatory />
                    <SelectInput
                        value={natureOfBussiness}
                        options={businessOptions}
                        track disabled={disabled}
                        error={errors.natureOfBussiness}
                        onSelect={(value) => onChange(value, 'natureOfBussiness')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Registered Date' error={errors.registeredDate} mandatory />
                    <CustomInput value={registeredDate} placeholder='Registered Date' disabled />
                </div>
                <div className='input-container'>
                    <InputLabel name='Invoice Type' error={errors.invoicetype} mandatory />
                    <SelectInput
                        error={errors.invoicetype}
                        track value={invoicetype}
                        options={invoiceOptions} disabled={disabled}
                        onSelect={(value) => onChange(value, 'invoicetype')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Credit Period in Days' error={errors.creditPeriodInDays} mandatory />
                    <CustomInput
                        value={creditPeriodInDays}
                        disabled={disabled} placeholder='Credit Period'
                        error={errors.creditPeriodInDays}
                        onChange={(value) => onChange(value, 'creditPeriodInDays')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Referred By' error={errors.referredBy} mandatory />
                    <CustomInput
                        placeholder='Referral Name'
                        value={referredBy} disabled={disabled}
                        error={errors.referredBy}
                        onChange={(value) => onChange(value, 'referredBy')}
                    />
                </div>
            </div>
        </div>
    )
}

export default CorporateAccountForm