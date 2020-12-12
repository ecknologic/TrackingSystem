import React from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import SelectInput from '../../../components/SelectInput';

const DispatchForm = (props) => {

    const { data, errors, routeOptions, disabled, onBlur, driverOptions, dayOptions = [], onSelect, onDeselect, onChange, track } = props

    const { routeId, customerName, mobileNumber, address,
        driverId, cans20L, boxes1L, boxes500ML, boxes250ML } = data

    return (
        <>
            <div className='app-form-container dispatch-form-container'>
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
                    <InputLabel name='Item Dispatched' error={errors.stockDetails} />
                    <div className='columns-container'>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='20 Ltrs' />
                                <CustomInput value={cans20L} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'cans20L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='1 Ltrs' />
                                <CustomInput value={boxes1L} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'boxes1L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='500 Ml' />
                                <CustomInput value={boxes500ML} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'boxes500ML')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='250 Ml' />
                                <CustomInput value={boxes250ML} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'boxes250ML')} />
                            </div>
                        </div>
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
                        <CustomInput value={customerName} placeholder='Add Manager Name'
                            disabled={disabled} error={errors.customerName}
                            onChange={(value) => onChange(value, 'customerName')}
                        />
                    </div>

                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Dispatch To' error={errors.mobileNumber} mandatory />
                        <SelectInput track={track} value={mobileNumber} options={dayOptions}
                            disabled={disabled} mode='multiple' error={errors.mobileNumber}
                            onSelect={onSelect} onDeselect={onDeselect}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export default DispatchForm