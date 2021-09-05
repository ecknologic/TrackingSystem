import React, { useEffect } from 'react';
import { Divider, Checkbox } from 'antd';
import InputLabel from '../../../../components/InputLabel';
import CustomInput from '../../../../components/CustomInput';
import InputValue from '../../../../components/InputValue';
import CustomTextArea from '../../../../components/CustomTextArea';
import { renderProductDetailsJSX, resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';

const ArrivedStockForm = (props) => {

    const { data, errors = {}, disabled, onChange, viewOnly } = props

    const { dcNo = '', damagedDesc, address = '', isDamaged, driverName = '', mobileNumber = '', vehicleNo = '', vehicleType = '', departmentName, managerName,
        damaged20LCans, damaged2LBoxes, damaged1LBoxes, damaged500MLBoxes, damaged300MLBoxes, ...rest } = data
    const { product20L, product2L, product1L, product300ML, product500ML } = rest

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    const location = `${departmentName}, ${address}`
    return (
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
                    <InputLabel name='Address' />
                    <InputValue size='smaller' value={location} />
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
                <div className='input-container'>
                    <InputLabel name='Manager' />
                    <InputValue size='larger' value={managerName} />
                </div>
            </div>
            <Divider />
            {renderProductDetailsJSX(rest)}
            <Divider />
            <div className='columns'>
                <InputLabel name='Damaged Particulars' error={errors.damaged} />
                <div className='columns-container'>
                    {!viewOnly && <Checkbox onChange={({ target: { checked } }) => onChange(checked, 'isDamaged')} checked={isDamaged} />}
                    {
                        (viewOnly && Number(product20L))
                            ? (
                                <div className='column'>
                                    <div className='input-container'>
                                        <InputLabel name='20 Ltrs' />
                                        <InputValue size='smaller' value={damaged20LCans} />
                                    </div>
                                </div>
                            ) : null
                    }
                    {
                        !viewOnly && (
                            <div className='column'>
                                <div className='input-container'>
                                    <InputLabel name='20 Ltrs' />
                                    <CustomInput value={damaged20LCans} disabled={!isDamaged || disabled}
                                        placeholder='Qty' onChange={(value) => onChange(value, 'damaged20LCans')} />
                                </div>
                            </div>
                        )
                    }
                    {
                        (viewOnly && Number(product2L))
                            ? (
                                <div className='column'>
                                    <div className='input-container'>
                                        <InputLabel name='2 Ltrs (Box-1&times;9)' />
                                        <InputValue size='smaller' value={damaged2LBoxes} />
                                    </div>
                                </div>
                            ) : null
                    }
                    {
                        !viewOnly && (
                            <div className='column'>
                                <div className='input-container'>
                                    <InputLabel name='2 Ltrs (Box-1&times;9)' />
                                    <CustomInput value={damaged2LBoxes} disabled={!isDamaged || disabled}
                                        placeholder='Qty' onChange={(value) => onChange(value, 'damaged2LBoxes')} />
                                </div>
                            </div>
                        )
                    }
                    {
                        (viewOnly && Number(product1L))
                            ? (
                                <div className='column'>
                                    <div className='input-container'>
                                        <InputLabel name='1 Ltrs (Box-1&times;12)' />
                                        <InputValue size='smaller' value={damaged1LBoxes} />
                                    </div>
                                </div>
                            ) : null
                    }
                    {
                        !viewOnly && (
                            <div className='column'>
                                <div className='input-container'>
                                    <InputLabel name='1 Ltrs (Box-1&times;12)' />
                                    <CustomInput value={damaged1LBoxes} disabled={!isDamaged || disabled}
                                        placeholder='Qty' onChange={(value) => onChange(value, 'damaged1LBoxes')} />
                                </div>
                            </div>
                        )
                    }
                    {
                        (viewOnly && Number(product500ML))
                            ? (
                                <div className='column'>
                                    <div className='input-container'>
                                        <InputLabel name='500 Ml (Box-1&times;24)' />
                                        <InputValue size='smaller' value={damaged500MLBoxes} />
                                    </div>
                                </div>
                            ) : null
                    }
                    {
                        !viewOnly && (
                            <div className='column'>
                                <div className='input-container'>
                                    <InputLabel name='500 Ml (Box-1&times;24)' />
                                    <CustomInput value={damaged500MLBoxes} disabled={!isDamaged || disabled}
                                        placeholder='Qty' onChange={(value) => onChange(value, 'damaged500MLBoxes')} />
                                </div>
                            </div>
                        )
                    }
                    {
                        (viewOnly && Number(product300ML))
                            ? (
                                <div className='column'>
                                    <div className='input-container'>
                                        <InputLabel name='300 Ml (Box-1&times;30)' />
                                        <InputValue size='smaller' value={damaged300MLBoxes} />
                                    </div>
                                </div>
                            ) : null
                    }
                    {
                        !viewOnly && (
                            <div className='column'>
                                <div className='input-container'>
                                    <InputLabel name='300 Ml (Box-1&times;30)' />
                                    <CustomInput value={damaged300MLBoxes} disabled={!isDamaged || disabled}
                                        placeholder='Qty' onChange={(value) => onChange(value, 'damaged300MLBoxes')} />
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <div className='row'>
                <div className='input-container stretch'>
                    <InputLabel name='Damaged Details' error={errors.damagedDesc} />
                    {
                        viewOnly ? <InputValue size='smaller' value={damagedDesc || '--'} />
                            : <CustomTextArea disabled={!isDamaged || disabled} maxLength={1000} error={errors.damagedDesc} placeholder='Add Damaged Details' value={damagedDesc}
                                minRows={3} maxRows={5} onChange={(value) => onChange(value, 'damagedDesc')}
                            />
                    }
                </div>
            </div>
        </div>
    )
}
export default ArrivedStockForm