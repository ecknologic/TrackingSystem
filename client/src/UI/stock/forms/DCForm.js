import React from 'react';
import SelectInput from '../../../components/SelectInput';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';

const DCForm = (props) => {

    const { data, errors, routeOptions, disabled, onBlur, driverOptions, onChange, track } = props

    const { routeId, customerName, mobileNumber, address,
        driverId, twentyLCans, OneLBoxes, fiveHLBoxes, twofiftyLBoxes } = data

    return (
        <>
            <div className='app-form-container dc-form-container'>
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Select Route' error={errors.routeId} mandatory />
                        <SelectInput track={track} options={routeOptions} value={routeId}
                            error={errors.routeId}
                            onSelect={(value) => onChange(value, 'routeId')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Person / Shop Name' error={errors.customerName} mandatory />
                        <CustomInput value={customerName} placeholder='Add Location'
                            disabled={disabled} error={errors.customerName}
                            onChange={(value) => onChange(value, 'customerName')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Phone Number' error={errors.mobileNumber} mandatory />
                        <CustomInput maxLength={10} value={mobileNumber} disabled={disabled}
                            placeholder='Phone Number' error={errors.mobileNumber}
                            onBlur={(value) => onBlur(value, 'mobileNumber')}
                            onChange={(value) => onChange(value, 'mobileNumber')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Shop Address' error={errors.address} mandatory />
                        <CustomInput value={address} placeholder='Add Address'
                            disabled={disabled} error={errors.address}
                            onChange={(value) => onChange(value, 'address')}
                        />
                    </div>
                </div>
                <div className='input-container stretch'>
                    <InputLabel name='Driver Name' error={errors.driverId} mandatory />
                    <SelectInput track={track} options={driverOptions} value={driverId}
                        error={errors.driverId}
                        onSelect={(value) => onChange(value, 'driverId')}
                    />
                </div>
                <div className='columns'>
                    <InputLabel name='Stock Details' error={errors.stockDetails} />
                    <div className='columns-container'>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='20 Ltrs' />
                                <CustomInput value={twentyLCans} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'twentyLCans')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='1 Ltrs (Box-1x12)' />
                                <CustomInput value={OneLBoxes} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'OneLBoxes')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='500 Ml (Box-1x12)' />
                                <CustomInput value={fiveHLBoxes} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'fiveHLBoxes')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='250 Ml (Box-1x12)' />
                                <CustomInput value={twofiftyLBoxes} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'twofiftyLBoxes')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default DCForm