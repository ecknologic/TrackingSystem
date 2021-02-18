import React, { useEffect } from 'react';
import SelectInput from '../../../../components/SelectInput';
import InputLabel from '../../../../components/InputLabel';
import CustomInput from '../../../../components/CustomInput';
import { resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';

const DCForm = (props) => {

    const { data, errors, routeOptions, disabledItems, onBlur, driverOptions, onChange } = props

    const { routeId, customerName, phoneNumber, address, driverId, cans20L, boxes2L, boxes1L,
        boxes500ML, boxes300ML } = data

    const disableAll = disabledItems === 'ALL' && disabledItems !== 'NONE'
    const disableFew = disabledItems === 'FEW'

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    return (
        <>
            <div className='app-form-container'>
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Select Route' error={errors.routeId} mandatory />
                        <SelectInput track options={routeOptions} value={routeId}
                            error={errors.routeId} disabled={disableAll}
                            onSelect={(value) => onChange(value, 'routeId')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Person / Shop Name' error={errors.customerName} mandatory />
                        <CustomInput value={customerName} placeholder='Add Name'
                            disabled={disableAll || disableFew} error={errors.customerName}
                            onChange={(value) => onChange(value, 'customerName')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Phone Number' error={errors.phoneNumber} mandatory />
                        <CustomInput maxLength={10} value={phoneNumber} disabled={disableAll || disableFew}
                            placeholder='Phone Number' error={errors.phoneNumber}
                            onBlur={(value) => onBlur(value, 'phoneNumber')}
                            onChange={(value) => onChange(value, 'phoneNumber')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Address' error={errors.address} mandatory />
                        <CustomInput value={address} placeholder='Add Address'
                            disabled={disableAll || disableFew} error={errors.address}
                            onChange={(value) => onChange(value, 'address')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Driver Name' error={errors.driverId} mandatory />
                        <SelectInput track options={driverOptions} value={driverId}
                            error={errors.driverId} disabled={disableAll}
                            onSelect={(value) => onChange(value, 'driverId')}
                        />
                    </div>
                </div>
                <div className='columns'>
                    <InputLabel name='Stock Details' error={errors.products} mandatory />
                    <div className='columns-container'>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='20 Ltrs' />
                                <CustomInput value={cans20L} disabled={disableAll || disableFew}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'cans20L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='2 Ltrs (Box-1x12)' />
                                <CustomInput value={boxes2L} disabled={disableAll || disableFew}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'boxes2L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='1 Ltrs (Box-1x12)' />
                                <CustomInput value={boxes1L} disabled={disableAll || disableFew}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'boxes1L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='500 Ml (Box-1x12)' />
                                <CustomInput value={boxes500ML} disabled={disableAll || disableFew}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'boxes500ML')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='300 Ml (Box-1x12)' />
                                <CustomInput value={boxes300ML} disabled={disableAll || disableFew}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'boxes300ML')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default DCForm