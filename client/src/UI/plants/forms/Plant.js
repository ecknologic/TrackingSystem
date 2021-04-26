import { Divider } from 'antd';
import React, { useEffect } from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import SelectInput from '../../../components/SelectInput';
import DraggerInput from '../../../components/DraggerInput';
import CustomTextArea from '../../../components/CustomTextArea';
import UploadPreviewer from '../../../components/UploadPreviewer';
import { getRoleLabel, resetTrackForm, trackAccountFormOnce } from '../../../utils/Functions';

const PlantForm = (props) => {

    const { data, admin, errors, onUpload, onChange, staffOptions, onRemove, onBlur } = props

    const { gstNo, gstProof, departmentName, address, phoneNumber, adminId, city, state, pinCode } = data
    const { roleId, emailid, mobileNumber } = admin

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    return (
        <div className='app-form-container plant-form-container'>
            <div className='row'>
                <div className='input-container stretch'>
                    <InputLabel name='Name' error={errors.departmentName} mandatory />
                    <CustomInput value={departmentName} placeholder='Add Name'
                        error={errors.departmentName}
                        onChange={(value) => onChange(value, 'departmentName')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container stretch'>
                    <InputLabel name='Address' error={errors.address} mandatory />
                    <CustomTextArea maxLength={256} error={errors.address} placeholder='Add Address'
                        value={address} minRows={1} maxRows={2} onChange={(value) => onChange(value, 'address')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='State' error={errors.state} mandatory />
                    <CustomInput value={state} placeholder='Add State'
                        error={errors.state}
                        onChange={(value) => onChange(value, 'state')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='City' error={errors.city} mandatory />
                    <CustomInput value={city} placeholder='Add City'
                        error={errors.city}
                        onChange={(value) => onChange(value, 'city')}
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
                    <InputLabel name='Phone Number' error={errors.phoneNumber} />
                    <CustomInput value={phoneNumber} placeholder='Add Phone Number'
                        error={errors.phoneNumber} onBlur={(value) => onBlur(value, 'phoneNumber')}
                        onChange={(value) => onChange(value, 'phoneNumber')} maxLength={10}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='GST Number' error={errors.gstNo} />
                    <CustomInput maxLength={15} uppercase
                        value={gstNo} placeholder='GST Number'
                        error={errors.gstNo} onChange={(value) => onChange(value, 'gstNo')}
                    />
                </div>
                <div className='input-container app-upload-file-container app-gst-upload-container'>
                    <DraggerInput onUpload={onUpload} />
                    <div className='upload-preview-container'>
                        <UploadPreviewer value={gstProof} track
                            title='GST Proof' error={errors.gstProof}
                            onUpload={onUpload}
                            onRemove={onRemove} className='last' />
                    </div>
                </div>
            </div>
            <Divider className='form-divider' />
            <div className='plant-title-container inner'>
                <span className='title'>Admin Details</span>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Name' error={errors.adminId} />
                    <SelectInput track
                        options={staffOptions} value={adminId}
                        error={errors.adminId} onSelect={(value) => onChange(value, 'adminId')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Administrator Type' error={errors.roleId} />
                    <CustomInput value={getRoleLabel(roleId)} placeholder='Administrator Type' disabled />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Phone Number' error={errors.mobileNumber} />
                    <CustomInput value={mobileNumber} placeholder='Phone Number' disabled />
                </div>
                <div className='input-container'>
                    <InputLabel name='Email' />
                    <CustomInput value={emailid} placeholder='Email' disabled />
                </div>
            </div>
        </div>
    )
}
export default PlantForm