import { Input, InputNumber } from 'antd';
import React, { useEffect, useState } from 'react';
import SelectInput from '../../../../components/SelectInput';
import InputWithAddon from '../../../../components/InputWithAddon';
import { dayOptions, WEEKDAYS } from '../../../../assets/fixtures'
import { getBase64, isEmpty } from '../../../../utils/Functions';
import UploadPreviewer from '../../../../components/UploadPreviewer';
import DraggerInput from '../../../../components/DraggerInput';
import InputLabel from '../../../../components/InputLabel';
import { validateIDNumbers, validateMobileNumber, validateNames } from '../../../../utils/validations';

const CollapseForm = ({ data, routeOptions, uniqueId, addressesErrors }) => {

    const [deliveryValues, setDeliveryValues] = useState({})
    const [errors, setErrors] = useState({})

    useEffect(() => { // To pre-fill the form
        setDeliveryValues(data)
    }, [])

    useEffect(() => { // To pre-fill errors
        const error = addressesErrors[`address${uniqueId}`]
        if (error) {
            setErrors(error)
        }
    }, [addressesErrors])

    useEffect(() => {
        if (!isEmpty(errors)) {
            setSession({ ...deliveryValues, errors })
        }
    }, [errors])

    const setSession = (data) => {
        sessionStorage.setItem(`address${uniqueId}`, JSON.stringify(data))
    }

    const onChange = (value, key) => {
        setSession({ ...deliveryValues, [key]: value })
        setDeliveryValues(data => ({ ...data, [key]: value }))
        setErrors(errors => ({ ...errors, [key]: '' }))

        if (key.includes('price') || key.includes('product')) {
            setErrors(errors => ({ ...errors, productNPrice: '' }))
        }

        // Validations
        if (key === 'gstNo') {
            const error = validateIDNumbers(key, value)
            setErrors(errors => ({ ...errors, [key]: error }))
        }
        if (key === 'deliveryLocation') {
            const error = validateNames(value)
            setErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'phoneNumber') {
            const error = validateMobileNumber(value)
            setErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'contactPerson') {
            const error = validateNames(value)
            setErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const onBlur = (value, key) => {

        // Validations
        if (key === 'gstNo') {
            const error = validateIDNumbers(key, value, true)
            setErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'phoneNumber') {
            const error = validateMobileNumber(value, true)
            setErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleSelect = (value) => {
        setErrors(errors => ({ ...errors, devDays: '' }))
        if (value == 'ALL') setDeliveryValues(data => ({ ...data, devDays: WEEKDAYS }))
        else {
            const clone = [...devDays]
            clone.push(value)
            setDeliveryValues(data => ({ ...data, devDays: clone }))
        }
    }

    const handleDeselect = (value) => {
        if (value == 'ALL') setDeliveryValues(data => ({ ...data, devDays: [] }))
        else {
            const filtered = devDays.filter(day => day !== value && day !== "ALL")
            setDeliveryValues(data => ({ ...data, devDays: filtered }))
        }
    }

    const handleUpload = (file) => getBase64(file, async (buffer) => {
        setDeliveryValues(data => ({ ...data, gstProof: buffer }))
    })

    const onRemove = () => {
        setDeliveryValues(data => ({ ...data, gstProof: '' }))
    }

    const {
        gstNo, gstProof, depositAmount, routingId, devDays, phoneNumber, contactPerson, address,
        deliveryLocation, product20L, price20L, product1L, price1L, product500ML, price500ML
    } = deliveryValues

    const gstUploadDisable = gstProof

    return (
        <>
            <div className='title-container'>
                <span className='title'>Delivery Details</span>
            </div>
            <div className='form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='GST Number' error={errors.gstNo} />
                        <InputWithAddon maxLength={15} label='VERIFY' value={gstNo} placeholder='GST Number' error={errors.gstNo} onBlur={({ target: { value } }) => onBlur(value, 'gstNo')} onChange={({ target: { value } }) => onChange(value, 'gstNo')} />
                    </div>
                    <div className='input-container app-upload-file-container app-gst-upload-container'>
                        <DraggerInput onUpload={handleUpload} disabled={gstUploadDisable} />
                        <div className='upload-preview-container'>
                            <UploadPreviewer value={gstProof} title='GST Proof' onRemove={onRemove} className='last' />
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Delivery Location' error={errors.deliveryLocation} mandatory />
                        <Input size='large' value={deliveryLocation} placeholder='Add Location' className={`${errors.deliveryLocation && 'app-input-error'}`} onChange={({ target: { value } }) => onChange(value, 'deliveryLocation')} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Route' error={errors.routingId} mandatory />
                        <SelectInput options={routeOptions} value={routingId} onSelect={(value) => onChange(value, 'routingId')} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Address' error={errors.address} mandatory />
                        <Input size='large' autoComplete='none' value={address} placeholder='Add Address' className={`${errors.address && 'app-input-error'}`} onChange={({ target: { value } }) => onChange(value, 'address')} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Phone Number' error={errors.phoneNumber} mandatory />
                        <InputNumber size="large" value={phoneNumber} placeholder='Phone Number' className={`${errors.phoneNumber && 'app-input-error'}`} onBlur={({ target: { value } }) => onBlur(value, 'phoneNumber')} onChange={(value) => onChange(value, 'phoneNumber')} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Contact Person' error={errors.contactPerson} mandatory />
                        <Input size='large' value={contactPerson} placeholder='Add Name' className={`${errors.contactPerson && 'app-input-error'}`} onChange={({ target: { value } }) => onChange(value, 'contactPerson')} />
                    </div>
                </div>
                <div className='columns'>
                    <InputLabel name='Products and Price' error={errors.productNPrice} mandatory />
                    <div className='columns-container'>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='20 Ltrs' error={errors.product20L} />
                                <InputNumber size="large" value={product20L || 0} placeholder='Add' onChange={(value) => onChange(value, 'product20L')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' error={errors.price20L} />
                                <InputNumber size="large" value={price20L || 0} placeholder='Rs' onChange={(value) => onChange(value, 'price20L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='1 Ltrs' error={errors.product1L} />
                                <InputNumber size="large" value={product1L || 0} placeholder='Add' onChange={(value) => onChange(value, 'product1L')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' error={errors.price1L} />
                                <InputNumber size="large" value={price1L || 0} placeholder='Rs' onChange={(value) => onChange(value, 'price1L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='500 Ml' error={errors.product500ML} />
                                <InputNumber size="large" value={product500ML || 0} placeholder='Add' onChange={(value) => onChange(value, 'product500ML')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' error={errors.price500ML} />
                                <InputNumber size="large" value={price500ML || 0} placeholder='Rs' onChange={(value) => onChange(value, 'price500ML')} />
                            </div>
                        </div>
                        {/* <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='250 Ml' />
                                <InputNumber size="large" value={product250ML || 0} placeholder='Add' onChange={setProduct250ML} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <InputNumber size="large" value={price250ML || 0} placeholder='Rs' onChange={setPrice250ML} />
                            </div>
                        </div> */}
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Delivery Days' error={errors.devDays} mandatory />
                        <SelectInput value={devDays} options={dayOptions} mode='multiple' onSelect={handleSelect} onDeselect={handleDeselect} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Deposit Amount' error={errors.depositAmount} mandatory />
                        <InputNumber size='large' value={depositAmount} placeholder='Deposit Amount' onChange={(value) => onChange(value, 'depositAmount')} />
                    </div>
                </div>
            </div>
        </>
    )
}
export default CollapseForm