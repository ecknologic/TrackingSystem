import React from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import SelectInput from '../../../components/SelectInput';
import CustomTextArea from '../../../components/CustomTextArea';

const ExternalDispatchForm = (props) => {

    const { data, errors, routeOptions, disabled, onBlur, driverOptions, dayOptions = [],
        onSelect, onDeselect, onChange, track } = props

    const { routeId, customerName, mobileNumber, address, driverId, product20L, product1L,
        product500ML, price20L, price1L, price500ML, } = data

    return (
        <>
            <div className='app-form-container external-dispatch-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='DC No' error={errors.customerName} mandatory />
                        <CustomInput value={customerName} placeholder='Add DC Number'
                            disabled={disabled} error={errors.customerName}
                            onChange={(value) => onChange(value, 'customerName')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Batch No' error={errors.customerName} mandatory />
                        <CustomInput value={customerName} placeholder='Add Batch Number'
                            disabled={disabled} error={errors.customerName}
                            onChange={(value) => onChange(value, 'customerName')}
                        />
                    </div>
                </div>
                <div className='columns'>
                    <InputLabel name='Products and Price' error={errors.productNPrice} mandatory />
                    <div className='columns-container'>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='20 Ltrs' />
                                <CustomInput value={product20L} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'product20L')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price20L} disabled={disabled}
                                    placeholder='Rs' onChange={(value) => onChange(value, 'price20L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='1 Ltrs' />
                                <CustomInput value={product1L} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'product1L')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price1L} disabled={disabled}
                                    placeholder='Rs' onChange={(value) => onChange(value, 'price1L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='500 Ml' />
                                <CustomInput value={product500ML} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'product500ML')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price500ML} disabled={disabled}
                                    placeholder='Rs' onChange={(value) => onChange(value, 'price500ML')} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Driver Mobile Number' error={errors.customerName} mandatory />
                        <CustomInput value={customerName} placeholder='Add Driver Mobile Number'
                            disabled={disabled} error={errors.customerName}
                            onChange={(value) => onChange(value, 'customerName')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Driver Name' error={errors.mobileNumber} mandatory />
                        <SelectInput track={track} value={mobileNumber} options={dayOptions}
                            disabled={disabled} error={errors.mobileNumber}
                            onSelect={onSelect} onDeselect={onDeselect}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Vehicle No' error={errors.customerName} mandatory />
                        <CustomInput value={customerName} placeholder='Add Vehicle Number'
                            disabled={disabled} error={errors.customerName}
                            onChange={(value) => onChange(value, 'customerName')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Manager Name' error={errors.mobileNumber} mandatory />
                        <SelectInput track={track} value={mobileNumber} options={dayOptions}
                            disabled={disabled} error={errors.mobileNumber}
                            onSelect={onSelect} onDeselect={onDeselect}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Dispatch To' error={errors.mobileNumber} mandatory />
                        <CustomTextArea placeholder='Add Address' maxRows={4} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Amount' error={errors.customerName} mandatory />
                        <CustomInput value={customerName} placeholder='Add Amount'
                            disabled={disabled} error={errors.customerName}
                            onChange={(value) => onChange(value, 'customerName')}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export default ExternalDispatchForm