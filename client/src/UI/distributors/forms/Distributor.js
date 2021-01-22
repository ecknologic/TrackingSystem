import React, { useEffect } from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import DraggerInput from '../../../components/DraggerInput';
import InputWithAddon from '../../../components/InputWithAddon';
import UploadPreviewer from '../../../components/UploadPreviewer';
import { resetTrackForm, trackAccountFormOnce } from '../../../utils/Functions';

const EmployeeForm = (props) => {

    const { data, errors, onChange, onUpload, onRemove, disabled, onBlur } = props
    const { agencyName, gstNo, gstProof, operationalArea, contactPerson, mobileNumber, address,
        alternateNumber, mailId, alternateMailId } = data


    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    const gstUploadDisable = gstProof

    return (
        <div className='app-form-container employee-form-container'>
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
                    <InputLabel name='Agency Name' error={errors.agencyName} mandatory />
                    <CustomInput value={agencyName}
                        error={errors.agencyName} placeholder='Agency Name'
                        onChange={(value) => onChange(value, 'agencyName')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name="Operational Area" error={errors.operationalArea} mandatory />
                    <CustomInput value={operationalArea}
                        error={errors.operationalArea} placeholder="Operational Area"
                        onChange={(value) => onChange(value, 'operationalArea')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container stretch'>
                    <InputLabel name='Address' error={errors.address} mandatory />
                    <CustomInput
                        error={errors.address}
                        value={address} placeholder='Add Address'
                        onChange={(value) => onChange(value, 'address')} />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name="Contact Person" error={errors.contactPerson} mandatory />
                    <CustomInput value={contactPerson}
                        error={errors.contactPerson} placeholder="Contact Person"
                        onChange={(value) => onChange(value, 'contactPerson')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Mobile Number' error={errors.mobileNumber} mandatory />
                    <CustomInput value={mobileNumber} placeholder='Phone Number'
                        error={errors.mobileNumber} onBlur={(value) => onBlur(value, 'mobileNumber')}
                        onChange={(value) => onChange(value, 'mobileNumber')} maxLength={10}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Alternate Mobile No' error={errors.alternateNumber} />
                    <CustomInput value={alternateNumber} placeholder='Alternate Mobile Number'
                        error={errors.alternateNumber} onBlur={(value) => onBlur(value, 'alternateNumber')}
                        onChange={(value) => onChange(value, 'alternateNumber')} maxLength={10}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Email' error={errors.mailId} mandatory />
                    <CustomInput
                        value={mailId} type='email' disabled={disabled}
                        placeholder='Email' error={errors.mailId}
                        onBlur={(value) => onBlur(value, 'mailId')}
                        onChange={(value) => onChange(value, 'mailId')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Alternate Email' error={errors.alternateMailId} />
                    <CustomInput
                        value={alternateMailId} type='email' disabled={disabled}
                        placeholder='Alternate Email' error={errors.alternateMailId}
                        onBlur={(value) => onBlur(value, 'alternateMailId')}
                        onChange={(value) => onChange(value, 'alternateMailId')}
                    />
                </div>
            </div>
        </div>
    )
}
export default EmployeeForm