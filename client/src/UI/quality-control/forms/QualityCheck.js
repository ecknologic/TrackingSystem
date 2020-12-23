import React from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import SelectInput from '../../../components/SelectInput';
import InputValue from '../../../components/InputValue';

const QualityCheckForm = (props) => {

    const { data, errors, disabled, onChange, batchIdOptions, onBlur, track } = props

    const { phLevel, TDS, ozoneLevel, managerName, batchId } = data

    return (
        <>
            <div className='app-form-container qc-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Select Batch No' error={errors.batchId} mandatory />
                        <SelectInput track={track} value={batchId} options={batchIdOptions}
                            disabled={disabled} error={errors.batchId}
                            onSelect={(value) => onChange(value, 'batchId')}
                        />
                    </div>
                </div>
                <div className='row half-stretch'>
                    <div className='input-container'>
                        <InputLabel name='Date' />
                        <InputValue size='larger' value='24/09/2020' />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Time' />
                        <InputValue size='larger' value='12:45' />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Shift Time' />
                        <InputValue size='larger' value='Morning' />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='PH' />
                        <InputValue size='larger' value='2.4 to 5.4' />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Ozone Level (Mg/Litre)' />
                        <InputValue size='larger' value='2.4 to 5.4' />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Total Dissolved Solids (TDS - mg/litre)' />
                        <InputValue size='larger' value='900 to 1200' />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Manager' />
                        <InputValue size='larger' value='Hemasundar' />
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
                        <InputLabel name='Test Results' error={errors.managerName} mandatory />
                        <SelectInput track={track} value={batchId} options={batchIdOptions}
                            disabled={disabled} error={errors.batchId}
                            onSelect={(value) => onChange(value, 'batchId')}
                        />
                    </div>
                </div>
                <div className='row'>
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
export default QualityCheckForm