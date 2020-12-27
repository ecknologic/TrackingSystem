import React, { useEffect } from 'react';
import InputLabel from '../../../../components/InputLabel';
import CustomInput from '../../../../components/CustomInput';
import SelectInput from '../../../../components/SelectInput';
import { removeFormTracker, resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';

const InteralQCForm = (props) => {

    const { data, errors, disabled, onChange, shiftOptions, onBlur } = props

    const { phLevel, TDS, ozoneLevel, managerName, shiftType } = data

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            removeFormTracker()
        }
    }, [])

    return (
        <>
            <div className='app-form-container batch-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Shift Time' error={errors.shiftType} mandatory />
                        <SelectInput
                            value={shiftType}
                            options={shiftOptions}
                            track disabled={disabled}
                            error={errors.shiftType}
                            onSelect={(value) => onChange(value, 'shiftType')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='PH' error={errors.phLevel} mandatory />
                        <CustomInput value={phLevel} placeholder='Add PH'
                            disabled={disabled} error={errors.phLevel}
                            onBlur={(value) => onBlur(value, 'phLevel')}
                            onChange={(value) => onChange(value, 'phLevel')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Ozone Level (mg/Litre)' error={errors.ozoneLevel} mandatory />
                        <CustomInput value={ozoneLevel} placeholder='Add Ozone Level'
                            disabled={disabled} error={errors.ozoneLevel}
                            onBlur={(value) => onBlur(value, 'ozoneLevel')}
                            onChange={(value) => onChange(value, 'ozoneLevel')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Total Dissolved Solids (TDS - mg/litre)' mandatory />
                        <CustomInput value={TDS} placeholder='Add Total Dissolved Solids'
                            disabled={disabled} error={errors.TDS}
                            onBlur={(value) => onBlur(value, 'TDS')}
                            onChange={(value) => onChange(value, 'TDS')}
                        />
                        <InputLabel error={errors.TDS} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Manager Name' error={errors.managerName} mandatory />
                        <CustomInput value={managerName} placeholder='Add Manager Name'
                            disabled={disabled} error={errors.managerName}
                            onChange={(value) => onChange(value, 'managerName')}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export default InteralQCForm