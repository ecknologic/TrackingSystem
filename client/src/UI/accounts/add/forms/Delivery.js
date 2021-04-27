import React, { useEffect } from 'react';
import { dayOptions } from '../../../../assets/fixtures'
import InputLabel from '../../../../components/InputLabel';
import CustomInput from '../../../../components/CustomInput';
import SelectInput from '../../../../components/SelectInput';
import DraggerInput from '../../../../components/DraggerInput';
import UploadPreviewer from '../../../../components/UploadPreviewer';
import { resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';
import CustomTextArea from '../../../../components/CustomTextArea';

const DeliveryForm = (props) => {

    const { data, errors, devDays, onBlur, devDaysError = {}, disabled, onChange, onSelect, onDeselect,
        warehouseOptions, locationOptions, routeOptions, sameAddress, onUpload, onRemove, isAdmin } = props

    const {
        gstNo, gstProof, departmentId, routeId, phoneNumber, contactPerson, address, isApproved,
        deliveryLocation, product20L, price20L, product2L, product1L, price2L, price1L, product500ML,
        price500ML, product300ML, price300ML
    } = data

    const gstUploadDisable = gstProof
    const isDisabled = disabled || (isApproved && !isAdmin)

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    return (
        <>
            <div className='app-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='GST Number' error={errors.gstNo} />
                        <CustomInput maxLength={15} uppercase
                            value={gstNo} placeholder='GST Number' disabled={sameAddress || isDisabled}
                            error={errors.gstNo} onChange={(value) => onChange(value, 'gstNo')}
                        />
                    </div>
                    <div className='input-container app-upload-file-container app-gst-upload-container'>
                        <DraggerInput onUpload={(file) => onUpload(file, 'gstProof', 'delivery')} disabled={sameAddress || gstUploadDisable || isDisabled} />
                        <div className='upload-preview-container'>
                            <UploadPreviewer value={gstProof} track
                                title='GST Proof' disabled={sameAddress || isDisabled} error={errors.gstProof}
                                onUpload={(file) => onUpload(file, 'gstProof', 'delivery')}
                                onRemove={() => onRemove('gstProof', 'delivery')} className='last' />
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Contact Person' error={errors.contactPerson} mandatory />
                        <CustomInput value={contactPerson} placeholder='Add Name'
                            disabled={isDisabled} error={errors.contactPerson}
                            onChange={(value) => onChange(value, 'contactPerson')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Delivery Location' error={errors.deliveryLocation} mandatory />
                        <SelectInput options={locationOptions} showSearch
                            disabled={isDisabled} error={errors.deliveryLocation} value={deliveryLocation}
                            onSelect={(value) => onChange(value, 'deliveryLocation')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Address' error={errors.address} mandatory />
                        <CustomTextArea maxLength={256} disabled={sameAddress || isDisabled} error={errors.address} placeholder='Add Address'
                            value={address} minRows={1} maxRows={2} onChange={(value) => onChange(value, 'address')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Warehouse' error={errors.departmentId} mandatory />
                        <SelectInput track options={warehouseOptions} value={departmentId}
                            disabled={isDisabled} error={errors.departmentId}
                            onSelect={(value) => onChange(value, 'departmentId')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Route' error={errors.routeId} mandatory />
                        <SelectInput track options={routeOptions}
                            value={routeId} disabled={isDisabled}
                            error={errors.routeId} onSelect={(value) => onChange(value, 'routeId')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Phone Number' error={errors.phoneNumber} mandatory />
                        <CustomInput maxLength={10} value={phoneNumber} disabled={isDisabled}
                            placeholder='Phone Number' error={errors.phoneNumber}
                            onBlur={(value) => onBlur(value, 'phoneNumber')}
                            onChange={(value) => onChange(value, 'phoneNumber')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Delivery Days' error={devDaysError.devDays} mandatory />
                        <SelectInput
                            track
                            mode='multiple' disabled={isDisabled}
                            value={devDays} options={dayOptions}
                            error={devDaysError.devDays} onSelect={onSelect} onDeselect={onDeselect}
                        />
                    </div>
                </div>
                <div className='columns'>
                    <InputLabel name='Products and Price' error={errors.productNPrice} mandatory />
                    <div className='columns-container'>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='20 Ltrs' />
                                <CustomInput value={product20L} disabled={isDisabled}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'product20L')}
                                />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price20L} disabled={isDisabled}
                                    onBlur={(value) => onBlur(value, 'price20L')}
                                    placeholder='Rs' onChange={(value) => onChange(value, 'price20L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='2 Ltrs' />
                                <CustomInput value={product2L} disabled={isDisabled}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'product2L')}
                                />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price2L} disabled={isDisabled}
                                    onBlur={(value) => onBlur(value, 'price2L')}
                                    placeholder='Rs' onChange={(value) => onChange(value, 'price2L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='1 Ltrs' />
                                <CustomInput value={product1L} disabled={isDisabled}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'product1L')}
                                />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price1L} disabled={isDisabled}
                                    onBlur={(value) => onBlur(value, 'price1L')}
                                    placeholder='Rs' onChange={(value) => onChange(value, 'price1L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='500 Ml' />
                                <CustomInput value={product500ML} disabled={isDisabled}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'product500ML')}
                                />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price500ML} disabled={isDisabled}
                                    onBlur={(value) => onBlur(value, 'price500ML')}
                                    placeholder='Rs' onChange={(value) => onChange(value, 'price500ML')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='300 Ml' />
                                <CustomInput value={product300ML} disabled={isDisabled}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'product300ML')}
                                />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price300ML} disabled={isDisabled}
                                    onBlur={(value) => onBlur(value, 'price300ML')}
                                    placeholder='Rs' onChange={(value) => onChange(value, 'price300ML')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default DeliveryForm