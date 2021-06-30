import React from 'react';
import { Divider } from 'antd';
import InputLabel from '../../../components/InputLabel';
import InputValue from '../../../components/InputValue';
import dayjs from 'dayjs';
const DATEFORMAT = 'DD/MM/YYYY'

const ReceiptView = ({ data }) => {
    const { receiptNumber, customerId, customerName, depositAmount, noOfCans, paymentMode, transactionId, createdDateTime } = data

    return (
        <>
            <div className='app-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Receipt No' />
                        <InputValue size='larger' value={receiptNumber} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Receipt Date' />
                        <InputValue size='smaller' value={dayjs(createdDateTime).format(DATEFORMAT)} />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Customer ID' />
                        <InputValue size='larger' value={customerId} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Customer Name' />
                        <InputValue size='larger' value={customerName} />
                    </div>
                </div>
                <Divider />
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Deposit Amount' />
                        <InputValue size='smaller' value={depositAmount} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Number of Cans' />
                        <InputValue size='smaller' value={noOfCans} />
                    </div>
                </div>
                <Divider />
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Payment Mode' />
                        <InputValue size='smaller' value={paymentMode} />
                    </div>
                    {
                        transactionId &&
                        (
                            <div className='input-container'>
                                <InputLabel name='Number' />
                                <InputValue size='smaller' value={transactionId} />
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}
export default ReceiptView