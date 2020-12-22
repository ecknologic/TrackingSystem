import React from 'react';
import { Divider, Checkbox } from 'antd';
import InputLabel from '../../../../components/InputLabel';
import CustomInput from '../../../../components/CustomInput';
import InputValue from '../../../../components/InputValue';
import CustomTextArea from '../../../../components/CustomTextArea';

const ArrivedStockForm = (props) => {

    const { data, errors, disabled, onChange } = props

    const { dcNo = '', damagedDesc, address = '', isDamaged, driverName = '', mobileNumber = '', vehicleNo = '', vehicleType = '',
        damaged20Lcans, damaged1LBoxes, damaged500MLBoxes, damaged250MLBoxes, total20LCans, total1LBoxes, total250MLBoxes, total500MLBoxes } = data

    return (
        <>
            <div className='app-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Delivery Challan Number (DC Number)' />
                        <InputValue size='larger' value={dcNo} />
                    </div>
                </div>
                <Divider />
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Location Details' />
                        <InputValue size='smaller' value={address} />
                    </div>
                </div>
                <Divider />
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Vehicle Details' />
                        <InputValue size='smaller' value={`${vehicleNo} - ${vehicleType}`} />
                    </div>
                </div>
                <Divider />
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Contact Name And Number' />
                        <InputValue size='smaller' value={`${driverName}, ${mobileNumber}`} />
                    </div>
                </div>
                <Divider />
                <div className='columns'>
                    <InputLabel name='Stock Particulars' />
                    <div className='columns-container'>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='20 Ltrs' />
                                <InputValue size='smaller' value={total20LCans} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='1 Ltrs (Box-1x12)' />
                                <InputValue size='smaller' value={total1LBoxes} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='500 Ml (Box-1x12)' />
                                <InputValue size='smaller' value={total250MLBoxes} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='250 Ml (Box-1x12)' />
                                <InputValue size='smaller' value={total500MLBoxes} />
                            </div>
                        </div>
                    </div>
                </div>
                <Divider />
                <div className='columns'>
                    <InputLabel name='Damaged Particules' />
                    <div className='columns-container'>
                        <Checkbox onChange={({ target: { checked } }) => onChange(checked, 'isDamaged')} />
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='20 Ltrs' />
                                <CustomInput value={damaged20Lcans} disabled={!isDamaged || disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'damaged20Lcans')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='1 Ltrs (Box-1x12)' />
                                <CustomInput value={damaged1LBoxes} disabled={!isDamaged || disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'damaged1LBoxes')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='500 Ml (Box-1x12)' />
                                <CustomInput value={damaged500MLBoxes} disabled={!isDamaged || disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'damaged500MLBoxes')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='250 Ml (Box-1x12)' />
                                <CustomInput value={damaged250MLBoxes} disabled={!isDamaged || disabled}
                                    placeholder='Add' onChange={(value) => onChange(value, 'damaged250MLBoxes')} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Damaged Details' />
                        <CustomTextArea disabled={!isDamaged || disabled} maxLength={1000} error={errors.damagedDesc} placeholder='Add Damaged Details' value={damagedDesc}
                            minRows={3} maxRows={10} onChange={(value) => onChange(value, 'damagedDesc')}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export default ArrivedStockForm