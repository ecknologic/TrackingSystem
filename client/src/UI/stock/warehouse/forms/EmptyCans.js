import React, { useEffect } from 'react';
import SelectInput from '../../../../components/SelectInput';
import InputLabel from '../../../../components/InputLabel';
import CustomInput from '../../../../components/CustomInput';
import CustomTextArea from '../../../../components/CustomTextArea';
import { resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';

const EmptyCansForm = (props) => {

    const { data, errors, motherplantOptions, disabled, driverOptions, vehicleOptions, onBlur, onChange } = props
    const { routeId, driverId, vehicleId, mobileNumber } = data
    const { details, emptycans_count } = data


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
                    <InputLabel name='Mother Plant' error={errors.routeId} mandatory />
                    <SelectInput track options={motherplantOptions} value={routeId}
                        error={errors.routeId} disabled={disabled}
                        onSelect={(value) => onChange(value, 'routeId')}
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
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Driver Name' error={errors.driverId} mandatory />
                    <SelectInput track options={driverOptions} value={driverId}
                        error={errors.driverId} disabled={disabled}
                        onSelect={(value) => onChange(value, 'driverId')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Phone Number' error={errors.mobileNumber} mandatory />
                    <CustomInput maxLength={10} value={mobileNumber} disabled
                        placeholder='Phone Number' error={errors.mobileNumber}
                        onBlur={(value) => onBlur(value, 'mobileNumber')}
                        onChange={(value) => onChange(value, 'mobileNumber')}
                    />
                </div>
            </div>
            <div className='columns'>
                <InputLabel name='Return Cans' mandatory />
                <div className='columns-container'>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='20 Ltrs' error={errors.emptycans_count} />
                            <CustomInput value={emptycans_count} disabled={disabled} error={errors.emptycans_count}
                                placeholder='Add' onChange={(value) => onChange(value, 'emptycans_count')} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='input-container stretch'>
                    <InputLabel name='Details' error={errors.details} mandatory />
                    <CustomTextArea disabled={disabled} maxLength={1000} error={errors.details} placeholder='Add Details' value={details}
                        minRows={3} maxRows={5} onChange={(value) => onChange(value, 'details')}
                    />
                </div>
            </div>
        </div>
    )
}
export default EmptyCansForm