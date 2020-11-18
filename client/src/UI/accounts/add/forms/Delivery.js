import React from 'react';
import { Input, InputNumber } from 'antd';
import { PlusIcon } from '../../../../components/SVG_Icons'
import InputWithAddon from '../../../../components/InputWithAddon';
import SelectInput from '../../../../components/SelectInput';
import CustomButton from '../../../../components/CustomButton';
import { dayOptions } from '../../../../assets/fixtures'
import UploadPreviewer from '../../../../components/UploadPreviewer';
import DraggerInput from '../../../../components/DraggerInput';
import InputLabel from '../../../../components/InputLabel';

const DeliveryForm = (props) => {

    const { data, devDays, onChange, hasExtraAddress, onSelect, onDeselect,
        onAdd, routeOptions, track, sameAddress, onUpload, onRemove } = props

    const {
        gstNo, gstProof, depositAmount, routingId, phoneNumber, contactPerson, address, isActive,
        deliveryLocation, product20L, price20L, product1L, price1L, product500ML, price500ML,
        // product250ML, price250ML
    } = data

    const gstUploadDisable = gstProof

    return (
        <>
            <div className='form-container delivery-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='GST Number' />
                        <InputWithAddon label='VERIFY' value={gstNo} placeholder='GST Number' disabled={sameAddress || isActive} onChange={({ target: { value } }) => onChange(value, 'gstNo')} />
                    </div>
                    <div className='input-container app-upload-file-container app-gst-upload-container'>
                        <DraggerInput onUpload={(file) => onUpload(file, 'gstProof', 'delivery')} disabled={sameAddress || gstUploadDisable || isActive} />
                        <div className='upload-preview-container'>
                            <UploadPreviewer value={gstProof} title='GST Proof' disabled={sameAddress || isActive} onRemove={() => onRemove('gstProof', 'delivery')} className='last' />
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Delivery Location' />
                        <Input size='large' value={deliveryLocation} placeholder='Add Location' disabled={isActive} onChange={({ target: { value } }) => onChange(value, 'deliveryLocation')} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Route' />
                        <SelectInput track={track} options={routeOptions} value={routingId} disabled={isActive} onSelect={(value) => onChange(value, 'routingId')} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Address' />
                        <Input size='large' value={address} placeholder='Add Address' disabled={sameAddress || isActive} onChange={({ target: { value } }) => onChange(value, 'address')} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Phone Number' />
                        <InputNumber size="large" value={phoneNumber} disabled={isActive} placeholder='Phone Number' onChange={(value) => onChange(value, 'phoneNumber')} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Contact Person' />
                        <Input size='large' value={contactPerson} placeholder='Add Name' disabled={isActive} onChange={({ target: { value } }) => onChange(value, 'contactPerson')} />
                    </div>
                </div>
                <div className='columns'>
                    <InputLabel name='Products and Price' />
                    <div className='columns-container'>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='20 Ltrs' />
                                <InputNumber size="large" value={product20L || 0} disabled={isActive} placeholder='Add' onChange={(value) => onChange(value, 'product20L')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <InputNumber size="large" value={price20L || 0} disabled={isActive} placeholder='Rs' onChange={(value) => onChange(value, 'price20L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='1 Ltrs' />
                                <InputNumber size="large" value={product1L || 0} disabled={isActive} placeholder='Add' onChange={(value) => onChange(value, 'product1L')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <InputNumber size="large" value={price1L || 0} disabled={isActive} placeholder='Rs' onChange={(value) => onChange(value, 'price1L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='500 Ml' />
                                <InputNumber size="large" value={product500ML || 0} disabled={isActive} placeholder='Add' onChange={(value) => onChange(value, 'product500ML')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <InputNumber size="large" value={price500ML || 0} disabled={isActive} placeholder='Rs' onChange={(value) => onChange(value, 'price500ML')} />
                            </div>
                        </div>
                        {/* <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='250 Ml' />
                                <InputNumber size="large" value={product250ML || 0} disabled={isActive} placeholder='Add' onChange={(value) => onChange(value, 'product250ML')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <InputNumber size="large" value={price250ML || 0} disabled={isActive} placeholder='Rs' onChange={(value) => onChange(value, 'price250ML')} />
                            </div>
                        </div> */}
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Delivery Days' />
                        <SelectInput track={track} value={devDays} options={dayOptions} disabled={isActive} mode='multiple' onSelect={onSelect} onDeselect={onDeselect} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Deposit Amount' />
                        <InputNumber size="large" value={depositAmount} disabled={isActive} placeholder='Deposit Amount' onChange={(value) => onChange(value, 'depositAmount')} />
                    </div>
                </div>
                {
                    !hasExtraAddress && (
                        <div className='row add-new-btn-container'>
                            <CustomButton text='Add New' onClick={onAdd} className='app-add-new-btn' icon={<PlusIcon />} />
                        </div>
                    )
                }
            </div>
        </>
    )
}
export default DeliveryForm