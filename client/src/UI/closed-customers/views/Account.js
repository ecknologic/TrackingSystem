import React from 'react';
import dayjs from 'dayjs';
import InputValue from '../../../components/InputValue';
import { getAccountStatusUI } from '../../../utils/Functions';
const DATEFORMAT = 'DD/MM/YYYY'

const AccountView = ({ data, accData }) => {

    const { customerName, natureOfBussiness, registeredDate, salesAgentName, contactperson, customertype, city, state, mobileNumber, address, EmailId, accountStatus, salesAgent, revisitDate,
        product20L, price20L, product2L, product1L, price2L, price1L, product500ML,
        price500ML, product300ML, price300ML } = data

    // const { customerId, customerName, routeId, departmentId, closingDate, noOfCans, collectedCans, collectedDate,
    //     pendingAmount, depositAmount, missingCansCount, missingCansAmount, balanceAmount, totalAmount,
    //     reason, deliveryDetailsId } = data
    // const { accountNumber, bankName, branchName, ifscCode, customerName: accountName } = accData

    return (
        <div className='app-view-info'>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Customer Name' />
                    <InputValue size='large' value={customerName} />
                </div>
                {/* <div className='input-container'>
                    <InputValue size='smaller' value="Operational Area" />
                    <InputValue size='large' value={operationalArea} />
                </div> */}
            </div>
            <div className='row half-stretch'>
                <div className='input-container stretch'>
                    <InputValue size='smaller' value='Address' />
                    <InputValue size='large' value={address} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Contact Name' />
                    <InputValue size='large' value={contactperson} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='Account Type' />
                    <InputValue size='large' value={customertype} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Mobile Number' />
                    <InputValue size='large' value={mobileNumber} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='Email' />
                    <InputValue size='large' value={EmailId} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='State' />
                    <InputValue size='large' value={state} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='District/Mandal/Area' />
                    <InputValue size='large' value={city} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Registered Date' />
                    <InputValue size='large' value={dayjs(registeredDate).format(DATEFORMAT)} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='Nature of Business' />
                    <InputValue size='large' value={natureOfBussiness} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Account Status' />
                    <InputValue size='large' value={getAccountStatusUI(accountStatus)} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='Sales Manager' />
                    <InputValue size='large' value={salesAgentName} />
                </div>
            </div>
            <div className='row half-stretch'>
                {revisitDate ? <div className='input-container'>
                    <InputValue size='smaller' value='Revisit Date' />
                    <InputValue size='large' value={dayjs(revisitDate).format(DATEFORMAT)} />
                </div> : null}
            </div>
        </div>
    )
}

export default AccountView