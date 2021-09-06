import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import InputLabel from '../../../../components/InputLabel';
import SelectInput from '../../../../components/SelectInput';
import CustomInput from '../../../../components/CustomInput';
import DraggerInput from '../../../../components/DraggerInput';
import { getBase64, getLabel } from '../../../../utils/Functions';
import CustomTextArea from '../../../../components/CustomTextArea';
import UploadPreviewer from '../../../../components/UploadPreviewer';
import { dayOptions, getRouteOptions, WEEKDAYS } from '../../../../assets/fixtures'
import { validateIntFloat, validateMobileNumber, validateNumber } from '../../../../utils/validations';

const CollapseForm = ({ data, warehouseOptions, locationOptions, uniqueId, addressesErrors }) => {

    const [deliveryValues, setDeliveryValues] = useState({})
    const [errors, setErrors] = useState({})
    const [routeList, setRouteList] = useState([])

    const routeOptions = useMemo(() => getRouteOptions(routeList), [routeList])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => { // To pre-fill the form
        setDeliveryValues(data)

        const { departmentId } = data
        getRouteList(departmentId)

        return () => {
            http.ABORT(source)
        }
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

    const getRouteList = async (departmentId) => {
        const url = `customer/getRoutes/${departmentId}`

        try {
            const data = await http.GET(axios, url, config)
            setRouteList(data)
        } catch (error) { }
    }

    const onChange = (value, key, label, labelKey) => {
        setDeliveryValues(data => ({ ...data, [key]: value, ...getLabel(labelKey, label) }))
        setErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'departmentId') {
            setDeliveryValues(data => ({ ...data, routeId: null }))
            getRouteList(value)
        }

        // Validations
        if (key === 'phoneNumber') {
            const error = validateMobileNumber(value)
            setErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key.includes('product')) {
            const error = validateNumber(value)
            setErrors(errors => ({ ...errors, productNPrice: error }))
        }
        else if (key.includes('price')) {
            const error = validateIntFloat(value)
            setErrors(errors => ({ ...errors, productNPrice: error }))
        }
    }
    console.log('asdfsf', deliveryValues)
    const onBlur = (value, key) => {

        // Validations
        if (key === 'phoneNumber') {
            const error = validateMobileNumber(value, true)
            setErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key.includes('price')) {
            const error = validateIntFloat(value, true)
            setErrors(errors => ({ ...errors, productNPrice: error }))
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
        gstNo, gstProof, departmentId, routeId, devDays, phoneNumber, contactPerson, address,
        deliveryLocation, product20L, price20L, product2L, product1L, price2L, price1L, product500ML,
        price500ML, product300ML, price300ML
    } = deliveryValues

    const gstUploadDisable = gstProof

    return (
        <>
            {/* <div className='title-container'>
                <span className='title'>Delivery Details</span>
            </div> */}
            <div className='app-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='GST Number' error={errors.gstNo} />
                        <CustomInput maxLength={15} uppercase
                            value={gstNo} placeholder='GST Number'
                            error={errors.gstNo}
                            onChange={(value) => onChange(value, 'gstNo')}
                        />
                    </div>
                    <div className='input-container app-upload-file-container app-gst-upload-container'>
                        <DraggerInput onUpload={handleUpload} disabled={gstUploadDisable} />
                        <div className='upload-preview-container'>
                            <UploadPreviewer value={gstProof} title='GST Proof' onUpload={handleUpload} onRemove={onRemove} className='last' error={errors.gstProof} />
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Contact Person' error={errors.contactPerson} mandatory />
                        <CustomInput value={contactPerson}
                            placeholder='Add Name' error={errors.contactPerson}
                            onChange={(value) => onChange(value, 'contactPerson')} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Delivery Location' error={errors.deliveryLocation} mandatory />
                        <SelectInput options={locationOptions} showSearch
                            error={errors.deliveryLocation} value={deliveryLocation}
                            onSelect={(value) => onChange(value, 'deliveryLocation')}
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
                        <InputLabel name='Warehouse' error={errors.departmentId} mandatory />
                        <SelectInput options={warehouseOptions} value={departmentId}
                            error={errors.departmentId}
                            onSelect={(value, label) => onChange(value, 'departmentId', label, 'departmentName')} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Route' error={errors.routeId} mandatory />
                        <SelectInput track options={routeOptions}
                            value={routeId} error={errors.routeId}
                            onSelect={(value, label) => onChange(value, 'routeId', label, 'routeName')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Phone Number' error={errors.phoneNumber} mandatory />
                        <CustomInput value={phoneNumber} placeholder='Phone Number'
                            error={errors.phoneNumber} maxLength={10}
                            onBlur={({ target: { value } }) => onBlur(value, 'phoneNumber')}
                            onChange={(value) => onChange(value, 'phoneNumber')} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Delivery Days' error={errors.devDays} mandatory />
                        <SelectInput value={devDays}
                            options={dayOptions} mode='multiple'
                            error={errors.devDays}
                            onSelect={handleSelect} onDeselect={handleDeselect}
                        />
                    </div>
                </div>
                <div className='columns'>
                    <InputLabel name='Products and Price' error={errors.productNPrice} mandatory />
                    <div className='columns-container'>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='20 Ltrs' />
                                <CustomInput value={product20L} placeholder='Qty'
                                    onChange={(value) => onChange(value, 'product20L')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price20L} placeholder='Rs'
                                    onBlur={(value) => onBlur(value, 'price20L')}
                                    onChange={(value) => onChange(value, 'price20L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='2 Ltrs (Box-1&times;9)' />
                                <CustomInput value={product2L} placeholder='Qty'
                                    onChange={(value) => onChange(value, 'product2L')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price2L} placeholder='Rs'
                                    onBlur={(value) => onBlur(value, 'price2L')}
                                    onChange={(value) => onChange(value, 'price2L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='1 Ltrs (Box-1&times;12)' />
                                <CustomInput value={product1L} placeholder='Qty'
                                    onChange={(value) => onChange(value, 'product1L')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price1L} placeholder='Rs'
                                    onBlur={(value) => onBlur(value, 'price1L')}
                                    onChange={(value) => onChange(value, 'price1L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='500 Ml (Box-1&times;24)' />
                                <CustomInput value={product500ML} placeholder='Qty'
                                    onChange={(value) => onChange(value, 'product500ML')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price500ML} placeholder='Rs'
                                    onBlur={(value) => onBlur(value, 'price500ML')}
                                    onChange={(value) => onChange(value, 'price500ML')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='300 Ml (Box-1&times;30)' />
                                <CustomInput value={product300ML} placeholder='Qty'
                                    onChange={(value) => onChange(value, 'product300ML')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price300ML} placeholder='Rs'
                                    onBlur={(value) => onBlur(value, 'price300ML')}
                                    onChange={(value) => onChange(value, 'price300ML')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CollapseForm