import React, { useEffect } from 'react';
import ProductsTable from './ProductsTable';
import InputLabel from '../../../components/InputLabel';
import { genderOptions } from '../../../assets/fixtures';
import CustomInput from '../../../components/CustomInput';
import SelectInput from '../../../components/SelectInput';
import CustomTextArea from '../../../components/CustomTextArea';
import CustomDateInput from '../../../components/CustomDateInput';
import { resetTrackForm, trackAccountFormOnce } from '../../../utils/Functions';

const InvoiceForm = ({ data, errors, onChange, onBlur }) => {

    const { customerName, price, tax, hsnCode, subject, invoiceDate, dueDate } = data

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
                    <SelectInput track
                        options={genderOptions} value={customerName}
                        error={errors.customerName} onSelect={(value) => onChange(value, 'customerName')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Sales Person' error={errors.hsnCode} mandatory />
                    <CustomInput value={hsnCode}
                        error={errors.hsnCode} placeholder='Sales Person'
                        onChange={(value) => onChange(value, 'hsnCode')}
                        onBlur={(value) => onBlur(value, 'hsnCode')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name="Invoice Number" error={errors.price} mandatory />
                    <CustomInput value={price}
                        error={errors.price} placeholder="Invoice Number"
                        onChange={(value) => onChange(value, 'price')}
                        onBlur={(value) => onBlur(value, 'price')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Invoice Date' error={errors.tax} mandatory />
                    <CustomDateInput
                        track error={errors.invoiceDate}
                        value={invoiceDate}
                        onChange={(value) => onChange(value, 'invoiceDate')}
                    />
                </div>
            </div>
            <div className='row'>
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
                    <InputLabel name='PO Number' error={errors.tax} mandatory />
                    <CustomInput value={tax}
                        error={errors.tax} placeholder='PO Number'
                        onChange={(value) => onChange(value, 'tax')}
                        onBlur={(value) => onBlur(value, 'tax')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container stretch'>
                    <InputLabel name='Subject' error={errors.subject} mandatory />
                    <CustomTextArea maxLength={100} error={errors.subject} placeholder='Add Subject' value={subject}
                        maxRows={4} onChange={(value) => onChange(value, 'subject')}
                    />
                </div>
            </div>
            <div className='row'>
                <ProductsTable />
            </div>
        </div>
    )
}
export default InvoiceForm