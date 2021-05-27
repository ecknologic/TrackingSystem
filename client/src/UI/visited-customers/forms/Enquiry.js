import React, { useEffect } from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import SelectInput from '../../../components/SelectInput';
import CustomTextArea from '../../../components/CustomTextArea';
import CustomDateInput from '../../../components/CustomDateInput';
import { AccountStatusOptions } from '../../../assets/fixtures';
import { disablePastDates, resetTrackForm, trackAccountFormOnce } from '../../../utils/Functions';

const EnquiryForm = (props) => {

    const { data, errors, onChange, disabled, onBlur, agentOptions } = props
    const { customerName, mobileNumber, address, EmailId, accountStatus, salesAgent, revisitDate } = data

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
                <div className='input-container stretch'>
                    <InputLabel name='Organization/Person Name' error={errors.customerName} mandatory />
                    <CustomInput value={customerName}
                        error={errors.customerName} placeholder="Add Organization/Person Name"
                        onChange={(value) => onChange(value, 'customerName')}
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
                    <InputLabel name='Phone Number' error={errors.mobileNumber} mandatory />
                    <CustomInput value={mobileNumber} placeholder='Phone Number'
                        error={errors.mobileNumber} onBlur={(value) => onBlur(value, 'mobileNumber')}
                        onChange={(value) => onChange(value, 'mobileNumber')} maxLength={10}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Email' error={errors.EmailId} mandatory />
                    <CustomInput
                        value={EmailId} type='email' disabled={disabled}
                        placeholder='Email' error={errors.EmailId}
                        onBlur={(value) => onBlur(value, 'EmailId')}
                        onChange={(value) => onChange(value, 'EmailId')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Sales & Collection Agent' error={errors.salesAgent} mandatory />
                    <SelectInput options={agentOptions} showSearch
                        disabled={disabled} error={errors.salesAgent} value={salesAgent}
                        onSelect={(value) => onChange(value, 'salesAgent')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Account Status' error={errors.accountStatus} mandatory />
                    <SelectInput options={AccountStatusOptions} showSearch
                        disabled={disabled} error={errors.accountStatus} value={accountStatus}
                        onSelect={(value) => onChange(value, 'accountStatus')}
                    />
                </div>
            </div>
            {
                accountStatus !== 'notintrested'
                && (
                    <div className='row'>
                        <div className='input-container'>
                            <InputLabel name='Revisit Date' error={errors.revisitDate} mandatory />
                            <CustomDateInput
                                track disabledDate={disablePastDates}
                                value={revisitDate} error={errors.revisitDate}
                                onChange={(value) => onChange(value, 'revisitDate')}
                            />
                        </div>
                    </div>
                )
            }
        </div>
    )
}
export default EnquiryForm