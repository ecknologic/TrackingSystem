import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import InputLabel from '../../../components/InputLabel';
import { genderOptions } from '../../../assets/fixtures'
import CustomInput from '../../../components/CustomInput';
import SelectInput from '../../../components/SelectInput';
import DraggerInput from '../../../components/DraggerInput';
import InputWithAddon from '../../../components/InputWithAddon';
import UploadPreviewer from '../../../components/UploadPreviewer';
import CustomDateInput from '../../../components/CustomDateInput';
import { disableFutureDates, resetTrackForm, trackAccountFormOnce } from '../../../utils/Functions';

const EmployeeForm = (props) => {

    const { data, title, errors, roleOptions, onChange, onUpload, onRemove, disabled, onBlur,
        adharProof, adharProofErrors, licenseProof, licenseProofErrors } = props
    const { userName, adharNo, licenseNo, parentName, gender, dob, mobileNumber, address,
        joinedDate, permanentAddress, roleId, emailid } = data


    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    const adharProofDisabled = adharProof.Front && adharProof.Back
    const licenseProofDisabled = licenseProof.Front && licenseProof.Back

    return (
        <div className='app-form-container plant-form-container'>
            <div className='app-identity-proof-container identity-proof-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Aadhar Number' error={errors.adharNo} mandatory />
                        <InputWithAddon maxLength={12} label='VERIFY' uppercase
                            value={adharNo} placeholder='Aadhar Number'
                            error={errors.adharNo} onBlur={(value) => onBlur(value, 'adharNo')}
                            onChange={(value) => onChange(value, 'adharNo')}
                        />
                    </div>
                </div>
                <div className='upload-container'>
                    <DraggerInput onUpload={(file) => onUpload(file, 'any', 'adharProof')} disabled={adharProofDisabled} />
                    <div className='upload-preview-container'>
                        <UploadPreviewer track value={adharProof.Front} title='Front' disabled={disabled} onUpload={(file) => onUpload(file, 'Front', 'adharProof')} onRemove={() => onRemove('Front', 'adharProof')} error={adharProofErrors.Front} />
                        <UploadPreviewer track value={adharProof.Back} title='Back' disabled={disabled} onUpload={(file) => onUpload(file, 'Back', 'adharProof')} onRemove={() => onRemove('Back', 'adharProof')} className='last' error={adharProofErrors.Back} />
                    </div>
                </div>
            </div>
            {
                title === 'Driver'
                    ? <div className='app-identity-proof-container identity-proof-container'>
                        <div className='row'>
                            <div className='input-container'>
                                <InputLabel name='Driving License Number' error={errors.licenseNo} mandatory />
                                <InputWithAddon maxLength={16} label='VERIFY' uppercase
                                    value={licenseNo} placeholder='Driving License Number'
                                    error={errors.licenseNo} onBlur={(value) => onBlur(value, 'licenseNo')}
                                    onChange={(value) => onChange(value, 'licenseNo')}
                                />
                            </div>

                        </div>
                        <div className='upload-container'>
                            <DraggerInput onUpload={(file) => onUpload(file, 'any', 'licenseProof')} disabled={licenseProofDisabled} />
                            <div className='upload-preview-container'>
                                <UploadPreviewer track value={licenseProof.Front} title='Front' disabled={disabled} onUpload={(file) => onUpload(file, 'Front', 'licenseProof')} onRemove={() => onRemove('Front', 'licenseProof')} error={licenseProofErrors.Front} />
                                <UploadPreviewer track value={licenseProof.Back} title='Back' disabled={disabled} onUpload={(file) => onUpload(file, 'Back', 'licenseProof')} onRemove={() => onRemove('Back', 'licenseProof')} className='last' error={licenseProofErrors.Back} />
                            </div>
                        </div>
                    </div>
                    : null
            }
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Name as per Aadhar' error={errors.userName} mandatory />
                    <CustomInput value={userName}
                        error={errors.userName} placeholder='Name'
                        onChange={(value) => onChange(value, 'userName')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name="Parent's Name" error={errors.parentName} mandatory />
                    <CustomInput value={parentName}
                        error={errors.parentName} placeholder="Parent's Name"
                        onChange={(value) => onChange(value, 'parentName')}
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
                    <InputLabel name='Date of Birth as per Aadhar' error={errors.dob} mandatory />
                    <CustomDateInput
                        track value={dob} disabledDate={disableFutureDates} error={errors.dob}
                        onChange={(value) => onChange(dayjs(value).format('YYYY-MM-DD'), 'dob')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Mobile No Linked to Aadhar' error={errors.mobileNumber} mandatory />
                    <CustomInput value={mobileNumber} placeholder='Phone Number'
                        error={errors.mobileNumber} onBlur={(value) => onBlur(value, 'mobileNumber')}
                        onChange={(value) => onChange(value, 'mobileNumber')} maxLength={10}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Email' error={errors.emailid} mandatory />
                    <CustomInput value={emailid} placeholder='Email'
                        error={errors.emailid} onBlur={(value) => onBlur(value, 'emailid')}
                        onChange={(value) => onChange(value, 'emailid')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Date of Joining' error={errors.joinedDate} mandatory />
                    <CustomDateInput
                        track value={joinedDate} disabledDate={disableFutureDates} error={errors.joinedDate}
                        onChange={(value) => onChange(dayjs(value).format('YYYY-MM-DD'), 'joinedDate')}
                    />
                </div>
                {
                    title === 'Driver'
                        ? null
                        :
                        <div className='input-container'>
                            <InputLabel name='Role' error={errors.roleId} mandatory />
                            <SelectInput track
                                options={roleOptions} value={roleId}
                                error={errors.roleId} onSelect={(value) => onChange(value, 'roleId')}
                            />
                        </div>
                }
            </div>
            <div className='row'>
                <div className='input-container stretch'>
                    <InputLabel name='Address of Communication' error={errors.address} mandatory />
                    <CustomInput value={address} placeholder='Add Current Address'
                        error={errors.address} onBlur={(value) => onBlur(value, 'address')}
                        onChange={(value) => onChange(value, 'address')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container stretch'>
                    <InputLabel name='Permanent Address' error={errors.permanentAddress} mandatory />
                    <CustomInput value={permanentAddress} placeholder='Add Permanent Address'
                        error={errors.permanentAddress} onBlur={(value) => onBlur(value, 'permanentAddress')}
                        onChange={(value) => onChange(value, 'permanentAddress')}
                    />
                </div>
            </div>
        </div>
    )
}
export default EmployeeForm