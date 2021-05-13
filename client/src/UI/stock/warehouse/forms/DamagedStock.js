import React, { useEffect } from 'react';
import InputLabel from '../../../../components/InputLabel';
import CustomInput from '../../../../components/CustomInput';
import CustomTextArea from '../../../../components/CustomTextArea';
import { resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';

const DamagedStockForm = (props) => {

    const { data, errors, onChange } = props
    const { damaged20LCans, damaged2LBoxes, damaged1LBoxes, damaged500MLBoxes, damaged300MLBoxes, details } = data


    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    return (
        <div className='app-form-container'>
            <div className='columns'>
                <InputLabel name='Damaged Particulars' mandatory error={errors.damaged} />
                <div className='columns-container'>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='20 Ltrs' />
                            <CustomInput value={damaged20LCans}
                                placeholder='Qty' onChange={(value) => onChange(value, 'damaged20LCans')} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='2 Ltrs (Box-1&times;12)' />
                            <CustomInput value={damaged2LBoxes}
                                placeholder='Qty' onChange={(value) => onChange(value, 'damaged2LBoxes')} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='1 Ltrs (Box-1&times;12)' />
                            <CustomInput value={damaged1LBoxes}
                                placeholder='Qty' onChange={(value) => onChange(value, 'damaged1LBoxes')} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='500 Ml (Box-1&times;12)' />
                            <CustomInput value={damaged500MLBoxes}
                                placeholder='Qty' onChange={(value) => onChange(value, 'damaged500MLBoxes')} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='300 Ml (Box-1&times;12)' />
                            <CustomInput value={damaged300MLBoxes}
                                placeholder='Qty' onChange={(value) => onChange(value, 'damaged300MLBoxes')} />
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Details' error={errors.details} mandatory />
                        <CustomTextArea maxLength={1000} error={errors.details} placeholder='Add Details' value={details}
                            minRows={3} maxRows={5} onChange={(value) => onChange(value, 'details')}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default DamagedStockForm