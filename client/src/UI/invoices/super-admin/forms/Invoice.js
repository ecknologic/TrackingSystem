import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import Spinner from '../../../../components/Spinner';
import NoContent from '../../../../components/NoContent';
import InputValue from '../../../../components/InputValue';
import InputLabel from '../../../../components/InputLabel';
import CustomInput from '../../../../components/CustomInput';
import SelectInput from '../../../../components/SelectInput';
import CustomDateInput from '../../../../components/CustomDateInput';
import { resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';

const InvoiceForm = ({ data, salesPersonOptions, billingAddress, customerOptions, errors, onChange }) => {

    const { customerId, salesPerson, poNo, hsnCode, invoiceId, invoiceDate, fromDate, toDate, dueDate } = data
    const { loading, loaded, address, gstNo, creditPeriodInDays = 0 } = billingAddress

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    const disableDates = (current) => {
        if (!current) return false
        return current.valueOf() <= dayjs(invoiceDate)
    }

    return (
        <div className='app-form-container invoice-form-container'>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Customer Name' error={errors.customerId} mandatory />
                    <SelectInput track showSearch
                        options={customerOptions} value={customerId} placeholder='Search & Select'
                        error={errors.customerId} onSelect={(value) => onChange(value, 'customerId')}
                    />
                </div>
            </div>
            {
                loading ? <NoContent style={{ minHeight: '10.36em', width: '50%' }} content={<Spinner />} />
                    : loaded ? (
                        <>
                            <div className='row'>
                                <div className='input-container'>
                                    <InputLabel name='Billing Address' />
                                    <InputValue size='large' value={address} />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='input-container'>
                                    <InputLabel name='GST Number' />
                                    <InputValue size='large' value={gstNo || 'NA'} />
                                </div>
                            </div>
                        </>
                    ) : null
            }
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Sales Person' error={errors.salesPerson} />
                    <SelectInput track
                        options={salesPersonOptions} value={salesPerson}
                        error={errors.salesPerson} onSelect={(value) => onChange(value, 'salesPerson')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name="Invoice Number" />
                    <CustomInput value={invoiceId} disabled placeholder="Invoice Number" />
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
                    <InputLabel name='Due Date' error={errors.dueDate} mandatory />
                    <CustomDateInput
                        track error={errors.dueDate} disabled
                        value={dueDate} disabledDate={disableDates}
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
                <div className='input-container'>
                    <InputLabel name='Invoice Period Start Date' error={errors.fromDate} mandatory />
                    <CustomDateInput
                        track
                        value={fromDate} error={errors.fromDate}
                        onChange={(value) => onChange(value, 'fromDate')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Invoice Period End Date' error={errors.toDate} mandatory />
                    <CustomDateInput
                        track
                        value={toDate} error={errors.toDate}
                        onChange={(value) => onChange(value, 'toDate')}
                    />
                </div>
            </div>
        </div>
    )
}
export default InvoiceForm