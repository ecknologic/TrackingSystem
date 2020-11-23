import React from 'react';
import InputWithAddon from '../../../../components/InputWithAddon';
import SelectInput from '../../../../components/SelectInput';
import { dayOptions } from '../../../../assets/fixtures'
import UploadPreviewer from '../../../../components/UploadPreviewer';
import DraggerInput from '../../../../components/DraggerInput';
import InputLabel from '../../../../components/InputLabel';
import CustomInput from '../../../../components/CustomInput';

const DeliveryForm = (props) => {

    const { data, errors, devDays, onBlur, devDaysError, onChange, onSelect, onDeselect,
        routeOptions, track, sameAddress, onUpload, onRemove } = props

    const {
        gstNo, gstProof, depositAmount, routingId, phoneNumber, contactPerson, address, isActive,
        deliveryLocation, product20L, price20L, product1L, price1L, product500ML, price500ML,
        product250ML, price250ML
    } = data

    const gstUploadDisable = gstProof

    return (
        <>
            <div className='app-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='GST Number' error={errors.gstNo} />
                        <InputWithAddon maxLength={15} label='VERIFY' uppercase
                            value={gstNo} placeholder='GST Number' disabled={sameAddress || isActive}
                            error={errors.gstNo} onBlur={(value) => onBlur(value, 'gstNo')}
                            onChange={(value) => onChange(value, 'gstNo')}
                        />
                    </div>
                    <div className='input-container app-upload-file-container app-gst-upload-container'>
                        <DraggerInput onUpload={(file) => onUpload(file, 'gstProof', 'delivery')} disabled={sameAddress || gstUploadDisable || isActive} />
                        <div className='upload-preview-container'>
                            <UploadPreviewer value={gstProof} track={track}
                                title='GST Proof' disabled={sameAddress || isActive} error={errors.gstProof}
                                onRemove={() => onRemove('gstProof', 'delivery')} className='last' />
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Delivery Location' error={errors.deliveryLocation} mandatory />
                        <CustomInput value={deliveryLocation} placeholder='Add Location'
                            disabled={isActive} error={errors.deliveryLocation}
                            onChange={(value) => onChange(value, 'deliveryLocation')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Route' error={errors.routingId} mandatory />
                        <SelectInput track={track} options={routeOptions} value={routingId}
                            disabled={isActive} error={errors.routingId}
                            onSelect={(value) => onChange(value, 'routingId')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Address' error={errors.address} mandatory />
                        <CustomInput value={address} placeholder='Add Address'
                            disabled={sameAddress || isActive} error={errors.address}
                            onChange={(value) => onChange(value, 'address')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Phone Number' error={errors.phoneNumber} mandatory />
                        <CustomInput maxLength={10} value={phoneNumber} disabled={isActive}
                            placeholder='Phone Number' error={errors.phoneNumber}
                            onBlur={(value) => onBlur(value, 'phoneNumber')}
                            onChange={(value) => onChange(value, 'phoneNumber')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Contact Person' error={errors.contactPerson} mandatory />
                        <CustomInput value={contactPerson} placeholder='Add Name'
                            disabled={isActive} error={errors.contactPerson}
                            onChange={(value) => onChange(value, 'contactPerson')}
                        />
                    </div>
                </div>
                <div className='columns'>
                    <InputLabel name='Products and Price' error={errors.productNPrice} mandatory />
                    <div className='columns-container'>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='20 Ltrs' />
                                <CustomInput value={product20L} disabled={isActive}
                                    placeholder='Add' onChange={(value) => onChange(value, 'product20L')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price20L} disabled={isActive}
                                    placeholder='Rs' onChange={(value) => onChange(value, 'price20L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='1 Ltrs' />
                                <CustomInput value={product1L} disabled={isActive}
                                    placeholder='Add' onChange={(value) => onChange(value, 'product1L')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price1L} disabled={isActive}
                                    placeholder='Rs' onChange={(value) => onChange(value, 'price1L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='500 Ml' />
                                <CustomInput value={product500ML} disabled={isActive}
                                    placeholder='Add' onChange={(value) => onChange(value, 'product500ML')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price500ML} disabled={isActive}
                                    placeholder='Rs' onChange={(value) => onChange(value, 'price500ML')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='250 Ml' />
                                <CustomInput value={product250ML} disabled={isActive}
                                    placeholder='Add' onChange={(value) => onChange(value, 'product250ML')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price250ML} disabled={isActive}
                                    placeholder='Rs' onChange={(value) => onChange(value, 'price250ML')} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Delivery Days' error={devDaysError.devDays} mandatory />
                        <SelectInput
                            track={track}
                            mode='multiple' disabled={isActive}
                            value={devDays} options={dayOptions}
                            error={devDaysError.devDays} onSelect={onSelect} onDeselect={onDeselect}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Deposit Amount' error={errors.depositAmount} mandatory />
                        <CustomInput value={depositAmount}
                            disabled={isActive} placeholder='Deposit Amount'
                            error={errors.depositAmount}
                            onChange={(value) => onChange(value, 'depositAmount')}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export default DeliveryForm