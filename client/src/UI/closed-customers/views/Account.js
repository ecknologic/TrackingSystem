import React from 'react';
import dayjs from 'dayjs';
import InputValue from '../../../components/InputValue';
const DATEFORMAT = 'DD/MM/YYYY'

const AccountView = ({ data }) => {

    const { customerNo, location, departmentName, RouteName, closingDate, noOfCans, collectedCans, collectedDate,
        pendingAmount, depositAmount, missingCansCount, missingCansAmount, balanceAmount, totalAmount, driverName,
        reason, driverAssignedOn } = data

    return (
        <div className='app-view-info'>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Customer ID' />
                    <InputValue size='large' value={customerNo} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='Delivery Location' />
                    <InputValue size='large' value={location} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Warehouse' />
                    <InputValue size='large' value={departmentName} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='Route' />
                    <InputValue size='large' value={RouteName} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Driver' />
                    <InputValue size='large' value={driverName} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='Driver Assigned On' />
                    <InputValue size='large' value={dayjs(driverAssignedOn).format(DATEFORMAT)} />
                </div>
            </div>
            <div className='row half-stretch'>
                {
                    closingDate &&
                    (
                        <div className='input-container'>
                            <InputValue size='smaller' value='Closing Date' />
                            <InputValue size='large' value={dayjs(closingDate).format(DATEFORMAT)} />
                        </div>
                    )
                }
                <div className='input-container'>
                    <InputValue size='smaller' value='Bottles To Be Collected' />
                    <InputValue size='large' value={noOfCans} />
                </div>
            </div>
            <div className='row half-stretch'>
                {
                    collectedDate &&
                    (
                        <div className='input-container'>
                            <InputValue size='smaller' value='Collected Date' />
                            <InputValue size='large' value={dayjs(collectedDate).format(DATEFORMAT)} />
                        </div>
                    )
                }
                {
                    !(collectedCans == null || !String(collectedCans)) &&
                    (
                        <div className='input-container'>
                            <InputValue size='smaller' value='Bottles Collected' />
                            <InputValue size='large' value={collectedCans} />
                        </div>
                    )
                }
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Pending Receivables' />
                    <InputValue size='large' value={pendingAmount} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='Deposit To Be Refunded' />
                    <InputValue size='large' value={depositAmount} />
                </div>
            </div>
            <div className='row half-stretch'>
                {
                    !(missingCansCount == null || !String(missingCansCount)) && (
                        <div className='input-container'>
                            <InputValue size='smaller' value='Missing Bottles Count' />
                            <InputValue size='large' value={missingCansCount} />
                        </div>)}
                <div className='input-container'>
                    <InputValue size='smaller' value='Balance Amount' />
                    <InputValue size='large' value={balanceAmount} />
                </div>
            </div>
            <div className='row half-stretch'>
                {
                    !(missingCansAmount == null || !String(missingCansAmount)) && (
                        <div className='input-container'>
                            <InputValue size='smaller' value='Missing Bottles Amount' />
                            <InputValue size='large' value={missingCansAmount} />
                        </div>
                    )
                }
                <div className='input-container'>
                    <InputValue size='smaller' value='Total Balance Amount' />
                    <InputValue size='large' value={totalAmount} />
                </div>
            </div>
            {
                reason &&
                (
                    <div className='row half-stretch'>
                        <div className='input-container stretch'>
                            <InputValue size='smaller' value='Reason To Close' />
                            <InputValue size='large' value={reason} />
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default AccountView