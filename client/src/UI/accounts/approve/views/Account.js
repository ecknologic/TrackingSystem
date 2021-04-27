import React from 'react';
import dayjs from 'dayjs';
import InputValue from '../../../../components/InputValue';
import { getBusinessTypes, getInvoiceLabel } from '../../../../utils/Functions';
const DATEFORMAT = 'DD/MM/YYYY'

const AccountView = ({ data }) => {

    const {
        natureOfBussiness, address, customerName, mobileNumber, invoicetype, creditPeriodInDays, alternatePhNo,
        customertype, EmailId, registeredDate, depositAmount, referredBy, createdUserName, contractPeriod,
        pinCode,
    } = data

    const isCorporate = customertype === 'Corporate'
    const NOB = getBusinessTypes(natureOfBussiness)

    const renderDA = () => (
        <div className='input-container'>
            <InputValue size='smaller' value='Deposit Amount' />
            <InputValue size='large' value={depositAmount} />
        </div>
    )

    return (
        <>
            <div className='app-view-info'>
                <div className='input-container half-stretch'>
                    <InputValue size='smaller' value='Address' />
                    <InputValue size='large' value={address} />
                </div>
                <div className='row half-stretch'>
                    <div className='input-container'>
                        <InputValue size='smaller' value='PIN Code' />
                        <InputValue size='large' value={pinCode} />
                    </div>
                    <div className='input-container'>
                        <InputValue size='smaller' value='Email ID' />
                        <InputValue size='large' value={EmailId} />
                    </div>
                </div>
                <div className='row half-stretch'>
                    <div className='input-container'>
                        <InputValue size='smaller' value='Contact Number' />
                        <InputValue size='large' value={mobileNumber} />
                    </div>
                    {
                        alternatePhNo &&
                        (
                            <div className='input-container'>
                                <InputValue size='smaller' value='Alternate Phone No' />
                                <InputValue size='large' value={alternatePhNo} />
                            </div>
                        )
                    }
                </div>
                <div className='row half-stretch'>
                    <div className='input-container'>
                        <InputValue size='smaller' value='Contact Person' />
                        <InputValue size='large' value={customerName} />
                    </div>
                    <div className='input-container'>
                        <InputValue size='smaller' value='Nature of Business' />
                        <InputValue size='large' value={NOB} />
                    </div>
                </div>
                <div className='row half-stretch'>
                    <div className='input-container'>
                        <InputValue size='smaller' value='Registered Date' />
                        <InputValue size='large' value={dayjs(registeredDate).format(DATEFORMAT)} />
                    </div>
                    <div className='input-container'>
                        <InputValue size='smaller' value='Invoice Type' />
                        <InputValue size='large' value={getInvoiceLabel(invoicetype)} />
                    </div>
                </div>
                <div className='row half-stretch'>
                    {
                        referredBy ? <div className='input-container'>
                            <InputValue size='smaller' value='Referred By' />
                            <InputValue size='large' value={referredBy} />
                        </div> : renderDA()
                    }
                    <div className='input-container'>
                        <InputValue size='smaller' value='Created By' />
                        <InputValue size='large' value={createdUserName} />
                    </div>
                </div>
                <div className='row half-stretch'>
                    {
                        isCorporate ? <div className='input-container'>
                            <InputValue size='smaller' value='Credit Period in Days' />
                            <InputValue size='large' value={creditPeriodInDays} />
                        </div> : null
                    }
                    {
                        referredBy ? renderDA() : null
                    }
                </div>
                {
                    isCorporate ? <div className='row half-stretch'>
                        <div className='input-container'>
                            <InputValue size='smaller' value='Contract Period' />
                            <InputValue size='large' value={contractPeriod} />
                        </div>
                    </div> : null
                }
            </div>
        </>
    )
}
export default AccountView