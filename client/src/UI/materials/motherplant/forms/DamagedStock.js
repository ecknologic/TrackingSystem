import React, { useEffect } from 'react';
import { TODAYDATE } from '../../../../utils/constants';
import InputLabel from '../../../../components/InputLabel';
import CustomInput from '../../../../components/CustomInput';
import { resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';
import CustomDateInput from '../../../../components/CustomDateInput';

const DamagedStock = (props) => {

    const { data, errors, onChange, onBlur } = props
    const { itemName, itemCode, damagedCount } = data

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    return (
        <>
            <div className='app-form-container batch-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Product Name' error={errors.itemName} />
                        <CustomInput value={itemName} placeholder='Product Name' disabled />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Item Code' error={errors.itemCode} />
                        <CustomInput value={itemCode} placeholder='Item Code' disabled />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Damaged Qty' error={errors.damagedCount} mandatory />
                        <CustomInput value={damagedCount}
                            error={errors.damagedCount} placeholder='Add Qty'
                            onBlur={(value) => onBlur(value, 'damagedCount')} maxLength={10}
                            onChange={(value) => onChange(value, 'damagedCount')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Date' />
                        <CustomDateInput value={TODAYDATE} disabled />
                    </div>
                </div>
            </div>
        </>
    )
}
export default DamagedStock