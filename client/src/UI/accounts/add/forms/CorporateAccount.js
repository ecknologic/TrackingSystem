import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import InputLabel from '../../../../components/InputLabel';
import CustomInput from '../../../../components/CustomInput';
import SelectInput from '../../../../components/SelectInput';
import DraggerInput from '../../../../components/DraggerInput';
import CustomTextArea from '../../../../components/CustomTextArea';
import UploadPreviewer from '../../../../components/UploadPreviewer';
import { invoiceOptions, corpIdOptions } from '../../../../assets/fixtures'
import { getIdProofName, getIDInputValidationProps, resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';
const DATEFORMAT = 'DD/MM/YYYY'

const CorporateAccountForm = (props) => {
    const { data, errors, IDProofs = {}, IDProofErrors, onChange, onBlur, onUpload,
        disabled, onRemove, businessOptions, agentOptions } = props
    const {
        gstNo, natureOfBussiness, organizationName, address, contactPerson, poNo, alternatePhNo,
        mobileNumber, invoicetype, creditPeriodInDays, EmailId, referredBy, idProofType, salesAgent,
        registeredDate, gstProof, depositAmount, pinCode, dispenserCount, contractPeriod
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
            resetTrackForm()
        }
    }, [])

    const idUploadDisable = idProofType !== 'panNo' ? Front && Back : Front
    const gstUploadDisable = gstProof

    return (
        <div className='app-form-container'>
            <div className='app-identity-proof-container identity-proof-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Select Id Proof' error={errors.idProofType} />
                        <SelectInput track value={idProofType} options={corpIdOptions} disabled={disabled} error={errors.idProofType} onSelect={(value) => onChange(value, 'idProofType')} />
                    </div>
                    {
                        idProofType && (
                            <div className='input-container'>
                                <InputLabel name={proofName} error={errors[idProofType]} />
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
                </div>
                <div className='upload-container'>
                    <DraggerInput onUpload={(file) => onUpload(file, 'idProofs')} disabled={idUploadDisable || disabled} />
                    <div className='upload-preview-container'>
                        <UploadPreviewer track value={Front} title='Front' disabled={disabled} onUpload={(file) => onUpload(file, 'Front')} onRemove={() => onRemove('Front')} error={IDProofErrors.Front} />
                        {
                            idProofType !== 'panNo' &&
                            <UploadPreviewer track value={Back} title='Back' disabled={disabled} onUpload={(file) => onUpload(file, 'Back')} onRemove={() => onRemove('Back')} className='last' error={IDProofErrors.Back} />
                        }
                    </div>
                </div>
                <div className='upload-instructions'>
                    <span className='title'>Please help us verify your identity</span>
                    <span className='msg'>(Kindly upload the documents either in JPEG, PNG, or PDF format. The file should be less than 5MB) Need to upload front and back.</span>
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='GST Number' error={errors.gstNo} />
                    <CustomInput
                        maxLength={15} value={gstNo}
                        disabled={disabled} uppercase
                        placeholder='GST Number' error={errors.gstNo}
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
                    <CustomTextArea maxLength={256} disabled={disabled} error={errors.address} placeholder='Add Address'
                        value={address} minRows={1} maxRows={2} onChange={(value) => onChange(value, 'address')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='PIN Code' error={errors.pinCode} mandatory />
                    <CustomInput value={pinCode} placeholder='Add PIN Code'
                        error={errors.pinCode} maxLength={6} onBlur={(value) => onBlur(value, 'pinCode')}
                        onChange={(value) => onChange(value, 'pinCode')}
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
                    <InputLabel name='Official Email' error={errors.EmailId} mandatory />
                    <CustomInput
                        value={EmailId} type='email' disabled={disabled}
                        placeholder='Official Email' error={errors.EmailId}
                        onBlur={(value) => onBlur(value, 'EmailId')}
                        onChange={(value) => onChange(value, 'EmailId')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Contact Person' error={errors.contactPerson} mandatory />
                    <CustomInput
                        value={contactPerson}
                        disabled={disabled}
                        placeholder='Contact Person'
                        error={errors.contactPerson}
                        onChange={(value) => onChange(value, 'contactPerson')}
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
                    <InputLabel name='Alternate Phone No' error={errors.alternatePhNo} />
                    <CustomInput value={alternatePhNo} placeholder='Alternate Phone Number'
                        error={errors.alternatePhNo} maxLength={15}
                        onChange={(value) => onChange(value, 'alternatePhNo')}
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
                    <InputLabel name='Contract Period' error={errors.contractPeriod} mandatory />
                    <CustomInput
                        value={contractPeriod}
                        disabled={disabled} placeholder='Contract Period'
                        error={errors.contractPeriod}
                        onChange={(value) => onChange(value, 'contractPeriod')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Deposit Amount' error={errors.depositAmount} mandatory />
                    <CustomInput value={depositAmount}
                        disabled={disabled} placeholder='Deposit Amount'
                        error={errors.depositAmount}
                        onChange={(value) => onChange(value, 'depositAmount')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Dispenser' error={errors.dispenserCount} mandatory />
                    <CustomInput
                        value={dispenserCount}
                        disabled={disabled} placeholder='Dispenser Qty'
                        error={errors.dispenserCount}
                        onChange={(value) => onChange(value, 'dispenserCount')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='PO Number' error={errors.poNo} />
                    <CustomInput value={poNo}
                        error={errors.poNo} placeholder='PO Number'
                        onChange={(value) => onChange(value, 'poNo')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Sales & Collection Agent' error={errors.salesAgent} mandatory />
                    <SelectInput
                        value={salesAgent}
                        options={agentOptions}
                        track disabled={disabled}
                        error={errors.salesAgent}
                        onSelect={(value, label) => onChange(value, 'salesAgent', label, 'salesAgentName')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Registered Date' error={errors.registeredDate} />
                    <CustomInput value={dayjs(registeredDate).format(DATEFORMAT)} placeholder='Registered Date' disabled />
                </div>
                <div className='input-container'>
                    <InputLabel name='Referred By' error={errors.referredBy} />
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