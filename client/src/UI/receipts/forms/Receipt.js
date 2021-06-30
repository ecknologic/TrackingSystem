import React, { useEffect } from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import SelectInput from '../../../components/SelectInput';
import { resetTrackForm, trackAccountFormOnce } from '../../../utils/Functions';

const ReceiptForm = ({ data, errors, onChange, customerOptions, paymentOptions }) => {

    const { customerId, customerName, depositAmount, noOfCans, paymentMode, receiptNumber, transactionId } = data
    const nonCashPayment = paymentMode !== 'Cash'

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    return (
        <div className='app-form-container employee-form-container'>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Customer ID' error={errors.customerId} mandatory />
                    <SelectInput track showSearch
                        options={customerOptions} value={customerId} placeholder='Search & Select'
                        error={errors.customerId} onSelect={(value) => onChange(value, 'customerId')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Receipt Number' error={errors.receiptNumber} />
                    <CustomInput value={receiptNumber} disabled
                        error={errors.receiptNumber} placeholder='Receipt Number'
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Customer Name' error={errors.customerName} />
                    <CustomInput value={customerName} disabled
                        error={errors.customerName} placeholder='Customer Name'
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Deposit Amount' error={errors.depositAmount} />
                    <CustomInput value={depositAmount} disabled
                        error={errors.depositAmount} placeholder='Deposit Amount'
                    />
                </div>

            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name="Number of Cans" error={errors.noOfCans} />
                    <CustomInput value={noOfCans} disabled
                        error={errors.noOfCans} placeholder="Number of Cans"
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Payment Mode' mandatory error={errors.paymentMode} />
                    <SelectInput track
                        options={paymentOptions} value={paymentMode}
                        error={errors.paymentMode} onSelect={(value) => onChange(value, 'paymentMode')}
                    />
                </div>
            </div>
            {
                nonCashPayment &&
                (
                    <div className='row'>
                        <div className='input-container'>
                            <InputLabel name='Number' mandatory error={errors.transactionId} />
                            <CustomInput value={transactionId}
                                error={errors.transactionId} placeholder="Number"
                                onChange={(value) => onChange(value, 'transactionId')}
                            />
                        </div>
                    </div>
                )
            }
        </div>
    )
}
export default ReceiptForm