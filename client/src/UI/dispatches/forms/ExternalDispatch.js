import React, { useEffect } from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import SelectInput from '../../../components/SelectInput';
import CustomTextArea from '../../../components/CustomTextArea';
import { removeFormTracker, resetTrackForm, trackAccountFormOnce } from '../../../utils/Functions';

const ExternalDispatchForm = (props) => {

    const { data, errors, batchIdOptions, vehicleOptions, disabled, driverOptions, onChange, onBlur } = props

    const { batchId, dispatchAddress, managerName, vehicleNo, mobileNumber, driverId, product20L, product1L,
        product500ML, product250ML, price20L, price1L, price500ML, price250ML } = data

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])
    return (
        <>
            <div className='app-form-container external-dispatch-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Batch No' error={errors.customerName} mandatory />
                        <SelectInput track value={batchId} options={batchIdOptions}
                            disabled={disabled} error={errors.batchId}
                            onSelect={(value) => onChange(value, 'batchId')}
                        />
                    </div>
                </div>
                <div className='columns'>
                    <InputLabel name='Products and Price' error={errors.productNPrice} mandatory />
                    <div className='columns-container'>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='20 Ltrs' />
                                <CustomInput value={product20L} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'product20L')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price20L} disabled={disabled}
                                    placeholder='Rs' onChange={(value) => onChange(value, 'price20L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='1 Ltrs' />
                                <CustomInput value={product1L} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'product1L')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price1L} disabled={disabled}
                                    placeholder='Rs' onChange={(value) => onChange(value, 'price1L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='500 Ml' />
                                <CustomInput value={product500ML} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'product500ML')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price500ML} disabled={disabled}
                                    placeholder='Rs' onChange={(value) => onChange(value, 'price500ML')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='250 Ml' />
                                <CustomInput value={product250ML} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'product250ML')} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Price' />
                                <CustomInput value={price250ML} disabled={disabled}
                                    placeholder='Rs' onChange={(value) => onChange(value, 'price250ML')} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Driver Name' error={errors.driverId} />
                        <SelectInput track value={driverId} options={driverOptions}
                            disabled={disabled} error={errors.driverId}
                            onSelect={(value) => onChange(value, 'driverId')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Mobile No' error={errors.mobileNumber} />
                        <CustomInput maxLength={10} value={mobileNumber} placeholder='Add Mobile Number'
                            disabled={disabled} error={errors.mobileNumber}
                            onBlur={(value) => onBlur(value, 'mobileNumber')}
                            onChange={(value) => onChange(value, 'mobileNumber')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Vehicle No' error={errors.vehicleNo} />
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
                        <InputLabel name='Dispatch To' error={errors.dispatchAddress} mandatory />
                        <CustomTextArea maxLength={100} error={errors.dispatchAddress} placeholder='Add Address' value={dispatchAddress}
                            maxRows={4} onChange={(value) => onChange(value, 'dispatchAddress')}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export default ExternalDispatchForm