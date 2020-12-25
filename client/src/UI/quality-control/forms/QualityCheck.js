import React from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import SelectInput from '../../../components/SelectInput';
import InputValue from '../../../components/InputValue';
import CustomTextArea from '../../../components/CustomTextArea';
import dayjs from 'dayjs';

const QualityCheckForm = (props) => {

    const { QC, data, errors, disabled, onChange, batchIdOptions, testResultOptions, onBlur, track } = props

    const { phLevel, TDS, ozoneLevel, testResult, managerName, testType, description, batchId } = data
    const { requestedDate, shiftType, TDS: tds, phLevel: PH, ozoneLevel: oz, managerName: name } = QC

    const date = requestedDate ? dayjs(requestedDate).format('DD/MM/YYYY') : null
    const time = requestedDate ? dayjs(requestedDate).format('hh:mm A') : null

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
                        <InputValue size='larger' value={date || '--'} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Time' />
                        <InputValue size='larger' value={time || '--'} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Shift Time' />
                        <InputValue size='larger' value={shiftType || '--'} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='PH' />
                        <InputValue size='larger' value={PH || '--'} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Ozone Level (Mg/Litre)' />
                        <InputValue size='larger' value={oz || '--'} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Total Dissolved Solids (TDS - mg/litre)' />
                        <InputValue size='larger' value={tds || '--'} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Manager' />
                        <InputValue size='larger' value={name || '--'} />
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
                        <InputLabel name='Test Results' error={errors.testResult} mandatory />
                        <SelectInput track={track} value={testResult} options={testResultOptions}
                            disabled={disabled} error={errors.testResult}
                            onSelect={(value) => onChange(value, 'testResult')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Test Type' error={errors.testType} mandatory />
                        <CustomInput value={testType} placeholder='Add Test Type'
                            disabled={disabled} error={errors.testType}
                            onChange={(value) => onChange(value, 'testType')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Manager Name' error={errors.managerName} mandatory />
                        <CustomInput value={managerName} placeholder='Add Manager Name'
                            disabled={disabled} error={errors.managerName}
                            onChange={(value) => onChange(value, 'managerName')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Test Description' error={errors.description} mandatory />
                        <CustomTextArea maxLength={100} error={errors.description} placeholder='Add Description' value={description}
                            maxRows={4} onChange={(value) => onChange(value, 'description')}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export default QualityCheckForm