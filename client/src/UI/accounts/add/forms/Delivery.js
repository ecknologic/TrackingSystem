import { Input } from 'antd';
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons'
import InputWithAddon from '../../../../components/InputWithAddon';
import SelectInput from '../../../../components/SelectInput';
import CustomButton from '../../../../components/CustomButton';
import { dayOptions, routeOptions } from '../../../../assets/fixtures'
import ProductAndPrice from '../../../../components/ProductAndPrice';

const DeliveryForm = (props) => {
    const { onChange } = props

    const [addresses, setAddresses] = useState([])
    const [devDays, setDevDays] = useState(() => ({ SUN: 0, MON: 0, TUE: 0, WED: 0, THU: 0, FRI: 0, SAT: 0 }))

    const handleDevDaysSelect = (value) => {
        const days = { ...devDays }
        days[value] = 1
        setDevDays(days)
        onChange(days, 'deliveryDays')
    }

    const handleDevDaysDeSelect = (value) => {
        const days = { ...devDays }
        days[value] = 0
        setDevDays(days)
        onChange(days, 'deliveryDays')
    }

    const hasNoAddress = !addresses.length

    return (
        <>
            <div className='title-container'>
                <span className='title'>Delivery Details</span>
                {!hasNoAddress && <CustomButton text='Add New' className='app-add-new-btn' icon={<PlusOutlined />} />}
            </div>
            <div className='form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>GST Number</label>
                        <InputWithAddon label='VERIFY' placeholder='GST Number' onChange={({ target: { value } }) => onChange(value, 'gstNo')} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Delivery Location</label>
                        <Input size='large' placeholder='Add Location' onChange={({ target: { value } }) => onChange(value, 'deliveryLocation')} />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Route</label>
                        <SelectInput options={routeOptions} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <label className='app-input-label-name'>Address</label>
                        <Input size='large' placeholder='Add Address' onChange={({ target: { value } }) => onChange(value, 'address')} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Phone Number</label>
                        <Input size='large' type='number' placeholder='Phone Number' onChange={({ target: { value } }) => onChange(value, 'mobileNumber')} />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Contact Person</label>
                        <Input size='large' placeholder='Add Name' onChange={({ target: { value } }) => onChange(value, 'contactPerson')} />
                    </div>
                </div>
                <div className='columns'>
                    <label className='app-input-label-name'>Products and Price</label>
                    <div className='columns-container'>
                        <ProductAndPrice onChange={onChange} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Delivery Days</label>
                        <SelectInput options={dayOptions} mode='multiple' onSelect={handleDevDaysSelect} onDeselect={handleDevDaysDeSelect} />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Deposit Amount</label>
                        <Input size='large' placeholder='Deposit Amount' onChange={({ target: { value } }) => onChange(value, 'depositAmount')} />
                    </div>
                </div>
                {
                    hasNoAddress && (
                        <div className='row add-new-btn-container'>
                            <CustomButton text='Add New' className='app-add-new-btn' icon={<PlusOutlined />} />
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default DeliveryForm