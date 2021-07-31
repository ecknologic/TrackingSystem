import React, { useEffect } from 'react';
import InputLabel from '../../../../components/InputLabel';
import CustomInput from '../../../../components/CustomInput';
import { resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';

const CurrentStock = (props) => {

    const { data, errors, onChange, onBlur } = props
    const { itemName, itemCode, totalQuantity, reorderLevel, damagedCount } = data

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
                        <InputLabel name='Current Quantity' error={errors.totalQuantity} mandatory />
                        <CustomInput value={totalQuantity}
                            error={errors.totalQuantity} placeholder='Add Current Quantity'
                            onBlur={(value) => onBlur(value, 'totalQuantity')} maxLength={10}
                            onChange={(value) => onChange(value, 'totalQuantity')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Reorder Level' error={errors.reorderLevel} />
                        <CustomInput value={reorderLevel} placeholder='Reorder Level' disabled />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Damaged' error={errors.damagedCount} />
                        <CustomInput value={damagedCount} placeholder='Damaged' disabled />
                    </div>
                </div>
            </div>
        </>
    )
}
export default CurrentStock