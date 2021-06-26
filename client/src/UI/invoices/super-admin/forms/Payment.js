import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import InputLabel from '../../../../components/InputLabel';
import CustomInput from '../../../../components/CustomInput';
import SelectInput from '../../../../components/SelectInput';
import CustomDateInput from '../../../../components/CustomDateInput';
import { disableFutureDates, resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';

const PaymentForm = ({ data, paymentOptions = [], errors, onChange, onBlur }) => {

    const { customerName, amountPaid, noOfPayments, invoiceId, paymentDate, paymentMode, createdDateTime, disableAmountPaid } = data

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    const disableDates = (current) => {
        if (!current) return false
        return current.valueOf() > Date.now() || current.valueOf() <= dayjs(createdDateTime).subtract(1, 'day')
    }

    return (
        <div className='app-form-container invoice-form-container'>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Customer Name' />
                    <CustomInput value={customerName} disabled placeholder="Customer Name" />
                </div>
                <div className='input-container'>
                    <InputLabel name="Invoice Number" />
                    <CustomInput value={invoiceId} disabled placeholder="Invoice Number" />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name="Amount Received" mandatory error={errors.amountPaid} />
                    <CustomInput value={amountPaid} disabled={disableAmountPaid} error={errors.amountPaid} onBlur={(value) => onBlur(value, 'amountPaid')}
                        placeholder="Amount Received" onChange={(value) => onChange(value, 'amountPaid')} />
                </div>
                <div className='input-container'>
                    <InputLabel name="Payment Number" />
                    <CustomInput value={noOfPayments} disabled placeholder="Payment Number" />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Payment Mode' mandatory error={errors.paymentMode} />
                    <SelectInput track
                        options={paymentOptions} value={paymentMode}
                        error={errors.paymentMode} onSelect={(value) => onChange(value, 'paymentMode')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Payment Date' error={errors.paymentDate} mandatory />
                    <CustomDateInput
                        track error={errors.paymentDate}
                        value={paymentDate} disabledDate={disableDates}
                        onChange={(value) => onChange(value, 'paymentDate')}
                    />
                </div>
            </div>
        </div>
    )
}
export default PaymentForm