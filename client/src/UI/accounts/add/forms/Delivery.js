import { Collapse, Input } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons'
import InputWithAddon from '../../../../components/InputWithAddon';
import SelectInput from '../../../../components/SelectInput';
import CustomButton from '../../../../components/CustomButton';
import { dayOptions } from '../../../../assets/fixtures'

const DeliveryForm = (props) => {

    const { data, onChange, hasExtraAddress, isInCollapse, getId, onGet, onSelect,
        onDeselect, mode, onAdd, routeOptions, resetId } = props

    const {
        dGstNo, depositAmount, products = [], routingId, deliveryDays,
        phoneNumber, contactPerson, shippingAddress, deliveryLocation
    } = data

    const [product1, setProduct1] = useState('')
    const [product2, setProduct2] = useState('')
    const [product3, setProduct3] = useState('')
    const [price1, setPrice1] = useState('')
    const [price2, setPrice2] = useState('')
    const [price3, setPrice3] = useState('')


    useEffect(() => { // To pre-fill the form
        if (mode === 'prefill')
            products.map((item) => {
                const { productName, noOfJarsTobePlaced, productPrice } = item
                if (productName === '20L') { setProduct1(noOfJarsTobePlaced); setPrice1(productPrice) }
                else if (productName === '1L') { setProduct2(noOfJarsTobePlaced); setPrice2(productPrice) }
                else if (productName === '500ML') { setProduct3(noOfJarsTobePlaced); setPrice3(productPrice) }
            })
    }, [mode])

    useEffect(() => { // send data to parent
        if (getId) {
            //Validate products here
            const item1 = { productName: '20L', productPrice: price1, noOfJarsTobePlaced: product1 }
            const item2 = { productName: '1L', productPrice: price2, noOfJarsTobePlaced: product2 }
            const item3 = { productName: '500ML', productPrice: price3, noOfJarsTobePlaced: product3 }
            const data = []
            if (price1 && product1) data.push(item1)
            if (price2 && product2) data.push(item2)
            if (price3 && product3) data.push(item3)
            onGet(data)
        }
    }, [getId])

    useEffect(() => { // reset form values
        if (resetId) {
            setProduct1(''); setPrice1('')
            setProduct2(''); setPrice2('')
            setProduct3(''); setPrice3('')
        }
    }, [resetId])

    return (
        <>
            <div className='form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>GST Number</label>
                        <InputWithAddon label='VERIFY' value={dGstNo} placeholder='GST Number' onChange={({ target: { value } }) => onChange(value, 'dGstNo')} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Delivery Location</label>
                        <Input size='large' value={deliveryLocation} placeholder='Add Location' onChange={({ target: { value } }) => onChange(value, 'deliveryLocation')} />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Route</label>
                        <SelectInput options={routeOptions} value={routingId} onSelect={(value) => onChange(value, 'routingId')} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <label className='app-input-label-name'>Address</label>
                        <Input size='large' value={shippingAddress} placeholder='Add Address' onChange={({ target: { value } }) => onChange(value, 'shippingAddress')} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Phone Number</label>
                        <Input size='large' value={phoneNumber} type='number' placeholder='Phone Number' onChange={({ target: { value } }) => onChange(value, 'phoneNumber')} />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Contact Person</label>
                        <Input size='large' value={contactPerson} placeholder='Add Name' onChange={({ target: { value } }) => onChange(value, 'contactPerson')} />
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
                        <SelectInput value={deliveryDays} options={dayOptions} mode='multiple' onSelect={(value) => onSelect(value, 'deliveryDays')} onDeselect={(value) => onDeselect(value, 'deliveryDays')} />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Deposit Amount</label>
                        <Input size='large' value={depositAmount} placeholder='Deposit Amount' onChange={({ target: { value } }) => onChange(value, 'depositAmount')} />
                    </div>
                </div>
                {
                    (!hasExtraAddress && !isInCollapse) && (
                        <div className='row add-new-btn-container'>
                            <CustomButton text='Add New' onClick={onAdd} className='app-add-new-btn' icon={<PlusOutlined />} />
                        </div>
                    )
                }
            </div>
        </>
    )
}
const { Panel } = Collapse;
export default DeliveryForm