import React, { useEffect } from 'react';
import SelectInput from '../../../../components/SelectInput';
import InputLabel from '../../../../components/InputLabel';
import { resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';
import CustomInput from '../../../../components/CustomInput';

const DeliveryForm = (props) => {

    const { data, errors, routeOptions, disabled, driverOptions, vehicleOptions, onBlur, onChange } = props
    const { routeId, driverId, vehicleId, mobileNumber } = data

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    return (
        <div className='app-form-container'>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Driver Name' error={errors.driverId} mandatory />
                    <SelectInput track options={driverOptions} value={driverId}
                        error={errors.driverId} disabled={disabled}
                        onSelect={(value) => onChange(value, 'driverId')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Route' error={errors.routeId} mandatory />
                    <SelectInput track options={routeOptions} value={routeId}
                        error={errors.routeId} disabled={disabled}
                        onSelect={(value) => onChange(value, 'routeId')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Phone Number' error={errors.mobileNumber} mandatory />
                    <CustomInput maxLength={10} value={mobileNumber} disabled
                        placeholder='Phone Number' error={errors.mobileNumber}
                        onBlur={(value) => onBlur(value, 'mobileNumber')}
                        onChange={(value) => onChange(value, 'mobileNumber')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Vehicle Number' error={errors.vehicleId} mandatory />
                    <SelectInput track options={vehicleOptions} value={vehicleId}
                        error={errors.vehicleId} disabled={disabled}
                        onSelect={(value) => onChange(value, 'vehicleId')}
                    />
                </div>
            </div>
        </div>
    )
}
export default DeliveryForm