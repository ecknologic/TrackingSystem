import React, { useEffect } from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import SelectInput from '../../../components/SelectInput';
import { resetTrackForm, trackAccountFormOnce } from '../../../utils/Functions';

const RouteForm = ({ data, errors, onChange, departmentOptions, isWHAdmin }) => {

    const { RouteName, RouteDescription, departmentId } = data

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
                    <InputLabel name='Route Name' error={errors.RouteName} mandatory />
                    <CustomInput value={RouteName}
                        error={errors.RouteName} placeholder='Route Name'
                        onChange={(value) => onChange(value, 'RouteName')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Route Description' error={errors.RouteDescription} mandatory />
                    <CustomInput value={RouteDescription}
                        error={errors.RouteDescription} placeholder='Route Description'
                        onChange={(value) => onChange(value, 'RouteDescription')}
                    />
                </div>
            </div>
            {
                isWHAdmin ? null
                    :
                    <div className='row'>
                        <div className='input-container'>
                            <InputLabel name="Department" error={errors.departmentId} mandatory />
                            <SelectInput track
                                options={departmentOptions} value={departmentId}
                                error={errors.departmentId} onSelect={(value) => onChange(value, 'departmentId')}
                            />
                        </div>
                    </div>
            }
        </div>
    )
}
export default RouteForm