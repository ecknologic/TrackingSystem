import React, { useEffect } from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import SelectInput from '../../../components/SelectInput';
import { removeFormTracker, resetTrackForm, trackAccountFormOnce } from '../../../utils/Functions';

const DispatchForm = (props) => {

    const { data, errors, batchIdOptions, warehouseOptions, vehicleOptions, disabled, driverOptions,
        onChange, onBlur } = props

    const { batchId, dispatchTo, managerName, vehicleNo, driverId, mobileNumber,
        product20L, product1L, product500ML, product250ML } = data

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    return (
        <>
            <div className='app-form-container dispatch-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Batch No' error={errors.batchId} mandatory />
                        <SelectInput track value={batchId} options={batchIdOptions}
                            disabled={disabled} error={errors.batchId}
                            onSelect={(value) => onChange(value, 'batchId')}
                        />
                    </div>
                </div>
                <div className='columns'>
                    <InputLabel name='Item Dispatched' error={errors.products} />
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
                                <InputLabel name='1 Ltrs' />
                                <CustomInput value={product1L} disabled={disabled}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'product1L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='500 Ml' />
                                <CustomInput value={product500ML} disabled={disabled}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'product500ML')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='250 Ml' />
                                <CustomInput value={product250ML} disabled={disabled}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'product250ML')} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Driver Name' error={errors.driverId} mandatory />
                        <SelectInput track value={driverId} options={driverOptions}
                            disabled={disabled} error={errors.driverId}
                            onSelect={(value) => onChange(value, 'driverId')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Mobile No' error={errors.mobileNumber} mandatory />
                        <CustomInput value={mobileNumber} placeholder='Add Mobile Number'
                            maxLength={10} disabled={disabled} error={errors.mobileNumber}
                            onBlur={(value) => onBlur(value, 'mobileNumber')}
                            onChange={(value) => onChange(value, 'mobileNumber')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Vehicle No' error={errors.vehicleNo} mandatory />
                        <SelectInput track value={vehicleNo} options={vehicleOptions}
                            disabled={disabled} error={errors.vehicleNo}
                            onSelect={(value) => onChange(value, 'vehicleNo')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Manager Name' error={errors.managerName} mandatory />
                        <CustomInput value={managerName} placeholder='Add Manager Name'
                            maxLength={20} disabled={disabled} error={errors.managerName}
                            onChange={(value) => onChange(value, 'managerName')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Dispatch To' error={errors.dispatchTo} mandatory />
                        <SelectInput track value={dispatchTo} options={warehouseOptions}
                            disabled={disabled} error={errors.dispatchTo}
                            onSelect={(value) => onChange(value, 'dispatchTo')}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export default DispatchForm