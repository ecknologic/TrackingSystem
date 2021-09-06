import React from 'react';
import InputValue from '../../../components/InputValue';

const BankView = ({ data }) => {

    const { accountNumber, bankName, branchName, ifscCode, customerName } = data

    return (
        <div className='app-view-info'>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Customer Name' />
                    <InputValue size='large' value={customerName} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='Account Number' />
                    <InputValue size='large' value={accountNumber} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Bank Name' />
                    <InputValue size='large' value={bankName} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='Branch Name' />
                    <InputValue size='large' value={branchName} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='IFSC Code' />
                    <InputValue size='large' value={ifscCode} />
                </div>
            </div>
        </div>
    )
}

export default BankView