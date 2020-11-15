import { Input, InputNumber } from 'antd';
import React, { useEffect, useState } from 'react';
import SelectInput from '../../../../components/SelectInput';
import InputWithAddon from '../../../../components/InputWithAddon';
import { dayOptions } from '../../../../assets/fixtures'

const CollapseForm = ({ data, routeOptions, uniqueId }) => {

    const [gstNo, setGstNo] = useState('')
    const [address, setAddress] = useState('')
    const [devDays, setDevDays] = useState()
    const [phoneNumber, setPhoneNumber] = useState('')
    const [contactPerson, setContactPerson] = useState('')
    const [depositAmount, setDepositAmount] = useState('')
    const [deliveryLocation, setDeliveryLocation] = useState('')
    const [routingId, setRoutingId] = useState()
    const [product20L, setProduct20L] = useState('')
    const [product1L, setProduct1L] = useState('')
    const [product500ML, setProduct500ML] = useState('')
    const [price20L, setPrice20L] = useState('')
    const [price1L, setPrice1L] = useState('')
    const [price500ML, setPrice500ML] = useState('')

    useEffect(() => { // To pre-fill the form
        populateForm(data)
    }, [])

    useEffect(() => { // To set form data to session storage
        setSession()
    }, [gstNo, depositAmount, routingId, devDays, product20L, price20L, product1L, price1L,
        product500ML, price500ML, phoneNumber, contactPerson, address, deliveryLocation])

    const populateForm = (data) => {
        const {
            gstNo, depositAmount, routingId, devDays, phoneNumber, contactPerson, address,
            deliveryLocation, product20L, price20L, product1L, price1L, product500ML, price500ML
        } = data

        setProduct20L(product20L)
        setProduct1L(product1L)
        setProduct500ML(product500ML)
        setPrice20L(price20L)
        setPrice1L(price1L)
        setPrice500ML(price500ML)
        setGstNo(gstNo)
        setAddress(address)
        setDevDays(devDays)
        setPhoneNumber(phoneNumber)
        setContactPerson(contactPerson)
        setDepositAmount(depositAmount)
        setDeliveryLocation(deliveryLocation)
        setRoutingId(routingId)
    }

    const setSession = () => {
        const data = {
            gstNo, depositAmount, routingId, devDays, product20L, price20L, product1L, price1L, product500ML, price500ML,
            phoneNumber, contactPerson, address, deliveryLocation
        }
        sessionStorage.setItem(`address${uniqueId}`, JSON.stringify(data))
    }

    const handleSelect = (value) => {
        devDays.push(value)
        setDevDays(devDays)
    }

    const handleDeselect = (value) => {
        const filtered = devDays.filter(day => day !== value)
        setDevDays(filtered)
    }

    return (
        <>
            <div className='title-container'>
                <span className='title'>Delivery Details</span>
            </div>
            <div className='form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>GST Number</label>
                        <InputWithAddon label='VERIFY' value={gstNo} placeholder='GST Number' onChange={({ target: { value } }) => setGstNo(value)} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Delivery Location</label>
                        <Input size='large' value={deliveryLocation} placeholder='Add Location' onChange={({ target: { value } }) => setDeliveryLocation(value)} />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Route</label>
                        <SelectInput options={routeOptions} value={routingId} onSelect={setRoutingId} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <label className='app-input-label-name'>Address</label>
                        <Input size='large' value={address} placeholder='Add Address' onChange={({ target: { value } }) => setAddress(value)} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Phone Number</label>
                        <InputNumber size="large" value={phoneNumber} placeholder='Phone Number' onChange={(value) => setPhoneNumber(value)} />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Contact Person</label>
                        <Input size='large' value={contactPerson} placeholder='Add Name' onChange={({ target: { value } }) => setContactPerson(value)} />
                    </div>
                </div>
                <div className='columns'>
                    <label className='app-input-label-name'>Products and Price</label>
                    <div className='columns-container'>
                        <div className='column'>
                            <div className='input-container'>
                                <label className='app-input-label-name'>20 Ltrs</label>
                                <InputNumber size="large" value={product20L} placeholder='Add' onChange={setProduct20L} />
                            </div>
                            <div className='input-container'>
                                <label className='app-input-label-name'>Price</label>
                                <InputNumber size="large" value={price20L} placeholder='Rs' onChange={setPrice20L} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <label className='app-input-label-name'>1 Ltrs</label>
                                <InputNumber size="large" value={product1L} placeholder='Add' onChange={setProduct1L} />
                            </div>
                            <div className='input-container'>
                                <label className='app-input-label-name'>Price</label>
                                <InputNumber size="large" value={price1L} placeholder='Rs' onChange={setPrice1L} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <label className='app-input-label-name'>500 Ml</label>
                                <InputNumber size="large" value={product500ML} placeholder='Add' onChange={setProduct500ML} />
                            </div>
                            <div className='input-container'>
                                <label className='app-input-label-name'>Price</label>
                                <InputNumber size="large" value={price500ML} placeholder='Rs' onChange={setPrice500ML} />
                            </div>
                        </div>
                        {/* <div className='column'>
                            <div className='input-container'>
                                <label className='app-input-label-name'>250 Ml</label>
                                <InputNumber size="large" value={product250ML} placeholder='Add' onChange={setProduct250ML} />
                            </div>
                            <div className='input-container'>
                                <label className='app-input-label-name'>Price</label>
                                <InputNumber size="large" value={price250ML} placeholder='Rs' onChange={setPrice250ML} />
                            </div>
                        </div> */}
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Delivery Days</label>
                        <SelectInput value={devDays} options={dayOptions} mode='multiple' onSelect={handleSelect} onDeselect={handleDeselect} />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Deposit Amount</label>
                        <Input size='large' value={depositAmount} placeholder='Deposit Amount' onChange={({ target: { value } }) => setDepositAmount(value)} />
                    </div>
                </div>
            </div>
        </>
    )
}
export default CollapseForm