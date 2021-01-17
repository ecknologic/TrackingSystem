import React, { useEffect } from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import { resetTrackForm, trackAccountFormOnce } from '../../../utils/Functions';

const VehicleForm = ({ data, errors, onChange }) => {

    const { vehicleNo, vehicleName, vehicleType } = data

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    return (
        <div className='app-form-container employee-form-container'>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Vehicle Number' error={errors.vehicleNo} mandatory />
                    <CustomInput value={vehicleNo} uppercase
                        error={errors.vehicleNo} placeholder='Vehicle Number'
                        onChange={(value) => onChange(value, 'vehicleNo')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Vehicle Name' error={errors.vehicleName} mandatory />
                    <CustomInput value={vehicleName}
                        error={errors.vehicleName} placeholder='Vehicle Name'
                        onChange={(value) => onChange(value, 'vehicleName')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name="Vehicle Type" error={errors.vehicleType} mandatory />
                    <CustomInput value={vehicleType}
                        error={errors.vehicleType} placeholder="Vehicle Type"
                        onChange={(value) => onChange(value, 'vehicleType')}
                    />
                </div>
            </div>
        </div>
    )
}
export default VehicleForm