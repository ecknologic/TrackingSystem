import React, { useEffect, useState } from 'react';
import SelectInput from '../../../../components/SelectInput';
import InputWithAddon from '../../../../components/InputWithAddon';
import { dayOptions, WEEKDAYS } from '../../../../assets/fixtures'
import { getBase64 } from '../../../../utils/Functions';
import UploadPreviewer from '../../../../components/UploadPreviewer';
import DraggerInput from '../../../../components/DraggerInput';
import InputLabel from '../../../../components/InputLabel';
import { validateIDNumbers, validateMobileNumber, validateNames, validateNumber } from '../../../../utils/validations';
import CustomInput from '../../../../components/CustomInput';

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
        setSession(deliveryValues)
    }, [deliveryValues])

    const setSession = (data) => {
        sessionStorage.setItem(`address${uniqueId}`, JSON.stringify(data))
    }

    const onChange = (value, key) => {
        setDeliveryValues(data => ({ ...data, [key]: value }))
        setErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
        if (key === 'gstNo') {
            const error = validateIDNumbers(key, value)
            setErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'deliveryLocation') {
            const error = validateNames(value)
            setErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'depositAmount') {
            const error = validateNumber(value)
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
        else if (key.includes('price') || key.includes('product')) {
            const error = validateNumber(value)
            setErrors(errors => ({ ...errors, productNPrice: error }))
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
        deliveryLocation, product20L, price20L, product1L, price1L, product500ML, price500ML,
        product250ML, price250ML
    } = deliveryValues

    const gstUploadDisable = gstProof

    return (
        <>
            <div className='title-container'>
                <span className='title'>Delivery Details</span>
            </div>
            <div className='app-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='GST Number' error={errors.gstNo} />
                        <InputWithAddon maxLength={15} uppercase
                            label='VERIFY' value={gstNo} placeholder='GST Number'
                            error={errors.gstNo} onBlur={(value) => onBlur(value, 'gstNo')}
                            onChange={(value) => onChange(value, 'gstNo')}
                        />
                    </div>
                    <div className='input-container app-upload-file-container app-gst-upload-container'>
                        <DraggerInput onUpload={handleUpload} disabled={gstUploadDisable} />
                        <div className='upload-preview-container'>
                            <UploadPreviewer value={gstProof} title='GST Proof' onRemove={onRemove} className='last' error={errors.gstProof} />
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Delivery Location' error={errors.deliveryLocation} mandatory />
                        <CustomInput
                            value={deliveryLocation} placeholder='Add Location'
                            error={errors.deliveryLocation}
                            onChange={(value) => onChange(value, 'deliveryLocation')} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Route' error={errors.routingId} mandatory />
                        <SelectInput options={routeOptions} value={routingId}
                            error={errors.routingId}
                            onSelect={(value) => onChange(value, 'routingId')} />
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
                        <InputLabel name='Phone Number' error={errors.phoneNumber} mandatory />
                        <CustomInput value={phoneNumber} placeholder='Phone Number'
                            className={`${errors.phoneNumber && 'app-input-error'}`} maxLength={10}
                            onBlur={({ target: { value } }) => onBlur(value, 'phoneNumber')}
                            onChange={(value) => onChange(value, 'phoneNumber')} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Contact Person' error={errors.contactPerson} mandatory />
                        <CustomInput value={contactPerson}
                            placeholder='Add Name' error={errors.contactPerson}
                            onChange={(value) => onChange(value, 'contactPerson')} />
                    </div>
                </div>
                <div className='columns'>
                    <InputLabel name='Products and Price' error={errors.productNPrice} mandatory />
                    <div className='columns-container'>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='20 Ltrs' />
                                <CustomInput value={product20L} placeholder='Add'
                                    onChange={(value) => onChange(value, 'product20L')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price20L} placeholder='Rs'
                                    onChange={(value) => onChange(value, 'price20L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='1 Ltrs' />
                                <CustomInput value={product1L} placeholder='Add'
                                    onChange={(value) => onChange(value, 'product1L')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price1L} placeholder='Rs'
                                    onChange={(value) => onChange(value, 'price1L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='500 Ml' />
                                <CustomInput value={product500ML} placeholder='Add'
                                    onChange={(value) => onChange(value, 'product500ML')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price500ML} placeholder='Rs'
                                    onChange={(value) => onChange(value, 'price500ML')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='250 Ml' />
                                <CustomInput value={product250ML} placeholder='Add'
                                    onChange={(value) => onChange(value, 'product250ML')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price250ML} placeholder='Rs'
                                    onChange={(value) => onChange(value, 'price250ML')} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Delivery Days' error={errors.devDays} mandatory />
                        <SelectInput value={devDays}
                            options={dayOptions} mode='multiple'
                            error={errors.devDays}
                            onSelect={handleSelect} onDeselect={handleDeselect}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Deposit Amount' error={errors.depositAmount} mandatory />
                        <CustomInput value={depositAmount} placeholder='Deposit Amount'
                            error={errors.depositAmount}
                            onChange={(value) => onChange(value, 'depositAmount')} />
                    </div>
                </div>
            </div>
        </>
    )
}
export default CollapseForm