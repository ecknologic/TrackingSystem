import React from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import SelectInput from '../../../components/SelectInput';
import CustomTextArea from '../../../components/CustomTextArea';

const MaterialRequestForm = (props) => {

    const { data, errors, disabled, onChange, onBlur, track, materialOptions, vendorOptions } = props
    const { itemName, itemCode, vendorName, description, reorderLevel, minOrderLevel } = data

    return (
        <>
            <div className='app-form-container dispatch-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Item Name' error={errors.itemName} mandatory />
                        <SelectInput track={track} value={itemName} options={materialOptions}
                            disabled={disabled} error={errors.itemName}
                            onSelect={(value) => onChange(value, 'itemName')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Item Code' error={errors.itemCode} mandatory />
                        <CustomInput value={itemCode} placeholder='Add Item Code'
                            maxLength={10} disabled={disabled} error={errors.itemCode}
                            onBlur={(value) => onBlur(value, 'itemCode')}
                            onChange={(value) => onChange(value, 'itemCode')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Reorder Level' error={errors.reorderLevel} mandatory />
                        <CustomInput value={reorderLevel} placeholder='Add Reorder Level'
                            maxLength={20} disabled={disabled} error={errors.reorderLevel}
                            onBlur={(value) => onBlur(value, 'reorderLevel')}
                            onChange={(value) => onChange(value, 'reorderLevel')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Minimum Order Level' error={errors.minOrderLevel} mandatory />
                        <CustomInput value={minOrderLevel} placeholder='Add Minimum Order Level'
                            maxLength={20} disabled={disabled} error={errors.minOrderLevel}
                            onBlur={(value) => onBlur(value, 'minOrderLevel')}
                            onChange={(value) => onChange(value, 'minOrderLevel')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Vendor' error={errors.vendorName} mandatory />
                        <SelectInput track={track} value={vendorName} options={vendorOptions}
                            disabled={disabled} error={errors.vendorName}
                            onSelect={(value) => onChange(value, 'vendorName')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Description Of Item' error={errors.description} mandatory />
                        <CustomTextArea maxLength={100} error={errors.description} placeholder='Add Description' value={description}
                            maxRows={4} onChange={(value) => onChange(value, 'description')}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export default MaterialRequestForm