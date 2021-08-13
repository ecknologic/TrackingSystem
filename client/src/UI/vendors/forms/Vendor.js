import { Divider } from 'antd';
import React, { useEffect } from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import CustomTextArea from '../../../components/CustomTextArea';
import { resetTrackForm, trackAccountFormOnce } from '../../../utils/Functions';

const VendorForm = (props) => {

    const { data, accData, errors, accErrors, onChange, disabled, onAccBlur, onAccChange, hideBank } = props
    const { vendorName, gstNo, address, contactPerson, creditPeriod, itemsSupplied, remarks } = data
    const { accountNumber, bankName, branchName, ifscCode, customerName } = accData

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
                    <InputLabel name='Vendor Name' error={errors.vendorName} mandatory />
                    <CustomInput value={vendorName} onChange={(value) => onChange(value, 'vendorName')}
                        error={errors.vendorName} placeholder="Add Vendor Name"
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='GST Number' error={errors.gstNo} mandatory />
                    <CustomInput maxLength={15} uppercase
                        value={gstNo} placeholder='GST Number'
                        error={errors.gstNo}
                        onChange={(value) => onChange(value, 'gstNo')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container stretch'>
                    <InputLabel name='Address' error={errors.address} mandatory />
                    <CustomTextArea maxLength={256} error={errors.address} placeholder='Add Address'
                        value={address} minRows={1} maxRows={2} onChange={(value) => onChange(value, 'address')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Contact Person' error={errors.contactPerson} mandatory />
                    <CustomInput
                        value={contactPerson}
                        disabled={disabled}
                        placeholder='Contact Person'
                        error={errors.contactPerson}
                        onChange={(value) => onChange(value, 'contactPerson')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Credit Period' error={errors.creditPeriod} mandatory />
                    <CustomInput
                        value={creditPeriod}
                        disabled={disabled} placeholder='Credit Period'
                        error={errors.creditPeriod}
                        onChange={(value) => onChange(value, 'creditPeriod')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name="Items Supplied" error={errors.itemsSupplied} mandatory />
                    <CustomInput value={itemsSupplied} disabled={disabled}
                        error={errors.itemsSupplied} placeholder="Items Supplied"
                        onChange={(value) => onChange(value, 'itemsSupplied')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name="Remarks" error={errors.remarks} />
                    <CustomTextArea maxLength={256} error={errors.remarks} placeholder='Add Remarks'
                        value={remarks} minRows={2} maxRows={3} onChange={(value) => onChange(value, 'remarks')}
                        disabled={disabled}
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
                                    <CustomInput value={customerName}
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
export default VendorForm