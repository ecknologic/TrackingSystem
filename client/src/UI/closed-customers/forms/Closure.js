import { Divider } from 'antd';
import React, { useEffect } from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import SelectInput from '../../../components/SelectInput';
import CustomTextArea from '../../../components/CustomTextArea';
import CustomDateInput from '../../../components/CustomDateInput';
import { disableFutureDates, resetTrackForm, trackAccountFormOnce } from '../../../utils/Functions';

const ClosureForm = (props) => {

    const { data, accData, errors, accErrors, onChange, disabled, onAccBlur, customerOptions,
        onAccChange, routeOptions, locationOptions, warehouseOptions, hideBank, disableFew, editMode } = props
    const { customerId, customerName, routeId, departmentId, closingDate, noOfCans, collectedCans, collectedDate,
        pendingAmount, depositAmount, missingCansCount, missingCansAmount, balanceAmount, totalAmount,
        reason, deliveryDetailsId } = data
    const { accountNumber, bankName, branchName, ifscCode, customerName: accountName } = accData

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
                {
                    editMode ? null
                        : (
                            <div className='input-container'>
                                <InputLabel name='Customer ID' error={errors.customerId} mandatory />
                                <SelectInput track showSearch
                                    options={customerOptions} value={customerId} placeholder='Search & Select'
                                    error={errors.customerId} onSelect={(value) => onChange(value, 'customerId')}
                                />
                            </div>
                        )
                }
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
                        options={locationOptions} value={deliveryDetailsId} disabled={disableFew || disabled}
                        error={errors.deliveryDetailsId} onSelect={(value) => onChange(value, 'deliveryDetailsId')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Warehouse' error={errors.departmentId} mandatory />
                    <SelectInput track
                        options={warehouseOptions} value={departmentId} disabled={disableFew || disabled}
                        error={errors.departmentId} onSelect={(value) => onChange(value, 'departmentId')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Route' error={errors.routeId} mandatory />
                    <SelectInput track
                        options={routeOptions} value={routeId} disabled={disableFew || disabled}
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
                    <CustomInput value={noOfCans} disabled={disableFew || disabled}
                        error={errors.noOfCans} placeholder="Bottles To Be Collected"
                        onChange={(value) => onChange(value, 'noOfCans')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Collected Date' error={errors.collectedDate} />
                    <CustomDateInput
                        track disabled={disableFew || disabled} error={errors.collectedDate}
                        value={collectedDate} disabledDate={disableFutureDates}
                        onChange={(value) => onChange(value, 'collectedDate')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name="Bottles Collected" error={errors.collectedCans} />
                    <CustomInput value={collectedCans} disabled={disabled}
                        error={errors.collectedCans} placeholder="Bottles Collected"
                        onChange={(value) => onChange(value, 'collectedCans')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name="Pending Receivables" error={errors.pendingAmount} mandatory />
                    <CustomInput value={pendingAmount} disabled={disableFew || disabled}
                        error={errors.pendingAmount} placeholder="Pending Receivables"
                        onChange={(value) => onChange(value, 'pendingAmount')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name="Deposit To Be Refunded" error={errors.depositAmount} mandatory />
                    <CustomInput value={depositAmount} disabled={disableFew || disabled}
                        error={errors.depositAmount} placeholder="Deposit To Be Refunded"
                        onChange={(value) => onChange(value, 'depositAmount')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name="Balance Amount" error={errors.balanceAmount} mandatory />
                    <CustomInput value={balanceAmount} disabled={disableFew || disabled}
                        error={errors.balanceAmount} placeholder="Balance Amount"
                        onChange={(value) => onChange(value, 'balanceAmount')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name="Missing Bottles Count" error={errors.missingCansCount} />
                    <CustomInput value={missingCansCount} disabled={disabled}
                        error={errors.missingCansCount} placeholder="Missing Bottles Count"
                        onChange={(value) => onChange(value, 'missingCansCount')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name="Missing Bottles Amount" error={errors.missingCansAmount} />
                    <CustomInput value={missingCansAmount} disabled={disableFew || disabled}
                        error={errors.missingCansAmount} placeholder="Missing Bottles Amount"
                        onChange={(value) => onChange(value, 'missingCansAmount')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name="Reason To Close" error={errors.reason} />
                    <CustomTextArea maxLength={256} error={errors.reason} placeholder='Add Reason'
                        value={reason} minRows={2} maxRows={3} onChange={(value) => onChange(value, 'reason')}
                        disabled={disableFew || disabled}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name="Total Balance Amount" error={errors.totalAmount} mandatory />
                    <CustomInput value={totalAmount} disabled={disableFew || disabled}
                        error={errors.totalAmount} placeholder="Total Balance Amount"
                        onChange={(value) => onChange(value, 'totalAmount')}
                    />
                </div>
            </div>
            {
                hideBank ? null
                    : (
                        <>
                            <Divider className='form-divider' />
                            <div className='employee-title-container inner'>
                                <span className='title'>Bank Account Details</span>
                            </div>
                            <div className='row'>
                                <div className='input-container'>
                                    <InputLabel name='Customer Name' error={accErrors.customerName} mandatory />
                                    <CustomInput value={accountName}
                                        error={accErrors.customerName} placeholder="Add Customer Name"
                                        onChange={(value) => onAccChange(value, 'customerName')}
                                    />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='input-container'>
                                    <InputLabel name='Account Number' error={accErrors.accountNumber} mandatory />
                                    <CustomInput value={accountNumber} placeholder='Account Number' maxLength={18}
                                        error={accErrors.accountNumber}
                                        onChange={(value) => onAccChange(value, 'accountNumber')}
                                    />
                                </div>
                                <div className='input-container'>
                                    <InputLabel name='Bank Name' error={accErrors.bankName} mandatory />
                                    <CustomInput value={bankName}
                                        error={accErrors.bankName} placeholder='Bank Name'
                                        onChange={(value) => onAccChange(value, 'bankName')}
                                    />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='input-container'>
                                    <InputLabel name='Branch Name' error={accErrors.branchName} mandatory />
                                    <CustomInput value={branchName}
                                        error={accErrors.branchName} placeholder='Branch Name'
                                        onChange={(value) => onAccChange(value, 'branchName')}
                                    />
                                </div>
                                <div className='input-container'>
                                    <InputLabel name='IFSC Code' error={accErrors.ifscCode} mandatory />
                                    <CustomInput value={ifscCode} placeholder='IFSC Code' maxLength={11} uppercase
                                        error={accErrors.ifscCode} onBlur={(value) => onAccBlur(value, 'ifscCode')}
                                        onChange={(value) => onAccChange(value, 'ifscCode')}
                                    />
                                </div>
                            </div>
                        </>
                    )
            }
        </div>
    )
}
export default ClosureForm