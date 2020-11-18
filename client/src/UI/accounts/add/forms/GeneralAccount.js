import { Input, InputNumber } from 'antd';
import React, { useEffect, useState } from 'react';
import { getIDInputValidationProps, getIdProofName } from '../../../../utils/Functions';
import SelectInput from '../../../../components/SelectInput';
import DraggerInput from '../../../../components/DraggerInput';
import InputWithAddon from '../../../../components/InputWithAddon';
import UploadPreviewer from '../../../../components/UploadPreviewer';
import { dayOptions, invoiceOptions, idOptions, businessOptions } from '../../../../assets/fixtures'
import InputLabel from '../../../../components/InputLabel';

const GeneralAccountForm = (props) => {

    const { data, devDays, IDProofs, onChange, onUpload, onSelect, IDErrors,
        onDeselect, accountOnly, disabled, onRemove, routeOptions, track } = props
    const { Front, Back } = IDProofs

    const {
        gstNo, address, natureOfBussiness, depositAmount, customerName, mobileNumber, registeredDate,
        invoicetype, EmailId, idProofType, gstProof, referredBy, routingId, deliveryLocation,
        product20L, price20L, product1L, price1L, product500ML, price500ML,
        // product250ML,price250ML
    } = data

    const [proofName, setProofName] = useState('')
    const [idProps, setIdProps] = useState({})
    const { maxLength } = idProps

    useEffect(() => {
        setProofName(getIdProofName(idProofType))
        const props = getIDInputValidationProps(idProofType)
        setIdProps(props)
    }, [idProofType])

    const idUploadDisable = Front && Back
    const gstUploadDisable = gstProof

    return (
        <>
            <div className='app-form-container form-container'>
                <div className='app-identity-proof-container identity-proof-container'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Select Id Proof</label>
                        <SelectInput track={track} value={idProofType} options={idOptions} disabled={disabled} onSelect={(value) => onChange(value, 'idProofType')} />
                    </div>
                    {
                        idProofType && (
                            <div className='input-container second'>
                                <InputLabel name={proofName} error={IDErrors[idProofType]} />
                                <Input maxLength={maxLength} size='large' value={data[idProofType]} placeholder={`Add ${proofName}`} className={`app-id-input ${IDErrors[idProofType] ? 'app-input-error' : ''}`} disabled={disabled} onChange={({ target: { value } }) => onChange(value, idProofType)} />
                            </div>
                        )
                    }
                    <div className='upload-container'>
                        <DraggerInput onUpload={(file) => onUpload(file, 'idProofs')} disabled={idUploadDisable || disabled} />
                        <div className='upload-preview-container'>
                            <UploadPreviewer value={Front} title='Front' disabled={disabled} onRemove={() => onRemove('Front')} />
                            <UploadPreviewer value={Back} title='Back' disabled={disabled} onRemove={() => onRemove('Back')} className='last' />
                        </div>
                    </div>
                    <div className='upload-instructions'>
                        <span className='title'>Please help us verify your identity</span>
                        <span className='msg'>(Kindly upload the documents either in JPEG, PNG, or PDF format. The file should be less than 5MB) Need to upload front and back.</span>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='GST Number' />
                        <InputWithAddon value={gstNo} label='VERIFY' disabled={disabled} placeholder='GST Number' onChange={({ target: { value } }) => onChange(value, 'gstNo')} />
                    </div>
                    <div className='input-container app-upload-file-container app-gst-upload-container'>
                        <DraggerInput onUpload={(file) => onUpload(file, 'gstProof')} disabled={gstUploadDisable || disabled} />
                        <div className='upload-preview-container'>
                            <UploadPreviewer value={gstProof} title='GST Proof' disabled={disabled} onRemove={() => onRemove('gstProof')} className='last' />
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Name' />
                        <Input value={customerName} size='large' placeholder='Add Name' disabled={disabled} onChange={({ target: { value } }) => onChange(value, 'customerName')} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Address' />
                        <Input value={address} size='large' placeholder='Add Address' disabled={disabled} onChange={({ target: { value } }) => onChange(value, 'address')} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Phone Number' />
                        <InputNumber size="large" value={mobileNumber} disabled={disabled} placeholder='Phone Number' onChange={(value) => onChange(value, 'mobileNumber')} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Email' />
                        <Input size='large' value={EmailId} type='email' disabled={disabled} placeholder='Email' onChange={({ target: { value } }) => onChange(value, 'EmailId')} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Registered Date' />
                        <Input size='large' value={registeredDate} placeholder='Registered Date' disabled />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Nature Of Business' />
                        <SelectInput track={track} value={natureOfBussiness} disabled={disabled} options={businessOptions} onSelect={(value) => onChange(value, 'natureOfBussiness')} />
                    </div>
                </div>
                {
                    !accountOnly && (
                        <>
                            <div className='row'>
                                <div className='input-container'>
                                    <InputLabel name='Deposit Amount' />
                                    <InputNumber size="large" value={depositAmount} disabled={disabled} placeholder='Deposit Amount' onChange={(value) => onChange(value, 'depositAmount')} />
                                </div>
                                <div className='input-container'>
                                    <InputLabel name='Delivery Days' />
                                    <SelectInput track={track} value={devDays} options={dayOptions} disabled={disabled} mode='multiple' onSelect={onSelect} onDeselect={onDeselect} />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='input-container'>
                                    <InputLabel name='Delivery Location' />
                                    <Input size='large' value={deliveryLocation} placeholder='Add Location' disabled={disabled} onChange={({ target: { value } }) => onChange(value, 'deliveryLocation')} />
                                </div>
                                <div className='input-container'>
                                    <InputLabel name='Route' />
                                    <SelectInput track={track} options={routeOptions} value={routingId} disabled={disabled} onSelect={(value) => onChange(value, 'routingId')} />
                                </div>
                            </div>
                            <div className='columns'>
                                <InputLabel name='Products and Price' />
                                <div className='columns-container'>
                                    <div className='column'>
                                        <div className='input-container'>
                                            <InputLabel name='20 Ltrs' />
                                            <InputNumber size="large" value={product20L} disabled={disabled} placeholder='Add' onChange={(value) => onChange(value, 'product20L')} />
                                        </div>
                                        <div className='input-container'>
                                            <InputLabel name='Price' />
                                            <InputNumber size="large" value={price20L} disabled={disabled} placeholder='Rs' onChange={(value) => onChange(value, 'price20L')} />
                                        </div>
                                    </div>
                                    <div className='column'>
                                        <div className='input-container'>
                                            <InputLabel name='1 Ltrs' />
                                            <InputNumber size="large" value={product1L} disabled={disabled} placeholder='Add' onChange={(value) => onChange(value, 'product1L')} />
                                        </div>
                                        <div className='input-container'>
                                            <InputLabel name='Price' />
                                            <InputNumber size="large" value={price1L} disabled={disabled} placeholder='Rs' onChange={(value) => onChange(value, 'price1L')} />
                                        </div>
                                    </div>
                                    <div className='column'>
                                        <div className='input-container'>
                                            <InputLabel name='500 Ml' />
                                            <InputNumber size="large" value={product500ML} disabled={disabled} placeholder='Add' onChange={(value) => onChange(value, 'product500ML')} />
                                        </div>
                                        <div className='input-container'>
                                            <InputLabel name='Price' />
                                            <InputNumber size="large" value={price500ML} disabled={disabled} placeholder='Rs' onChange={(value) => onChange(value, 'price500ML')} />
                                        </div>
                                    </div>
                                    {/* <div className='column'>
                                        <div className='input-container'>
                                            <InputLabel name='250 Ml'  />
                                            <InputNumber size="large" value={product250ML} disabled={disabled}  placeholder='Add' onChange={(value) => onChange(value, 'product250ML')}   />
                                        </div>
                                        <div className='input-container'>
                                            <InputLabel name='Price'  />
                                            <InputNumber size="large" value={price250ML} disabled={disabled}  placeholder='Rs' onChange={(value) => onChange(value, 'price250ML')}   />
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </>
                    )
                }
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Invoice Type' />
                        <SelectInput track={track} value={invoicetype} options={invoiceOptions} disabled={disabled} onSelect={(value) => onChange(value, 'invoicetype')} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Referred By' />
                        <Input size='large' value={referredBy} disabled={disabled} placeholder='Referral Name' onChange={({ target: { value } }) => onChange(value, 'referredBy')} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default GeneralAccountForm