import React, { useEffect } from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import { resetTrackForm, trackAccountFormOnce } from '../../../utils/Functions';

const ProductForm = ({ data, errors, onChange }) => {

    const { productName, price } = data

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
                    />
                </div>
            </div>
        </div>
    )
}
export default ProductForm