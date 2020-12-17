import React from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import SelectInput from '../../../components/SelectInput';

const DispatchForm = (props) => {

    const { data, errors, batchIdOptions, departmentOptions, vehicleOptions, disabled, onBlur, driverOptions, onChange, track } = props

    const { batchId, dispatchTo, managerName, vehicleNo,
        driverId, driverName, mobileNumber, product20L, product1L, product500ML, product250ML } = data
    return (
        <>
            <div className='app-form-container dispatch-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Batch No' error={errors.batchId} mandatory />
                        <SelectInput track={track} value={batchId} options={batchIdOptions}
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
                                    placeholder='Add' onChange={(value) => onChange(value, 'product20L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='1 Ltrs' />
                                <CustomInput value={product1L} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'product1L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='500 Ml' />
                                <CustomInput value={product500ML} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'product500ML')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='250 Ml' />
                                <CustomInput value={product250ML} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'product250ML')} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Driver Name' error={errors.driverName} mandatory />
                        <SelectInput track={track} value={driverId} options={driverOptions}
                            disabled={disabled} error={errors.dispatchTo}
                            onSelect={(value) => onChange(value, 'driverId')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Mobile No' error={errors.mobileNumber} mandatory />
                        <CustomInput value={mobileNumber} placeholder='Add Mobile Number'
                            disabled={disabled} error={errors.mobileNumber}
                            onChange={(value) => onChange(value, 'mobileNumber')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Vehicle No' error={errors.vehicleNo} mandatory />
                        <SelectInput track={track} value={vehicleNo} options={vehicleOptions}
                            disabled={disabled} error={errors.vehicleNo}
                            onSelect={(value) => onChange(value, 'vehicleNo')}
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
                        <InputLabel name='Dispatch To' error={errors.dispatchTo} mandatory />
                        <SelectInput track={track} value={dispatchTo} options={departmentOptions}
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