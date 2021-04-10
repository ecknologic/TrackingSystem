import { Radio } from 'antd';
import React, { useEffect } from 'react';
import SelectInput from '../../../../components/SelectInput';
import InputLabel from '../../../../components/InputLabel';
import CustomInput from '../../../../components/CustomInput';
import { resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';

const DCForm = (props) => {

    const { data, errors, routeOptions, disabledItems, onBlur, driverOptions, distributorOptions, customerOptions, onChange } = props

    const { routeId, customerName, phoneNumber, address, driverId, product20L, product2L, product1L,
        product500ML, product300ML, existingCustomerId, distributorId, customerType, creationType, EmailId } = data

    const disableAll = disabledItems === 'ALL' && disabledItems !== 'NONE'
    const disableFew = disabledItems === 'FEW'
    const isDistributor = customerType === 'distributor'
    const isNewCustomer = customerType === 'newCustomer'
    const isExistingCustomer = customerType === 'internal'
    const showCustType = creationType === 'manual'

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    return (
        <>
            <div className='app-form-container'>
                {
                    showCustType && (
                        <div className='row'>
                            <div className='input-container stretch'>
                                <InputLabel name='Customer Type' mandatory />
                                <Radio.Group
                                    onChange={({ target: { value } }) => onChange(value, 'customerType')}
                                    value={customerType}
                                    disabled={disableAll || disableFew}
                                    className='radio-btns'
                                >
                                    <Radio value='newCustomer'>New Customer</Radio>
                                    <Radio value='internal'>Existing Customer</Radio>
                                    <Radio value='distributor'>Distributor</Radio>
                                </Radio.Group>
                            </div>
                        </div>
                    )
                }
                <div className='row'>
                    {
                        isNewCustomer &&
                        (
                            <div className='input-container'>
                                <InputLabel name='Name' error={errors.customerName} mandatory />
                                <CustomInput value={customerName} placeholder='Add Name'
                                    disabled={disableAll || disableFew} error={errors.customerName}
                                    onChange={(value) => onChange(value, 'customerName')}
                                />
                            </div>
                        )
                    }
                    {
                        isExistingCustomer &&
                        (
                            <div className='input-container'>
                                <InputLabel name='Name' error={errors.existingCustomerId} mandatory />
                                <SelectInput track value={existingCustomerId} options={customerOptions}
                                    disabled={disableAll || disableFew} error={errors.existingCustomerId}
                                    onSelect={(value) => onChange(value, 'existingCustomerId')}
                                />
                            </div>
                        )
                    }
                    {
                        isDistributor &&
                        (
                            <div className='input-container'>
                                <InputLabel name='Name' error={errors.distributorId} mandatory />
                                <SelectInput track value={distributorId} options={distributorOptions}
                                    disabled={disableAll || disableFew} error={errors.distributorId}
                                    onSelect={(value) => onChange(value, 'distributorId')}
                                />
                            </div>
                        )
                    }
                    <div className='input-container'>
                        <InputLabel name='Phone Number' error={errors.phoneNumber} mandatory />
                        <CustomInput maxLength={10} value={phoneNumber} disabled={disableAll || disableFew}
                            placeholder='Phone Number' error={errors.phoneNumber}
                            onBlur={(value) => onBlur(value, 'phoneNumber')}
                            onChange={(value) => onChange(value, 'phoneNumber')}
                        />
                    </div>
                </div>
                {
                    isNewCustomer &&
                    (
                        <div className='row'>
                            <div className='input-container'>
                                <InputLabel name='Email' error={errors.EmailId} mandatory />
                                <CustomInput
                                    value={EmailId} type='email' disabled={disableAll || disableFew}
                                    placeholder='Email' error={errors.EmailId}
                                    onBlur={(value) => onBlur(value, 'EmailId')}
                                    onChange={(value) => onChange(value, 'EmailId')}
                                />
                            </div>
                        </div>
                    )
                }
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Address' error={errors.address} mandatory />
                        <CustomInput value={address} placeholder='Add Address'
                            disabled={disableAll || disableFew} error={errors.address}
                            onChange={(value) => onChange(value, 'address')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Select Route' error={errors.routeId} mandatory={isDistributor} />
                        <SelectInput track options={routeOptions} value={routeId}
                            error={errors.routeId} disabled={disableAll}
                            onSelect={(value) => onChange(value, 'routeId')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Driver Name' error={errors.driverId} mandatory={isDistributor} />
                        <SelectInput track options={driverOptions} value={driverId}
                            error={errors.driverId} disabled={disableAll}
                            onSelect={(value) => onChange(value, 'driverId')}
                        />
                    </div>
                </div>
                <div className='columns'>
                    <InputLabel name='Stock Details' error={errors.products} mandatory />
                    <div className='columns-container'>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='20 Ltrs' />
                                <CustomInput value={product20L} disabled={disableAll || disableFew}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'product20L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='2 Ltrs (Box-1&times;9)' />
                                <CustomInput value={product2L} disabled={disableAll || disableFew}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'product2L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='1 Ltrs (Box-1&times;12)' />
                                <CustomInput value={product1L} disabled={disableAll || disableFew}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'product1L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='500 Ml (Box-1&times;24)' />
                                <CustomInput value={product500ML} disabled={disableAll || disableFew}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'product500ML')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='300 Ml (Box-1&times;30)' />
                                <CustomInput value={product300ML} disabled={disableAll || disableFew}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'product300ML')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default DCForm