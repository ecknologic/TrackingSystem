import React, { useEffect } from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import { resetTrackForm, trackAccountFormOnce } from '../../../utils/Functions';

const ProductForm = ({ data, errors, onChange, onBlur }) => {

    const { productName, price, tax } = data

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    return (
        <div className='app-form-container employee-form-container'>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Product Name' error={errors.productName} mandatory />
                    <CustomInput value={productName}
                        error={errors.productName} placeholder='Product Name'
                        onChange={(value) => onChange(value, 'productName')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name="Unit Price" error={errors.price} mandatory />
                    <CustomInput value={price}
                        error={errors.price} placeholder="Unit Price"
                        onChange={(value) => onChange(value, 'price')}
                        onBlur={(value) => onBlur(value, 'price')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Tax Percentage' error={errors.tax} mandatory />
                    <CustomInput value={tax} maxLength={2}
                        error={errors.tax} placeholder='Tax Percentage'
                        onChange={(value) => onChange(value, 'tax')}
                    />
                </div>
            </div>
        </div>
    )
}
export default ProductForm