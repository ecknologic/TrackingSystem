import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import InputLabel from '../../../../components/InputLabel';
import CustomInput from '../../../../components/CustomInput';
import SelectInput from '../../../../components/SelectInput';
import DraggerInput from '../../../../components/DraggerInput';
import InputWithAddon from '../../../../components/InputWithAddon';
import UploadPreviewer from '../../../../components/UploadPreviewer';
import { invoiceOptions, businessOptions } from '../../../../assets/fixtures'
import { resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';
const DATEFORMAT = 'DD/MM/YYYY'

const ApprovalForm = (props) => {
    const { data, errors, onChange, onBlur, onUpload, disabledItems, disabled, onRemove } = props

    const {
        gstNo, natureOfBussiness, organizationName, address, customerName, mobileNumber, invoicetype,
        creditPeriodInDays, EmailId, referredBy, registeredDate, gstProof, customertype
    } = data

    const { gstDisable } = disabledItems
    const isCorporate = customertype === 'Corporate'

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    return (
        <div className='app-form-container'>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='GST Number' error={errors.gstNo} mandatory={isCorporate} />
                    <InputWithAddon
                        maxLength={15} value={gstNo}
                        label='VERIFY' disabled={disabled || gstDisable} uppercase
                        placeholder='GST Number' error={errors.gstNo}
                        onBlur={(value) => onBlur(value, 'gstNo')}
                        onChange={(value) => onChange(value, 'gstNo')}
                    />
                </div>
                <div className='input-container app-upload-file-container app-gst-upload-container'>
                    {
                        gstDisable ? null :
                            <DraggerInput onUpload={(file) => onUpload(file, 'gstProof')} disabled={disabled} />
                    }
                    <div className='upload-preview-container'>
                        <UploadPreviewer track value={gstProof} title='GST Proof' disabled={disabled || gstDisable} onUpload={(file) => onUpload(file, 'gstProof')} onRemove={() => onRemove('gstProof')} className='last' error={errors.gstProof} />
                    </div>
                </div>
            </div>
            <div className='row'>
                {
                    isCorporate ? <div className='input-container'>
                        <InputLabel name='Organization Name' error={errors.organizationName} mandatory />
                        <CustomInput
                            value={organizationName}
                            placeholder='Organization Name'
                            disabled={disabled}
                            error={errors.organizationName}
                            onChange={(value) => onChange(value, 'organizationName')}
                        />
                    </div>
                        : <div className='input-container'>
                            <InputLabel name='Name' error={errors.customerName} mandatory />
                            <CustomInput
                                value={customerName} disabled={disabled}
                                placeholder='Add Name' error={errors.customerName}
                                onChange={(value) => onChange(value, 'customerName')}
                            />
                        </div>
                }


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
                    <InputLabel name='Registered Date' error={errors.registeredDate} />
                    <CustomInput value={dayjs(registeredDate).format(DATEFORMAT)} placeholder='Registered Date' disabled />
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
                {
                    isCorporate ? <div className='input-container'>
                        <InputLabel name='Credit Period in Days' error={errors.creditPeriodInDays} mandatory />
                        <CustomInput
                            value={creditPeriodInDays}
                            disabled={disabled} placeholder='Credit Period'
                            error={errors.creditPeriodInDays}
                            onChange={(value) => onChange(value, 'creditPeriodInDays')}
                        />
                    </div> : null
                }

                <div className='input-container'>
                    <InputLabel name='Referred By' error={errors.referredBy} />
                    <CustomInput
                        placeholder='Referral Name'
                        value={referredBy} disabled
                        error={errors.referredBy}
                        onChange={(value) => onChange(value, 'referredBy')}
                    />
                </div>
            </div>
        </div>
    )
}

export default ApprovalForm