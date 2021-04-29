import React, { useEffect } from 'react';
import { TODAYDATE } from '../../../../utils/constants';
import InputLabel from '../../../../components/InputLabel';
import CustomInput from '../../../../components/CustomInput';
import { resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';
import CustomDateInput from '../../../../components/CustomDateInput';

const DamagedStock = (props) => {

    const { data, errors, disabled, onChange, onBlur } = props
    const { itemName, TDS, itemCode, itemQty, managerName } = data

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
                        <InputLabel name='Quantity' error={errors.itemName} mandatory />
                        <CustomInput
                            error={errors.itemQty} placeholder='Add Quantity'
                            onChange={(value) => onChange(value, 'itemQty')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Date' />
                        <CustomDateInput value={TODAYDATE} disabled />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Manager Name' />
                        <CustomInput value={managerName} placeholder='Add Manager Name' disabled />
                    </div>
                </div>
            </div>
        </>
    )
}
export default DamagedStock