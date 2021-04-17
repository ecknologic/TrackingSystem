import React, { useEffect } from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import DraggerInput from '../../../components/DraggerInput';
import UploadPreviewer from '../../../components/UploadPreviewer';
import { resetTrackForm, trackAccountFormOnce } from '../../../utils/Functions';

const EmployeeForm = (props) => {

    const { data, errors, onChange, onUpload, onRemove, disabled, onBlur } = props
    const { agencyName, gstNo, gstProof, operationalArea, contactPerson, mobileNumber, address,
        alternateNumber, mailId, alternateMailId, product20L, price20L, product2L, product1L, price2L, price1L, product500ML,
        price500ML, product300ML, price300ML, deliveryLocation } = data


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
                <div className='input-container'>
                    <InputLabel name='Delivery Location' error={errors.deliveryLocation} mandatory />
                    <CustomInput value={deliveryLocation} placeholder='Add Location'
                        disabled={disabled} error={errors.deliveryLocation}
                        onChange={(value) => onChange(value, 'deliveryLocation')}
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
            <div className='columns'>
                <InputLabel name='Products and Price' error={errors.productNPrice} mandatory />
                <div className='columns-container'>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='20 Ltrs' />
                            <CustomInput value={product20L}
                                placeholder='Qty' onChange={(value) => onChange(value, 'product20L')}
                            />
                        </div>
                        <div className='input-container'>
                            <InputLabel name='Price' />
                            <CustomInput value={price20L}
                                onBlur={(value) => onBlur(value, 'price20L')}
                                placeholder='Rs' onChange={(value) => onChange(value, 'price20L')} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='2 Ltrs' />
                            <CustomInput value={product2L}
                                placeholder='Qty' onChange={(value) => onChange(value, 'product2L')}
                            />
                        </div>
                        <div className='input-container'>
                            <InputLabel name='Price' />
                            <CustomInput value={price2L}
                                onBlur={(value) => onBlur(value, 'price2L')}
                                placeholder='Rs' onChange={(value) => onChange(value, 'price2L')} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='1 Ltrs' />
                            <CustomInput value={product1L}
                                placeholder='Qty' onChange={(value) => onChange(value, 'product1L')}
                            />
                        </div>
                        <div className='input-container'>
                            <InputLabel name='Price' />
                            <CustomInput value={price1L}
                                onBlur={(value) => onBlur(value, 'price1L')}
                                placeholder='Rs' onChange={(value) => onChange(value, 'price1L')} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='500 Ml' />
                            <CustomInput value={product500ML}
                                placeholder='Qty' onChange={(value) => onChange(value, 'product500ML')}
                            />
                        </div>
                        <div className='input-container'>
                            <InputLabel name='Price' />
                            <CustomInput value={price500ML}
                                onBlur={(value) => onBlur(value, 'price500ML')}
                                placeholder='Rs' onChange={(value) => onChange(value, 'price500ML')} />
                        </div>
                    </div>
                    <div className='column last'>
                        <div className='input-container'>
                            <InputLabel name='300 Ml' />
                            <CustomInput value={product300ML}
                                placeholder='Qty' onChange={(value) => onChange(value, 'product300ML')}
                            />
                        </div>
                        <div className='input-container'>
                            <InputLabel name='Price' />
                            <CustomInput value={price300ML}
                                onBlur={(value) => onBlur(value, 'price300ML')}
                                placeholder='Rs' onChange={(value) => onChange(value, 'price300ML')} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default EmployeeForm