import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import DraggerInput from '../../../components/DraggerInput';
import UploadPreviewer from '../../../components/UploadPreviewer';
import InputValue from '../../../components/InputValue';
import { disableFutureDates } from '../../../utils/Functions';
import CustomDateInput from '../../../components/CustomDateInput';
const DATEFORMAT = 'DD-MM-YYYY'

const MaterialReceivedForm = (props) => {
    const { data, errors, onUpload, onRemove, disabled, onChange, track } = props
    const { receiptImage, receiptNo, invoiceNo, invoiceAmount, invoiceDate, taxAmount,
        itemName, vendorName, itemCode, approvedDate, managerName, itemQty, status } = data

    return (
        <>
            <div className='app-form-container dispatch-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Product Details' />
                        <InputValue size='large' value={itemName} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Quantity' />
                        <InputValue size='large' value={itemQty} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Item Code' />
                        <InputValue size='large' value={itemCode} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Approved Date' />
                        <InputValue size='large' value={dayjs(approvedDate).format(DATEFORMAT)} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Vendor Name' />
                        <InputValue size='large' value={vendorName} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Receipt Number' error={errors.receiptNo} mandatory />
                        <CustomInput value={receiptNo} placeholder='Add Receipt Number'
                            maxLength={10} disabled={disabled} error={errors.receiptNo}
                            onChange={(value) => onChange(value, 'receiptNo')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Add Receipt' error={errors.receiptImage} mandatory />
                        <div className='app-receipt-upload-container'>
                            <DraggerInput onUpload={onUpload} disabled={disabled || receiptImage} />
                            <div className='upload-preview-container'>
                                <UploadPreviewer value={receiptImage} track={track}
                                    title='Receipt' disabled={disabled} onUpload={onUpload}
                                    onRemove={onRemove} className='last' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Invoice No' error={errors.invoiceNo} mandatory />
                        <CustomInput value={invoiceNo} placeholder='Add Invoice Number'
                            disabled={disabled} error={errors.invoiceNo}
                            onChange={(value) => onChange(value, 'invoiceNo')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Invoice Date' error={errors.invoiceDate} mandatory />
                        <CustomDateInput
                            trackplaceholder='Select Date' track disabled={disabled}
                            value={invoiceDate} disabledDate={disableFutureDates}
                            onChange={(value) => onChange(value, 'invoiceDate')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Invoice Amount' error={errors.invoiceAmount} mandatory />
                        <CustomInput value={invoiceAmount} placeholder='Invoice Amount'
                            disabled={disabled} error={errors.invoiceAmount}
                            onChange={(value) => onChange(value, 'invoiceAmount')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Tax Amount' error={errors.taxAmount} mandatory />
                        <CustomInput value={taxAmount} placeholder='Add Tax Amount'
                            disabled={disabled} error={errors.taxAmount}
                            onChange={(value) => onChange(value, 'taxAmount')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Manager Name' error={errors.managerName} mandatory />
                        <CustomInput value={managerName} placeholder='Add Tax Amount'
                            maxLength={20} disabled={disabled} error={errors.managerName}
                            onChange={(value) => onChange(value, 'managerName')}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export default MaterialReceivedForm