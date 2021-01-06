import React, { useEffect } from 'react';
import SelectInput from '../../../../components/SelectInput';
import InputLabel from '../../../../components/InputLabel';
import CustomInput from '../../../../components/CustomInput';
import { resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';

const DCForm = (props) => {

    const { data, errors, routeOptions, disabled, onBlur, driverOptions, onChange } = props

    const { routeId, customerName, mobileNumber, address,
        driverId, cans20L, boxes1L, boxes500ML, boxes250ML } = data

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
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Select Route' error={errors.routeId} mandatory />
                        <SelectInput track options={routeOptions} value={routeId}
                            error={errors.routeId} disabled={disabled}
                            onSelect={(value) => onChange(value, 'routeId')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Person / Shop Name' error={errors.customerName} mandatory />
                        <CustomInput value={customerName} placeholder='Add Name'
                            disabled={disabled} error={errors.customerName}
                            onChange={(value) => onChange(value, 'customerName')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Phone Number' error={errors.mobileNumber} mandatory />
                        <CustomInput maxLength={10} value={mobileNumber} disabled={disabled}
                            placeholder='Phone Number' error={errors.mobileNumber}
                            onBlur={(value) => onBlur(value, 'mobileNumber')}
                            onChange={(value) => onChange(value, 'mobileNumber')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Address' error={errors.address} mandatory />
                        <CustomInput value={address} placeholder='Add Address'
                            disabled={disabled} error={errors.address}
                            onChange={(value) => onChange(value, 'address')}
                        />
                    </div>
                </div>
                <div className='input-container stretch'>
                    <InputLabel name='Driver Name' error={errors.driverId} mandatory />
                    <SelectInput track options={driverOptions} value={driverId}
                        error={errors.driverId} disabled={disabled}
                        onSelect={(value) => onChange(value, 'driverId')}
                    />
                </div>
                <div className='columns'>
                    <InputLabel name='Stock Details' error={errors.stockDetails} />
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
                                <InputLabel name='1 Ltrs (Box-1x12)' />
                                <CustomInput value={boxes1L} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'boxes1L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='500 Ml (Box-1x12)' />
                                <CustomInput value={boxes500ML} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'boxes500ML')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='250 Ml (Box-1x12)' />
                                <CustomInput value={boxes250ML} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'boxes250ML')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default DCForm