import React from 'react';
import InputLabel from '../../../../components/InputLabel';
import CustomInput from '../../../../components/CustomInput';

const BatchForm = (props) => {

    const { data, errors, routeOptions, disabled, onBlur, driverOptions, onChange, track } = props

    const { routeId, customerName, mobileNumber, address,
        driverId, cans20L, boxes1L, boxes500ML, boxes250ML } = data

    return (
        <>
            <div className='app-form-container batch-form-container'>
                <div className='columns'>
                    <InputLabel name='Products and Price' error={errors.stockDetails} />
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
                        <InputLabel name='Batch No' error={errors.customerName} mandatory />
                        <CustomInput value={customerName} placeholder='Add Batch Number'
                            disabled={disabled} error={errors.customerName}
                            onChange={(value) => onChange(value, 'customerName')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='PH' error={errors.customerName} mandatory />
                        <CustomInput value={customerName} placeholder='Add PH'
                            disabled={disabled} error={errors.customerName}
                            onChange={(value) => onChange(value, 'customerName')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Ozone Level (mg/Litre)' error={errors.mobileNumber} mandatory />
                        <CustomInput value={customerName} placeholder='Add Ozone Level'
                            disabled={disabled} error={errors.customerName}
                            onChange={(value) => onChange(value, 'customerName')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Total Dissolved Solids (TDS - mg/litre)' error={errors.customerName} mandatory />
                        <CustomInput value={customerName} placeholder='Add Total Dissolved Solids'
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
            </div>
        </>
    )
}
export default BatchForm