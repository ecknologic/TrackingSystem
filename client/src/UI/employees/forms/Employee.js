import dayjs from 'dayjs';
import { Divider } from 'antd';
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

    const { data, errors, roleOptions, departmentOptions, onChange, onUpload, onRemove, disabled, onBlur,
        adharProof, adharProofErrors, licenseProof, licenseProofErrors, isDriver, editMode } = props
    const { userName, adharNo, licenseNo, parentName, gender, dob, mobileNumber, address,
        joinedDate, permanentAddress, roleId, emailid, departmentId, accountNo, branchName, bankName,
        ifscCode, recruitedBy, recommendedBy } = data


    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    const adharProofDisabled = adharProof.Front && adharProof.Back
    const licenseProofDisabled = licenseProof.Front && licenseProof.Back
    const eligibleRole = roleId === 2 || roleId === 3 || roleId === 6 // department can't be assigned/modified for these roles

    return (
        <div className='app-form-container employee-form-container'>
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
                    <InputLabel name='Date of Birth' error={errors.dob} mandatory />
                    <CustomDateInput
                        track value={dob} disabledDate={disableFutureDates} error={errors.dob}
                        onChange={(value) => onChange(dayjs(value).format('YYYY-MM-DD'), 'dob')}
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
                        track value={joinedDate} error={errors.joinedDate}
                        onChange={(value) => onChange(dayjs(value).format('YYYY-MM-DD'), 'joinedDate')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Role' error={errors.roleId} mandatory />
                    <SelectInput track
                        options={roleOptions} value={roleId} disabled={isDriver}
                        error={errors.roleId} onSelect={(value) => onChange(value, 'roleId')}
                    />
                </div>
            </div>
            {
                (editMode && eligibleRole) || roleId === 6 ? (
                    <div className='row'>
                        <div className='input-container'>
                            <InputLabel name='Department' error={errors.departmentId} />
                            <SelectInput track
                                options={departmentOptions} value={departmentId}
                                error={errors.departmentId} onSelect={(value) => onChange(value, 'departmentId')}
                            />
                        </div>
                    </div>
                ) : null
            }
            {
                roleId === 6
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
                    <InputLabel name='Recruited by' error={errors.recruitedBy} mandatory />
                    <CustomInput value={recruitedBy} placeholder='Recruited By'
                        error={errors.recruitedBy} onBlur={(value) => onBlur(value, 'recruitedBy')}
                        onChange={(value) => onChange(value, 'recruitedBy')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Recommended By' error={errors.recommendedBy} />
                    <CustomInput value={recommendedBy} placeholder='Recommended By'
                        error={errors.recommendedBy} onBlur={(value) => onBlur(value, 'recommendedBy')}
                        onChange={(value) => onChange(value, 'recommendedBy')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container stretch'>
                    <InputLabel name='Present Address' error={errors.address} mandatory />
                    <CustomInput value={address} placeholder='Add Present Address'
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
            <Divider className='form-divider' />
            <div className='employee-title-container inner'>
                <span className='title'>Bank Account Details</span>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Account Number' error={errors.accountNo} mandatory />
                    <CustomInput value={accountNo} placeholder='Account Number' maxLength={18}
                        error={errors.accountNo} onBlur={(value) => onBlur(value, 'accountNo')}
                        onChange={(value) => onChange(value, 'accountNo')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Bank Name' error={errors.bankName} mandatory />
                    <CustomInput value={bankName}
                        error={errors.bankName} placeholder='Bank Name'
                        onChange={(value) => onChange(value, 'bankName')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Branch Name' error={errors.branchName} mandatory />
                    <CustomInput value={branchName}
                        error={errors.branchName} placeholder='Branch Name'
                        onChange={(value) => onChange(value, 'branchName')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='IFSC Code' error={errors.ifscCode} mandatory />
                    <CustomInput value={ifscCode} placeholder='IFSC Code' maxLength={11} uppercase
                        error={errors.ifscCode} onBlur={(value) => onBlur(value, 'ifscCode')}
                        onChange={(value) => onChange(value, 'ifscCode')}
                    />
                </div>
            </div>
        </div>
    )
}
export default EmployeeForm