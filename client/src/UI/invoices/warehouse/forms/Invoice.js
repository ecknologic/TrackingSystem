import React, { useEffect } from 'react';
import InputLabel from '../../../../components/InputLabel';
import CustomInput from '../../../../components/CustomInput';
import CustomTextArea from '../../../../components/CustomTextArea';
import CustomDateInput from '../../../../components/CustomDateInput';
import { resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';

const InvoiceForm = ({ data, errors, onChange }) => {

    const { customerName, dcNo, poNo, hsnCode, mailSubject, invoiceId, invoiceDate } = data

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    return (
        <div className='app-form-container invoice-form-container'>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Customer Name' error={errors.customerName} mandatory />
                    <CustomInput value={customerName}
                        error={errors.customerName} placeholder='Customer Name'
                        onChange={(value) => onChange(value, 'customerName')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='DC Number' error={errors.dcNo} mandatory />
                    <CustomInput value={dcNo}
                        error={errors.dcNo} placeholder='DC Number'
                        onChange={(value) => onChange(value, 'dcNo')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name="Invoice Number" />
                    <CustomInput value={invoiceId} disabled placeholder="Invoice Number" />
                </div>
                <div className='input-container'>
                    <InputLabel name='Invoice Date' error={errors.invoiceDate} mandatory />
                    <CustomDateInput
                        track
                        value={invoiceDate} error={errors.invoiceDate}
                        onChange={(value) => onChange(value, 'invoiceDate')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='HSN Code' error={errors.hsnCode} mandatory />
                    <CustomInput value={hsnCode}
                        error={errors.hsnCode} placeholder='HSN Code'
                        onChange={(value) => onChange(value, 'hsnCode')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='PO Number' error={errors.poNo} />
                    <CustomInput value={poNo}
                        error={errors.poNo} placeholder='PO Number'
                        onChange={(value) => onChange(value, 'poNo')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container stretch'>
                    <InputLabel name='Subject' error={errors.mailSubject} />
                    <CustomTextArea maxLength={100} error={errors.mailSubject} placeholder='Add Subject' value={mailSubject}
                        maxRows={4} onChange={(value) => onChange(value, 'mailSubject')}
                    />
                </div>
            </div>
        </div>
    )
}
export default InvoiceForm