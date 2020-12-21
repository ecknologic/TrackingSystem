import React from 'react';
import { Divider, Checkbox } from 'antd';
import InputLabel from '../../../../components/InputLabel';
import CustomInput from '../../../../components/CustomInput';
import InputValue from '../../../../components/InputValue';
import CustomTextArea from '../../../../components/CustomTextArea';

const ArrivedStockForm = (props) => {

    const { data, errors, routeOptions, disabled, onBlur, driverOptions, onChange, track } = props

    const { routeId, damageDesc, mobileNumber, address,
        driverId, cans20L, boxes1L, boxes500ML, boxes250ML } = data

    return (
        <>
            <div className='app-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Delivery Challan Number (DC Number)' />
                        <InputValue size='larger' value='MP-D3491' />
                    </div>
                </div>
                <Divider />
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Location Details' />
                        <InputValue size='smaller' value='429, HMT Sathavahana Nagar Rd, Hmt Sathavahana Nagar, Kukatpally, Hyderabad, Telangana 500072' />
                    </div>
                </div>
                <Divider />
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Vehicle Details' />
                        <InputValue size='smaller' value='TS 19 AG 5465 - DCM Van' />
                    </div>
                </div>
                <Divider />
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Contact Name And Number' />
                        <InputValue size='smaller' value='K.S Rama Rao, 9985752338' />
                    </div>
                </div>
                <Divider />
                <div className='columns'>
                    <InputLabel name='Stock Particulars' />
                    <div className='columns-container'>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='20 Ltrs' />
                                <InputValue size='smaller' value='338' />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='1 Ltrs (Box-1x12)' />
                                <InputValue size='smaller' value='338' />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='500 Ml (Box-1x12)' />
                                <InputValue size='smaller' value='338' />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='250 Ml (Box-1x12)' />
                                <InputValue size='smaller' value='338' />
                            </div>
                        </div>
                    </div>
                </div>
                <Divider />
                <div className='columns'>
                    <InputLabel name='Damaged Particules' />
                    <div className='columns-container'>
                        <Checkbox />
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='20 Ltrs' />
                                <CustomInput value={cans20L} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'cans20L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='1 Ltrs (Box-1x12)' />
                                <CustomInput value={boxes1L} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'boxes1L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='500 Ml (Box-1x12)' />
                                <CustomInput value={boxes500ML} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'boxes500ML')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='250 Ml (Box-1x12)' />
                                <CustomInput value={boxes250ML} disabled={disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'boxes250ML')} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Damaged Details' />
                        <CustomTextArea maxLength={100} error={errors.damageDesc} placeholder='Add Damaged Details' value={damageDesc}
                            minRows={3} maxRows={4} onChange={(value) => onChange(value, 'damageDesc')}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export default ArrivedStockForm