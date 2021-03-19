import React, { useEffect } from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import { resetTrackForm, trackAccountFormOnce } from '../../../utils/Functions';

const ProductForm = ({ data, errors, onChange }) => {

    const { RoleLabel } = data

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
                    <InputLabel name='Role Label' error={errors.RoleLabel} mandatory />
                    <CustomInput value={RoleLabel}
                        error={errors.RoleLabel} placeholder='Role Label'
                        onChange={(value) => onChange(value, 'RoleLabel')}
                    />
                </div>
            </div>
        </div>
    )
}
export default ProductForm