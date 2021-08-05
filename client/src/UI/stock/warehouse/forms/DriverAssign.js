import React, { useEffect } from 'react';
import SelectInput from '../../../../components/SelectInput';
import InputLabel from '../../../../components/InputLabel';
import { resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';

const DriverAssign = (props) => {

    const { data, errors, routeOptions, driverOptions, onChange } = props

    const { routeId, driverId } = data


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
                    <div className='input-container'>
                        <InputLabel name='Select Route' error={errors.routeId} mandatory />
                        <SelectInput track options={routeOptions}
                            error={errors.routeId} value={routeId}
                            onSelect={(value) => onChange(value, 'routeId')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Driver Name' error={errors.driverId} mandatory />
                        <SelectInput track options={driverOptions}
                            error={errors.driverId} value={driverId}
                            onSelect={(value) => onChange(value, 'driverId')}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export default DriverAssign