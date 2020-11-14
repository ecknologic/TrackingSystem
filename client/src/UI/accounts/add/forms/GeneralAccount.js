import { Input } from 'antd';
import React, { useEffect, useState } from 'react';
import DraggerInput from '../../../../components/DraggerInput';
import SelectInput from '../../../../components/SelectInput';
import InputWithAddon from '../../../../components/InputWithAddon';
import UploadPreviewer from '../../../../components/UploadPreviewer';
import { dayOptions, invoiceOptions, idOptions } from '../../../../assets/fixtures'
import { getIdProofName } from '../../../../utils/Functions';

const GeneralAccountForm = (props) => {
    const { data, devDays, IDProofs, onChange, onUpload, onSelect,
        onDeselect, accountOnly, disabled, onRemove } = props
    const { Front, Back } = IDProofs

    const {
        gstNo, address, depositAmount, customerName, mobileNumber, registeredDate,
        invoicetype, EmailId, contactPerson, idProofType, gstProof, referredBy,
        product20L, price20L, product1L, price1L, product500ML, price500ML
    } = data

    const [proofName, setProofName] = useState('')

    useEffect(() => {
        setProofName(getIdProofName(idProofType))
    }, [idProofType])

    const idUploadDisable = Front && Back
    const gstUploadDisable = gstProof

    return (
        <>
            <div className='app-form-container form-container'>
                <div className='app-identity-proof-container identity-proof-container'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Select Id Proof</label>
                        <SelectInput value={idProofType} options={idOptions} disabled={disabled} onSelect={(value) => onChange(value, 'idProofType')} />
                    </div>
                    {
                        idProofType && (
                            <div className='input-container second'>
                                <label className='app-input-label-name'>{proofName}</label>
                                <Input size='large' value={data[idProofType]} disabled={disabled} placeholder={`Add ${proofName}`} onChange={({ target: { value } }) => onChange(value, idProofType)} />
                            </div>
                        )
                    }
                    <div className='upload-container'>
                        <DraggerInput onUpload={(file) => onUpload(file, 'idProofs')} disabled={idUploadDisable || disabled} />
                        <div className='upload-preview-container'>
                            <UploadPreviewer value={Front} title='Front' disabled={disabled} onRemove={() => onRemove('Front')} />
                            <UploadPreviewer value={Back} title='Back' disabled={disabled} onRemove={() => onRemove('Back')} />
                        </div>
                    </div>
                    <div className='upload-instructions'>
                        <span className='title'>Please help us verify your identity</span>
                        <span className='msg'>(Kindly upload the documents either in JPEG, PNG, or PDF format. The file should be less than 5MB) Need to upload front and back.</span>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>GST Number</label>
                        <InputWithAddon value={gstNo} label='VERIFY' disabled={disabled} placeholder='GST Number' onChange={({ target: { value } }) => onChange(value, 'gstNo')} />
                    </div>
                    <div className='input-container app-upload-file-container'>
                        <DraggerInput onUpload={(file) => onUpload(file, 'gstProof')} disabled={gstUploadDisable || disabled} />
                        <div className='upload-preview-container'>
                            <UploadPreviewer value={gstProof} title='GST Proof' disabled={disabled} onRemove={() => onRemove('gstProof')} />
                        </div>
                    </div>

                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Name</label>
                        <Input value={customerName} size='large' placeholder='Add Name' disabled={disabled} onChange={({ target: { value } }) => onChange(value, 'customerName')} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <label className='app-input-label-name'>Address</label>
                        <Input value={address} size='large' placeholder='Add Address' disabled={disabled} onChange={({ target: { value } }) => onChange(value, 'address')} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Phone Number</label>
                        <Input size='large' value={mobileNumber} type='number' disabled={disabled} placeholder='Phone Number' onChange={({ target: { value } }) => onChange(value, 'mobileNumber')} />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Email</label>
                        <Input size='large' value={EmailId} type='email' disabled={disabled} placeholder='Email' onChange={({ target: { value } }) => onChange(value, 'EmailId')} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Registered Date</label>
                        <Input size='large' value={registeredDate} type='date' placeholder='Registered Date' disabled />
                    </div>
                    <div className='input-container'>
                        <label className='app-input-label-name'>Referred By</label>
                        <Input size='large' value={referredBy} disabled={disabled} placeholder='Referral Name' onChange={({ target: { value } }) => onChange(value, 'referredBy')} />
                    </div>
                </div>
                {
                    !accountOnly && (
                        <>
                            <div className='row'>
                                <div className='input-container'>
                                    <label className='app-input-label-name'>Deposit Amount</label>
                                    <Input size='large' value={depositAmount} type='number' placeholder='Deposit Amount' onChange={({ target: { value } }) => onChange(value, 'depositAmount')} />
                                </div>
                                <div className='input-container'>
                                    <label className='app-input-label-name'>Delivery Days</label>
                                    <SelectInput value={devDays} options={dayOptions} mode='multiple' onSelect={onSelect} onDeselect={onDeselect} />
                                </div>
                            </div>
                            <div className='columns'>
                                <label className='app-input-label-name'>Products and Price</label>
                                <div className='columns-container'>
                                    <div className='column'>
                                        <div className='input-container'>
                                            <label className='app-input-label-name'>20 Ltrs</label>
                                            <Input size='large' value={product20L} placeholder='Add' onChange={({ target: { value } }) => onChange(value, 'product20L')} />
                                        </div>
                                        <div className='input-container'>
                                            <label className='app-input-label-name'>Price</label>
                                            <Input size='large' value={price20L} placeholder='Rs' onChange={({ target: { value } }) => onChange(value, 'price20L')} />
                                        </div>
                                    </div>
                                    <div className='column'>
                                        <div className='input-container'>
                                            <label className='app-input-label-name'>1 Ltrs</label>
                                            <Input size='large' value={product1L} placeholder='Add' onChange={({ target: { value } }) => onChange(value, 'product1L')} />
                                        </div>
                                        <div className='input-container'>
                                            <label className='app-input-label-name'>Price</label>
                                            <Input size='large' value={price1L} placeholder='Rs' onChange={({ target: { value } }) => onChange(value, 'price1L')} />
                                        </div>
                                    </div>
                                    <div className='column'>
                                        <div className='input-container'>
                                            <label className='app-input-label-name'>500 Ml</label>
                                            <Input size='large' value={product500ML} placeholder='Add' onChange={({ target: { value } }) => onChange(value, 'product500ML')} />
                                        </div>
                                        <div className='input-container'>
                                            <label className='app-input-label-name'>Price</label>
                                            <Input size='large' value={price500ML} placeholder='Rs' onChange={({ target: { value } }) => onChange(value, 'price500ML')} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
                <div className='row'>
                    {
                        !accountOnly && (
                            <div className='input-container'>
                                <label className='app-input-label-name'>Contact Person</label>
                                <Input size='large' value={contactPerson} placeholder='Add Name' onChange={({ target: { value } }) => onChange(value, 'contactPerson')} />
                            </div>
                        )
                    }
                    <div className='input-container'>
                        <label className='app-input-label-name'>Invoice Type</label>
                        <SelectInput value={invoicetype} options={invoiceOptions} disabled={disabled} onSelect={(value) => onChange(value, 'invoicetype')} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default GeneralAccountForm