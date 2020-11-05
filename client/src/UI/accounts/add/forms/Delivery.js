import { Input } from 'antd';
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons'
import InputWithAddon from '../../../../components/InputWithAddon';
import SelectInput from '../../../../components/SelectInput';
import CustomButton from '../../../../components/CustomButton';
import { dayOptions, routeOptions } from '../../../../assets/fixtures'

const DeliveryForm = () => {
    const [addresses, setAddresses] = useState([])

    const hasNoAddress = !addresses.length

    return (
        <>
            <div className='title-container'>
                <span>Delivery Details</span>
            </div>
            <div className='form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>GST Number</label>
                        <InputWithAddon label='VERIFY' placeholder='GST Number' />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Delivery Location</label>
                        <Input size='large' placeholder='Delivery Location' />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Route</label>
                        <SelectInput options={routeOptions} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <label className='app-input-label-name'>Address</label>
                        <Input size='large' placeholder='Address' />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Phone Number</label>
                        <Input size='large' type='number' placeholder='Phone Number' />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Contact Person</label>
                        <Input size='large' placeholder='Contact Person' />
                    </div>
                </div>
                <div className='columns'>
                    <label className='app-input-label-name'>Products and Price</label>
                    <div className='columns-container'>
                        <div className='column'>
                            <div className='input-container'>
                                <label className='app-input-label-name'>20 Ltrs</label>
                                <Input size='large' placeholder='Add' />
                            </div>
                            <div className='input-container'>
                                <label className='app-input-label-name'>Price</label>
                                <Input size='large' placeholder='Rs' />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <label className='app-input-label-name'>1 Ltrs</label>
                                <Input size='large' placeholder='Add' />
                            </div>
                            <div className='input-container'>
                                <label className='app-input-label-name'>Price</label>
                                <Input size='large' placeholder='Rs' />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <label className='app-input-label-name'>500 Ml</label>
                                <Input size='large' placeholder='Add' />
                            </div>
                            <div className='input-container'>
                                <label className='app-input-label-name'>Price</label>
                                <Input size='large' placeholder='Rs' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Delivery Days</label>
                        <SelectInput options={dayOptions} mode='multiple' />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Deposit Amount</label>
                        <Input size='large' placeholder='Deposit Amount' />
                    </div>
                </div>
                {
                    hasNoAddress && (
                        <div className='row add-new-btn-container'>
                            <CustomButton text='Add New' className='add-new-btn' icon={<PlusOutlined />} />
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default DeliveryForm