import React, { useEffect } from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import SelectInput from '../../../components/SelectInput';
import CustomTextArea from '../../../components/CustomTextArea';
import CustomDateInput from '../../../components/CustomDateInput';
import { disableFutureDates, resetTrackForm, trackAccountFormOnce } from '../../../utils/Functions';
import { Divider } from 'antd';

const EnquiryForm = (props) => {

    const { data, errors, onChange, disabled, onBlur, customerOptions, routeOptions, locationOptions } = props
    const { customerId, customerName, routeId, closingDate, noOfCans, collectedCans, collectedDate,
        pendingAmount, depositAmount, totalAmount, missingCansAmount, balanceAmount, reason, deliveryDetailsId,
        accountNo, bankName, branchName, ifscCode, accountName } = data

    // routeId, 
    // createdBy,createdDateTime

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
                    <InputLabel name='Customer Name' error={errors.customerName} mandatory />
                    <CustomInput value={customerName} disabled
                        error={errors.customerName} placeholder="Add Customer Name"
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Delivery Location' error={errors.deliveryDetailsId} mandatory />
                    <SelectInput track
                        options={locationOptions} value={deliveryDetailsId}
                        error={errors.deliveryDetailsId} onSelect={(value) => onChange(value, 'deliveryDetailsId')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Route' error={errors.routeId} mandatory />
                    <SelectInput track
                        options={routeOptions} value={routeId}
                        error={errors.routeId} onSelect={(value) => onChange(value, 'routeId')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Closing Date' error={errors.closingDate} />
                    <CustomDateInput
                        track disabled={disabled} error={errors.closingDate}
                        value={closingDate} disabledDate={disableFutureDates}
                        onChange={(value) => onChange(value, 'closingDate')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name="Bottles To Be Collected" error={errors.noOfCans} mandatory />
                    <CustomInput value={noOfCans} disabled={disabled}
                        error={errors.noOfCans} placeholder="Bottles To Be Collected"
                        onChange={(value) => onChange(value, 'noOfCans')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Collected Date' error={errors.collectedDate} mandatory />
                    <CustomDateInput
                        track disabled={disabled} error={errors.collectedDate}
                        value={collectedDate} disabledDate={disableFutureDates}
                        onChange={(value) => onChange(value, 'collectedDate')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name="Bottles Collected" error={errors.collectedCans} mandatory />
                    <CustomInput value={collectedCans} disabled={disabled}
                        error={errors.collectedCans} placeholder="Bottles Collected"
                        onChange={(value) => onChange(value, 'collectedCans')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name="Pending Receivables" error={errors.pendingAmount} mandatory />
                    <CustomInput value={pendingAmount} disabled={disabled}
                        error={errors.pendingAmount} placeholder="Pending Receivables"
                        onChange={(value) => onChange(value, 'pendingAmount')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name="Deposit To Be Refunded" error={errors.depositAmount} mandatory />
                    <CustomInput value={depositAmount} disabled={disabled}
                        error={errors.depositAmount} placeholder="Deposit To Be Refunded"
                        onChange={(value) => onChange(value, 'depositAmount')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name="Balance Amount" error={errors.balanceAmount} mandatory />
                    <CustomInput value={balanceAmount} disabled={disabled}
                        error={errors.balanceAmount} placeholder="Balance Amount"
                        onChange={(value) => onChange(value, 'balanceAmount')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name="Missing Bottles Amount" error={errors.missingCansAmount} mandatory />
                    <CustomInput value={missingCansAmount} disabled={disabled}
                        error={errors.missingCansAmount} placeholder="Missing Bottles Amount"
                        onChange={(value) => onChange(value, 'missingCansAmount')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name="Total Balance Amount" error={errors.totalAmount} mandatory />
                    <CustomInput value={totalAmount} disabled={disabled}
                        error={errors.totalAmount} placeholder="Total Balance Amount"
                        onChange={(value) => onChange(value, 'totalAmount')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name="Reason To Close" error={errors.reason} mandatory />
                    <CustomTextArea maxLength={256} error={errors.reason} placeholder='Add Reason'
                        value={reason} minRows={2} maxRows={3} onChange={(value) => onChange(value, 'reason')}
                    />
                </div>
            </div>
            <Divider className='form-divider' />
            <div className='employee-title-container inner'>
                <span className='title'>Bank Account Details</span>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Customer/Related Name' error={errors.accountName} mandatory />
                    <CustomInput value={accountName}
                        error={errors.accountName} placeholder="Add Customer/Related Name"
                        onChange={(value) => onChange(value, 'accountName')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Account Number' error={errors.accountNo} mandatory />
                    <CustomInput value={accountNo} placeholder='Account Number' maxLength={18}
                        error={errors.accountNo} onBlur={(value) => onBlur(value, 'accountNo')}
                        onChange={(value) => onChange(value, 'accountNo')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Bank Name' error={errors.bankName} mandatory />
                    <CustomInput value={bankName}
                        error={errors.bankName} placeholder='Bank Name'
                        onChange={(value) => onChange(value, 'bankName')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Branch Name' error={errors.branchName} mandatory />
                    <CustomInput value={branchName}
                        error={errors.branchName} placeholder='Branch Name'
                        onChange={(value) => onChange(value, 'branchName')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='IFSC Code' error={errors.ifscCode} mandatory />
                    <CustomInput value={ifscCode} placeholder='IFSC Code' maxLength={11} uppercase
                        error={errors.ifscCode} onBlur={(value) => onBlur(value, 'ifscCode')}
                        onChange={(value) => onChange(value, 'ifscCode')}
                    />
                </div>
            </div>
        </div>
    )
}
export default EnquiryForm