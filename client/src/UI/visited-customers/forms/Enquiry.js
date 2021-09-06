import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import SelectInput from '../../../components/SelectInput';
import CustomTextArea from '../../../components/CustomTextArea';
import CustomDateInput from '../../../components/CustomDateInput';
import { AccountStatusOptions, accountTypeOptions } from '../../../assets/fixtures';
import { disablePastDates, resetTrackForm, trackAccountFormOnce } from '../../../utils/Functions';
const DATEFORMAT = 'DD/MM/YYYY'

const EnquiryForm = (props) => {

    const { data, errors, onChange, disabled, onBlur, agentOptions, businessOptions } = props
    const { customerName, natureOfBussiness, registeredDate, contactperson, customertype, city, state, mobileNumber, address, EmailId, accountStatus, salesAgent, revisitDate,
        product20L, price20L, product2L, product1L, price2L, price1L, product500ML,
        price500ML, product300ML, price300ML } = data

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
                    <InputLabel name='Contact Person' error={errors.contactperson} mandatory />
                    <CustomInput
                        value={contactperson}
                        disabled={disabled}
                        placeholder='Contact Person'
                        error={errors.contactperson}
                        onChange={(value) => onChange(value, 'contactperson')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='Account Type' error={errors.customertype} mandatory />
                    <SelectInput options={accountTypeOptions} showSearch
                        disabled={disabled} error={errors.customertype} value={customertype}
                        onSelect={(value) => onChange(value, 'customertype')}
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
                    <InputLabel name='State' error={errors.state} mandatory />
                    <CustomInput
                        value={state}
                        disabled={disabled}
                        placeholder='State'
                        error={errors.state}
                        onChange={(value) => onChange(value, 'state')}
                    />
                </div>
                <div className='input-container'>
                    <InputLabel name='District/Mandal/Area' error={errors.city} mandatory />
                    <CustomInput
                        value={city}
                        disabled={disabled}
                        placeholder='Area'
                        error={errors.city}
                        onChange={(value) => onChange(value, 'city')}
                    />
                </div>
            </div>
            <div className='columns'>
                <InputLabel name='Products and Price' error={errors.productNPrice} mandatory />
                <div className='columns-container'>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='20 Ltrs' />
                            <CustomInput value={product20L}
                                placeholder='Qty' onChange={(value) => onChange(value, 'product20L')}
                            />
                        </div>
                        <div className='input-container'>
                            <InputLabel name='Price' />
                            <CustomInput value={price20L}
                                onBlur={(value) => onBlur(value, 'price20L')}
                                placeholder='Rs' onChange={(value) => onChange(value, 'price20L')} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='2 Ltrs (Box-1&times;9)' />
                            <CustomInput value={product2L}
                                placeholder='Qty' onChange={(value) => onChange(value, 'product2L')}
                            />
                        </div>
                        <div className='input-container'>
                            <InputLabel name='Price' />
                            <CustomInput value={price2L}
                                onBlur={(value) => onBlur(value, 'price2L')}
                                placeholder='Rs' onChange={(value) => onChange(value, 'price2L')} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='1 Ltrs (Box-1&times;12)' />
                            <CustomInput value={product1L}
                                placeholder='Qty' onChange={(value) => onChange(value, 'product1L')}
                            />
                        </div>
                        <div className='input-container'>
                            <InputLabel name='Price' />
                            <CustomInput value={price1L}
                                onBlur={(value) => onBlur(value, 'price1L')}
                                placeholder='Rs' onChange={(value) => onChange(value, 'price1L')} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='500 Ml (Box-1&times;24)' />
                            <CustomInput value={product500ML}
                                placeholder='Qty' onChange={(value) => onChange(value, 'product500ML')}
                            />
                        </div>
                        <div className='input-container'>
                            <InputLabel name='Price' />
                            <CustomInput value={price500ML}
                                onBlur={(value) => onBlur(value, 'price500ML')}
                                placeholder='Rs' onChange={(value) => onChange(value, 'price500ML')} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='300 Ml (Box-1&times;30)' />
                            <CustomInput value={product300ML}
                                placeholder='Qty' onChange={(value) => onChange(value, 'product300ML')}
                            />
                        </div>
                        <div className='input-container'>
                            <InputLabel name='Price' />
                            <CustomInput value={price300ML}
                                onBlur={(value) => onBlur(value, 'price300ML')}
                                placeholder='Rs' onChange={(value) => onChange(value, 'price300ML')} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Registered Date' error={errors.registeredDate} />
                    <CustomInput value={dayjs(registeredDate).format(DATEFORMAT)} placeholder='Registered Date' disabled />
                </div>
                <div className='input-container'>
                    <InputLabel name='Nature Of Business' error={errors.natureOfBussiness} mandatory />
                    <SelectInput
                        value={natureOfBussiness}
                        options={businessOptions}
                        track disabled={disabled}
                        error={errors.natureOfBussiness}
                        onSelect={(value) => onChange(value, 'natureOfBussiness')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Sales & Collection Agent' error={errors.salesAgent} mandatory />
                    <SelectInput options={agentOptions} showSearch
                        disabled={disabled} error={errors.salesAgent} value={salesAgent}
                        onSelect={(value, label) => onChange(value, 'salesAgent', label, 'salesAgentName')}
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