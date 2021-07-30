import React, { useEffect } from 'react';
import InputLabel from '../../../../components/InputLabel';
import CustomInput from '../../../../components/CustomInput';
import SelectInput from '../../../../components/SelectInput';
import { resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';

const BatchForm = (props) => {

    const { data, errors, disabled, onChange, shiftOptions, batchOptions = [], onBlur } = props

    const { phLevel, TDS, ozoneLevel, batchId, product20L, product2L, product1L,
        product500ML, product300ML, managerName, shiftType } = data

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
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
                    <div className='input-container'>
                        <InputLabel name='Batch No' error={errors.batchId} mandatory />
                        <SelectInput
                            value={batchId}
                            options={batchOptions}
                            track disabled={disabled}
                            error={errors.batchId}
                            onSelect={(value) => onChange(value, 'batchId')}
                        />
                    </div>
                </div>
                <div className='columns' style={{ width: '100%' }}>
                    <InputLabel name='Product Details' error={errors.products} mandatory />
                    <div className='columns-container'>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='20 Ltrs' />
                                <CustomInput value={product20L} disabled={disabled}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'product20L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='2 Ltrs (Box-1&times;9)' />
                                <CustomInput value={product2L} disabled={disabled}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'product2L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='1 Ltrs (Box-1&times;12)' />
                                <CustomInput value={product1L} disabled={disabled}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'product1L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='500 Ml (Box-1&times;24)' />
                                <CustomInput value={product500ML} disabled={disabled}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'product500ML')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='300 Ml (Box-1&times;30)' />
                                <CustomInput value={product300ML} disabled={disabled}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'product300ML')} />
                            </div>
                        </div>
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
export default BatchForm