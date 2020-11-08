import { Input } from 'antd';
import React, { useEffect, useState } from 'react';
import SelectInput from '../../../../components/SelectInput';
import InputWithAddon from '../../../../components/InputWithAddon';
import { dayOptions } from '../../../../assets/fixtures'

const CollapseForm = ({ data, routeOptions, uniqueId }) => {

    const [gstNo, setGstNo] = useState('')
    const [address, setAddress] = useState('')
    const [devDays, setDevDays] = useState()
    const [mobileNumber, setMobileNumber] = useState('')
    const [contactPerson, setContactPerson] = useState('')
    const [depositAmount, setDepositAmount] = useState('')
    const [deliveryLocation, setDeliveryLocation] = useState('')
    const [routingId, setRoutingId] = useState()
    const [product1, setProduct1] = useState('')
    const [product2, setProduct2] = useState('')
    const [product3, setProduct3] = useState('')
    const [price1, setPrice1] = useState('')
    const [price2, setPrice2] = useState('')
    const [price3, setPrice3] = useState('')

    useEffect(() => { // To pre-fill the form
        populateForm(data)
    }, [])

    useEffect(() => { // To set form data to session storage
        setSession()
    }, [gstNo, depositAmount, routingId, devDays, product1, product2, product3,
        price1, price2, price3, mobileNumber, contactPerson, address, deliveryLocation])

    const setSession = () => {
        const products = []
        const item1 = { productName: '20L', productPrice: price1, noOfJarsTobePlaced: product1 }
        const item2 = { productName: '1L', productPrice: price2, noOfJarsTobePlaced: product2 }
        const item3 = { productName: '500ML', productPrice: price3, noOfJarsTobePlaced: product3 }
        if (price1 && product1) products.push(item1)
        if (price2 && product2) products.push(item2)
        if (price3 && product3) products.push(item3)

        const data = {
            uniqueId, gstNo, depositAmount, routingId, deliveryDays: devDays, products,
            mobileNumber, contactPerson, address, deliveryLocation
        }

        sessionStorage.setItem(`address${uniqueId}`, JSON.stringify(data))
    }

    const populateForm = (data) => {
        const {
            products, gstNo, depositAmount, routingId, deliveryDays,
            mobileNumber, contactPerson, address, deliveryLocation
        } = data

        products.map((item) => {
            const { productName, noOfJarsTobePlaced, productPrice } = item
            if (productName === '20L') { setProduct1(noOfJarsTobePlaced); setPrice1(productPrice) }
            else if (productName === '1L') { setProduct2(noOfJarsTobePlaced); setPrice2(productPrice) }
            else if (productName === '500ML') { setProduct3(noOfJarsTobePlaced); setPrice3(productPrice) }
        })

        setGstNo(gstNo)
        setAddress(address)
        setDevDays(deliveryDays)
        setMobileNumber(mobileNumber)
        setContactPerson(contactPerson)
        setDepositAmount(depositAmount)
        setDeliveryLocation(deliveryLocation)
        setRoutingId(routingId)
    }


    const handleSelect = (value) => {
        if (devDays) {
            const clone = [...devDays]
            clone.push(value)
            setDevDays(clone)
        }
        else setDevDays([value])
    }

    const handleDeselect = (value) => {
        if (devDays) {
            const clone = [...devDays]
            const filtered = clone.filter(day => day !== value)
            setDevDays(filtered)
        }
        else setDevDays([value])
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
                        <Input size='large' value={mobileNumber} type='number' placeholder='Phone Number' onChange={({ target: { value } }) => setMobileNumber(value)} />
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
                                <Input size='large' value={product1} placeholder='Add' onChange={({ target: { value } }) => setProduct1(value)} />
                            </div>
                            <div className='input-container'>
                                <label className='app-input-label-name'>Price</label>
                                <Input size='large' value={price1} placeholder='Rs' onChange={({ target: { value } }) => setPrice1(value)} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <label className='app-input-label-name'>1 Ltrs</label>
                                <Input size='large' value={product2} placeholder='Add' onChange={({ target: { value } }) => setProduct2(value)} />
                            </div>
                            <div className='input-container'>
                                <label className='app-input-label-name'>Price</label>
                                <Input size='large' value={price2} placeholder='Rs' onChange={({ target: { value } }) => setPrice2(value)} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <label className='app-input-label-name'>500 Ml</label>
                                <Input size='large' value={product3} placeholder='Add' onChange={({ target: { value } }) => setProduct3(value)} />
                            </div>
                            <div className='input-container'>
                                <label className='app-input-label-name'>Price</label>
                                <Input size='large' value={price3} placeholder='Rs' onChange={({ target: { value } }) => setPrice3(value)} />
                            </div>
                        </div>
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