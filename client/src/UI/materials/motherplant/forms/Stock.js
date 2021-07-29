import React, { useEffect } from 'react';
import InputLabel from '../../../../components/InputLabel';
import CustomInput from '../../../../components/CustomInput';
import { resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';

const Stock = (props) => {

    const { data, errors, onChange } = props
    const { itemName, itemCode, totalQuantity, reorderLevel } = data

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
                        <InputLabel name='Item Code' error={errors.itemCode} mandatory />
                        <CustomInput value={itemCode} placeholder='Item Code'
                            onChange={(value) => onChange(value, 'itemCode')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Quantity' error={errors.totalQuantity} mandatory />
                        <CustomInput value={totalQuantity}
                            error={errors.totalQuantity} placeholder='Add Quantity' maxLength={10}
                            onChange={(value) => onChange(value, 'totalQuantity')}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export default Stock