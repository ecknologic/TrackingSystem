import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import InputLabel from '../../../../components/InputLabel';
import SelectInput from '../../../../components/SelectInput';
import CustomInput from '../../../../components/CustomInput';
import DraggerInput from '../../../../components/DraggerInput';
import CustomTextArea from '../../../../components/CustomTextArea';
import UploadPreviewer from '../../../../components/UploadPreviewer';
import { dayOptions, invoiceOptions, idOptions } from '../../../../assets/fixtures'
import { getIDInputValidationProps, getIdProofName, resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';
const DATEFORMAT = 'DD/MM/YYYY'

const GeneralAccountForm = (props) => {

    const { data, errors, devDays, IDProofs, IDProofErrors, devDaysError, onChange, onBlur, onUpload, onSelect,
        onDeselect, accountOnly, disabled, onRemove, routeOptions, warehouseOptions, locationOptions, agentOptions } = props
    const { Front, Back } = IDProofs

    const {
        gstNo, address, natureOfBussiness, depositAmount, customerName, mobileNumber, registeredDate, pinCode, salesAgent,
        invoicetype, EmailId, idProofType, gstProof, referredBy, routeId, departmentId, deliveryLocation, alternatePhNo,
        creditPeriodInDays, product20L, product2L, price20L, product1L, price2L, price1L, product500ML, price500ML, product300ML, price300ML
    } = data

    const [proofName, setProofName] = useState('')
    const [idProps, setIdProps] = useState({})
    const { maxLength } = idProps

    useEffect(() => {
        setProofName(getIdProofName(idProofType))
        const props = getIDInputValidationProps(idProofType)
        setIdProps(props)
    }, [idProofType])

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    const idUploadDisable = idProofType !== 'panNo' ? Front && Back : Front
    const gstUploadDisable = gstProof

    return (
        <>
            <div className='app-form-container'>
                <div className='app-identity-proof-container identity-proof-container'>
                    <div className='row'>
                        <div className='input-container'>
                            <InputLabel name='Select Id Proof' error={errors.idProofType} />
                            <SelectInput
                                track value={idProofType}
                                options={idOptions} disabled={disabled}
                                error={errors.idProofType}
                                onSelect={(value) => onChange(value, 'idProofType')}
                            />
                        </div>
                        {
                            idProofType && (
                                <div className='input-container'>
                                    <InputLabel name={proofName} error={errors[idProofType]} />
                                    <CustomInput
                                        placeholder={`Add ${proofName}`} uppercase
                                        maxLength={maxLength} value={data[idProofType]}
                                        error={errors[idProofType]} disabled={disabled}
                                        onBlur={(value) => onBlur(value, idProofType)}
                                        onChange={(value) => onChange(value, idProofType)}
                                    />
                                </div>
                            )
                        }
                    </div>
                    <div className='upload-container'>
                        <DraggerInput onUpload={(file) => onUpload(file, 'idProofs')} disabled={idUploadDisable || disabled} />
                        <div className='upload-preview-container'>
                            <UploadPreviewer track value={Front} title='Front' disabled={disabled} onUpload={(file) => onUpload(file, 'Front')} onRemove={() => onRemove('Front')} error={IDProofErrors.Front} />
                            {
                                idProofType !== 'panNo' &&
                                <UploadPreviewer track value={Back} title='Back' disabled={disabled} onUpload={(file) => onUpload(file, 'Back')} onRemove={() => onRemove('Back')} className='last' error={IDProofErrors.Back} />
                            }
                        </div>
                    </div>
                    <div className='upload-instructions'>
                        <span className='title'>Please help us verify your identity</span>
                        <span className='msg'>(Kindly upload the documents either in JPEG, PNG, or PDF format. The file should be less than 5MB) Need to upload front and back.</span>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='GST Number' error={errors.gstNo} />
                        <CustomInput
                            maxLength={15} value={gstNo} uppercase
                            disabled={disabled} placeholder='GST Number' error={errors.gstNo}
                            onChange={(value) => onChange(value, 'gstNo')}
                        />
                    </div>
                    <div className='input-container app-upload-file-container app-gst-upload-container'>
                        <DraggerInput onUpload={(file) => onUpload(file, 'gstProof')} disabled={gstUploadDisable || disabled} />
                        <div className='upload-preview-container'>
                            <UploadPreviewer track value={gstProof} title='GST Proof' disabled={disabled} onUpload={(file) => onUpload(file, 'gstProof')} onRemove={() => onRemove('gstProof')} className='last' error={errors.gstProof} />
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Name' error={errors.customerName} mandatory />
                        <CustomInput
                            value={customerName} disabled={disabled}
                            placeholder='Add Name' error={errors.customerName}
                            onChange={(value) => onChange(value, 'customerName')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Address' error={errors.address} mandatory />
                        <CustomTextArea maxLength={256} disabled={disabled} error={errors.address} placeholder='Add Address'
                            value={address} minRows={1} maxRows={2} onChange={(value) => onChange(value, 'address')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='PIN Code' error={errors.pinCode} mandatory />
                        <CustomInput value={pinCode} placeholder='Add PIN Code'
                            error={errors.pinCode} maxLength={6} onBlur={(value) => onBlur(value, 'pinCode')}
                            onChange={(value) => onChange(value, 'pinCode')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Email' error={errors.EmailId} mandatory />
                        <CustomInput value={EmailId} type='email'
                            disabled={disabled} placeholder='Email'
                            error={errors.EmailId}
                            onBlur={(value) => onBlur(value, 'EmailId')}
                            onChange={(value) => onChange(value, 'EmailId')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Phone Number' error={errors.mobileNumber} mandatory />
                        <CustomInput
                            maxLength={10}
                            value={mobileNumber} placeholder='Phone Number'
                            disabled={disabled} error={errors.mobileNumber}
                            onBlur={(value) => onBlur(value, 'mobileNumber')}
                            onChange={(value) => onChange(value, 'mobileNumber')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Alternate Phone No' error={errors.alternatePhNo} />
                        <CustomInput value={alternatePhNo} placeholder='Alternate Phone Number'
                            error={errors.alternatePhNo} maxLength={15}
                            onChange={(value) => onChange(value, 'alternatePhNo')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Credit Period in Days' error={errors.creditPeriodInDays} mandatory />
                        <CustomInput
                            value={creditPeriodInDays}
                            disabled={disabled} placeholder='Credit Period'
                            error={errors.creditPeriodInDays}
                            onChange={(value) => onChange(value, 'creditPeriodInDays')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Invoice Type' error={errors.invoicetype} mandatory />
                        <SelectInput track value={invoicetype}
                            options={invoiceOptions} disabled={disabled}
                            error={errors.invoicetype} onSelect={(value) => onChange(value, 'invoicetype')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Deposit Amount' error={errors.depositAmount} mandatory />
                        <CustomInput
                            value={depositAmount} disabled={disabled}
                            placeholder='Deposit Amount' onChange={(value) => onChange(value, 'depositAmount')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Nature Of Business' error={errors.natureOfBussiness} />
                        <CustomInput value={natureOfBussiness} disabled error={errors.natureOfBussiness} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Sales & Collection Agent' error={errors.salesAgent} mandatory />
                        <SelectInput
                            value={salesAgent}
                            options={agentOptions}
                            track disabled={disabled}
                            error={errors.salesAgent}
                            onSelect={(value) => onChange(value, 'salesAgent')}
                        />
                    </div>
                </div>
                {
                    !accountOnly && (
                        <>
                            <div className='row'>
                                <div className='input-container'>
                                    <InputLabel name='Delivery Location' error={errors.deliveryLocation} mandatory />
                                    <SelectInput options={locationOptions} showSearch
                                        disabled={disabled} error={errors.deliveryLocation} value={deliveryLocation}
                                        onSelect={(value) => onChange(value, 'deliveryLocation')}
                                    />
                                </div>
                                <div className='input-container'>
                                    <InputLabel name='Delivery Days' error={devDaysError.devDays} mandatory />
                                    <SelectInput track value={devDays} options={dayOptions}
                                        disabled={disabled} mode='multiple' error={devDaysError.devDays}
                                        onSelect={onSelect} onDeselect={onDeselect}
                                    />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='input-container'>
                                    <InputLabel name='Warehouse' error={errors.departmentId} mandatory />
                                    <SelectInput track options={warehouseOptions}
                                        value={departmentId} disabled={disabled}
                                        error={errors.departmentId} onSelect={(value) => onChange(value, 'departmentId')}
                                    />
                                </div>
                                <div className='input-container'>
                                    <InputLabel name='Route' error={errors.routeId} mandatory />
                                    <SelectInput track options={routeOptions}
                                        value={routeId} disabled={disabled}
                                        error={errors.routeId} onSelect={(value) => onChange(value, 'routeId')}
                                    />
                                </div>
                            </div>
                            <div className='columns'>
                                <InputLabel name='Products and Price' error={errors.productNPrice} mandatory />
                                <div className='columns-container'>
                                    <div className='column'>
                                        <div className='input-container'>
                                            <InputLabel name='20 Ltrs' />
                                            <CustomInput value={product20L} disabled={disabled}
                                                placeholder='Qty' onChange={(value) => onChange(value, 'product20L')}
                                            />
                                        </div>
                                        <div className='input-container'>
                                            <InputLabel name='Price' />
                                            <CustomInput value={price20L} disabled={disabled}
                                                placeholder='Rs' onChange={(value) => onChange(value, 'price20L')}
                                                onBlur={(value) => onBlur(value, 'price20L')}
                                            />
                                        </div>
                                    </div>
                                    <div className='column'>
                                        <div className='input-container'>
                                            <InputLabel name='2 Ltrs' />
                                            <CustomInput value={product2L} disabled={disabled}
                                                placeholder='Qty' onChange={(value) => onChange(value, 'product2L')}
                                            />
                                        </div>
                                        <div className='input-container'>
                                            <InputLabel name='Price' />
                                            <CustomInput value={price2L} disabled={disabled}
                                                placeholder='Rs' onChange={(value) => onChange(value, 'price2L')}
                                                onBlur={(value) => onBlur(value, 'price1L')}
                                            />
                                        </div>
                                    </div>
                                    <div className='column'>
                                        <div className='input-container'>
                                            <InputLabel name='1 Ltrs' />
                                            <CustomInput value={product1L} disabled={disabled}
                                                placeholder='Qty' onChange={(value) => onChange(value, 'product1L')}
                                            />
                                        </div>
                                        <div className='input-container'>
                                            <InputLabel name='Price' />
                                            <CustomInput value={price1L} disabled={disabled}
                                                placeholder='Rs' onChange={(value) => onChange(value, 'price1L')}
                                                onBlur={(value) => onBlur(value, 'price1L')}
                                            />
                                        </div>
                                    </div>
                                    <div className='column'>
                                        <div className='input-container'>
                                            <InputLabel name='500 Ml' />
                                            <CustomInput value={product500ML} disabled={disabled}
                                                placeholder='Qty' onChange={(value) => onChange(value, 'product500ML')}
                                            />
                                        </div>
                                        <div className='input-container'>
                                            <InputLabel name='Price' />
                                            <CustomInput value={price500ML} disabled={disabled}
                                                placeholder='Rs' onChange={(value) => onChange(value, 'price500ML')}
                                                onBlur={(value) => onBlur(value, 'price500ML')}
                                            />
                                        </div>
                                    </div>
                                    <div className='column'>
                                        <div className='input-container'>
                                            <InputLabel name='300 Ml' />
                                            <CustomInput value={product300ML} disabled={disabled}
                                                placeholder='Qty' onChange={(value) => onChange(value, 'product300ML')}
                                            />
                                        </div>
                                        <div className='input-container'>
                                            <InputLabel name='Price' />
                                            <CustomInput value={price300ML} disabled={disabled}
                                                placeholder='Rs' onChange={(value) => onChange(value, 'price300ML')}
                                                onBlur={(value) => onBlur(value, 'price300ML')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Registered Date' error={errors.registeredDate} />
                        <CustomInput value={dayjs(registeredDate).format(DATEFORMAT)} placeholder='Registered Date' disabled />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Referred By' error={errors.referredBy} />
                        <CustomInput value={referredBy} disabled={disabled}
                            placeholder='Referral Name' error={errors.referredBy}
                            onChange={(value) => onChange(value, 'referredBy')}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default GeneralAccountForm