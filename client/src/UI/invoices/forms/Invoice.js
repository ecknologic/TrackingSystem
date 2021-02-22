import React, { useEffect } from 'react';
import InputLabel from '../../../components/InputLabel';
import { genderOptions } from '../../../assets/fixtures';
import CustomInput from '../../../components/CustomInput';
import SelectInput from '../../../components/SelectInput';
import CustomTextArea from '../../../components/CustomTextArea';
import CustomDateInput from '../../../components/CustomDateInput';
import { resetTrackForm, trackAccountFormOnce } from '../../../utils/Functions';

const InvoiceForm = ({ data, errors, onChange, onBlur }) => {

    const { customerId, salesPerson, price, poNo, hsnCode, mailSubject, invoiceDate, dueDate } = data

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
                    <InputLabel name='Customer Name' error={errors.customerId} mandatory />
                    <SelectInput track showSearch
                        options={genderOptions} value={customerId} placeholder='Search & Select'
                        error={errors.customerId} onSelect={(value) => onChange(value, 'customerId')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Sales Person' error={errors.salesPerson} mandatory />
                    <SelectInput track
                        options={genderOptions} value={salesPerson}
                        error={errors.salesPerson} onSelect={(value) => onChange(value, 'salesPerson')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name="Invoice Number" error={errors.price} mandatory />
                    <CustomInput value={price} disabled error={errors.price} placeholder="Invoice Number" />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Invoice Date' error={errors.invoiceDate} mandatory />
                    <CustomDateInput
                        track
                        value={invoiceDate} error={errors.invoiceDate}
                        onChange={(value) => onChange(value, 'invoiceDate')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Due Date' error={errors.tax} mandatory />
                    <CustomDateInput
                        track error={errors.dueDate}
                        value={dueDate}
                        onChange={(value) => onChange(value, 'dueDate')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='HSN Code' error={errors.hsnCode} mandatory />
                    <CustomInput value={hsnCode}
                        error={errors.hsnCode} placeholder='HSN Code'
                        onChange={(value) => onChange(value, 'hsnCode')}
                        onBlur={(value) => onBlur(value, 'hsnCode')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='PO Number' error={errors.poNo} />
                    <CustomInput value={poNo}
                        error={errors.poNo} placeholder='PO Number'
                        onChange={(value) => onChange(value, 'poNo')}
                        onBlur={(value) => onBlur(value, 'poNo')}
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