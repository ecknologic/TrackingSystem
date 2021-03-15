import dayjs from 'dayjs';
import { Divider } from 'antd';
import React, { useEffect } from 'react';
import InputLabel from '../../../components/InputLabel';
import { genderOptions } from '../../../assets/fixtures'
import CustomInput from '../../../components/CustomInput';
import SelectInput from '../../../components/SelectInput';
import DraggerInput from '../../../components/DraggerInput';
import UploadPreviewer from '../../../components/UploadPreviewer';
import CustomDateInput from '../../../components/CustomDateInput';
import { disableFutureDates, resetTrackForm, trackAccountFormOnce } from '../../../utils/Functions';

const DependentForm = (props) => {

    const { data, errors, onChange, onUpload, onRemove, disabled, onBlur, adharProof, adharProofErrors } = props
    const { adharNo, gender, dob, mobileNumber, name, relation } = data


    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    const adharProofDisabled = adharProof.Front && adharProof.Back

    return (
        <div className='app-form-container employee-form-container'>
            <Divider className='form-divider' />
            <div className='employee-title-container inner'>
                <span className='title'>Dependent Details</span>
            </div>
            <div className='app-identity-proof-container identity-proof-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Aadhar Number' error={errors.adharNo} mandatory />
                        <CustomInput maxLength={12} uppercase
                            value={adharNo} placeholder='Aadhar Number'
                            error={errors.adharNo} onBlur={(value) => onBlur(value, 'adharNo')}
                            onChange={(value) => onChange(value, 'adharNo')}
                        />
                    </div>
                </div>
                <div className='upload-container'>
                    <DraggerInput onUpload={(file) => onUpload(file, 'any')} disabled={adharProofDisabled} />
                    <div className='upload-preview-container'>
                        <UploadPreviewer track value={adharProof.Front} title='Front' disabled={disabled} onUpload={(file) => onUpload(file, 'Front')} onRemove={() => onRemove('Front')} error={adharProofErrors.Front} />
                        <UploadPreviewer track value={adharProof.Back} title='Back' disabled={disabled} onUpload={(file) => onUpload(file, 'Back')} onRemove={() => onRemove('Back')} className='last' error={adharProofErrors.Back} />
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Name as per Aadhar' error={errors.name} mandatory />
                    <CustomInput value={name}
                        error={errors.name} placeholder='Name'
                        onChange={(value) => onChange(value, 'name')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Date of Birth' error={errors.dob} mandatory />
                    <CustomDateInput
                        track value={dob} disabledDate={disableFutureDates} error={errors.dob}
                        onChange={(value) => onChange(dayjs(value).format('YYYY-MM-DD'), 'dob')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Gender' error={errors.gender} mandatory />
                    <SelectInput track
                        options={genderOptions} value={gender}
                        error={errors.gender} onSelect={(value) => onChange(value, 'gender')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Mobile Number' error={errors.mobileNumber} mandatory />
                    <CustomInput value={mobileNumber} placeholder='Mobile Number'
                        error={errors.mobileNumber} onBlur={(value) => onBlur(value, 'mobileNumber')}
                        onChange={(value) => onChange(value, 'mobileNumber')} maxLength={10}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Relation' error={errors.relation} mandatory />
                    <CustomInput value={relation}
                        error={errors.relation} placeholder='Relation'
                        onChange={(value) => onChange(value, 'relation')}
                    />
                </div>
            </div>
        </div>
    )
}
export default DependentForm