import React from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import SelectInput from '../../../components/SelectInput';
import CustomTextArea from '../../../components/CustomTextArea';
import DraggerInput from '../../../components/DraggerInput';
import UploadPreviewer from '../../../components/UploadPreviewer';

const MaterialReceivedForm = (props) => {

    const { data, errors, batchIdOptions, onUpload, onRemove, disabled,
        onChange, onBlur, track } = props

    const { itemName, itemCode, gstProof, description, recordLevel, minOrderLevel } = data
    return (
        <>
            <div className='app-form-container dispatch-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Item Name' error={errors.itemName} mandatory />
                        <SelectInput track={track} value={itemName} options={batchIdOptions}
                            disabled={disabled} error={errors.itemName}
                            onSelect={(value) => onChange(value, 'itemName')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Received Numbers' error={errors.itemCode} mandatory />
                        <CustomInput value={itemCode} placeholder='Add Received Numbers'
                            maxLength={10} disabled={disabled} error={errors.itemCode}
                            onBlur={(value) => onBlur(value, 'itemCode')}
                            onChange={(value) => onChange(value, 'itemCode')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Add Receipt' error={errors.itemCode} mandatory />
                        <DraggerInput onUpload={(file) => onUpload(file, 'gstProof')} disabled={disabled} />
                        {/* <div className='upload-preview-container'>
                            <UploadPreviewer track={track} value={gstProof} title='GST Proof' disabled={disabled} onUpload={(file) => onUpload(file, 'gstProof')} onRemove={() => onRemove('gstProof')} className='last' error={errors.gstProof} />
                        </div> */}
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Invoice No' error={errors.recordLevel} mandatory />
                        <CustomInput value={recordLevel} placeholder='Add Invoice Number'
                            maxLength={20} disabled={disabled} error={errors.recordLevel}
                            onChange={(value) => onChange(value, 'recordLevel')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Invoice Date' error={errors.minOrderLevel} mandatory />
                        <CustomInput value={minOrderLevel} placeholder='Add Invoice Date'
                            maxLength={20} disabled={disabled} error={errors.minOrderLevel}
                            onChange={(value) => onChange(value, 'minOrderLevel')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Invoice Amount' error={errors.description} mandatory />
                        <CustomInput value={minOrderLevel} placeholder='Invoice Amount'
                            maxLength={20} disabled={disabled} error={errors.minOrderLevel}
                            onChange={(value) => onChange(value, 'minOrderLevel')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Tax Amount' error={errors.description} mandatory />
                        <CustomInput value={minOrderLevel} placeholder='Add Tax Amount'
                            maxLength={20} disabled={disabled} error={errors.minOrderLevel}
                            onChange={(value) => onChange(value, 'minOrderLevel')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Manager Name' error={errors.description} mandatory />
                        <CustomTextArea maxLength={100} error={errors.description} placeholder='Add Description' value={description}
                            maxRows={4} onChange={(value) => onChange(value, 'description')}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export default MaterialReceivedForm