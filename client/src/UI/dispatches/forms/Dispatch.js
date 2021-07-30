import React, { useEffect } from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import SelectInput from '../../../components/SelectInput';
import { resetTrackForm, trackAccountFormOnce } from '../../../utils/Functions';

const DispatchForm = (props) => {

    const { data, errors, batchIdOptions, warehouseOptions, vehicleOptions, disabled, driverOptions,
        onChange, onBlur, distributorOptions } = props

    const { batchId, dispatchTo, managerName, vehicleNo, driverId, mobileNumber,
        product20L, product2L, product1L, product500ML, product300ML, dispatchType } = data

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    const dispatchToOptions = dispatchType === 'warehouse' ? warehouseOptions : distributorOptions

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
                <div className='columns' style={{ width: '100%' }}>
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
                        <InputLabel name='Dispatch To' error={errors.dispatchTo} errClass='dispatchTo' mandatory />
                        {/* <Radio.Group
                            onChange={({ target: { value } }) => onChange(value, 'dispatchType')}
                            value={dispatchType}
                            className='radio-btns'
                        >
                            <Radio value='warehouse'>Warehouse</Radio>
                            <Radio value='distributor'>Distributor</Radio>
                        </Radio.Group> */}
                        <SelectInput track value={dispatchTo} options={dispatchToOptions}
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