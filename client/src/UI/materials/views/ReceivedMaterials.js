import React from 'react';
import { Divider } from 'antd';
import InputLabel from '../../../components/InputLabel';
import InputValue from '../../../components/InputValue';
import dayjs from 'dayjs';
const DATEANDTIMEFORMAT = 'DD/MM/YYYY hh:mm A'

const ReceivedMaterialView = ({ data }) => {

    const { orderId, itemName, itemCode, itemQty, receiptNo, receiptDate, description, vendorName,
        invoiceDate, invoiceNo, requestedDate, approvedDate, taxAmount, invoiceAmount } = data

    return (
        <>
            <div className='app-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Order Id' />
                        <InputValue size='larger' value={orderId} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Status' />
                        <span className='app-dot' style={{ background: '#0EDD4D' }}></span>
                        <InputValue size='smaller' value='Delivered' />
                    </div>
                </div>
                <Divider />
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Receipt Date' />
                        <InputValue size='smaller' value={dayjs(receiptDate).format(DATEANDTIMEFORMAT)} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Receipt No' />
                        <InputValue size='smaller' value={receiptNo} />
                    </div>
                </div>
                <Divider />
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Invoice Date' />
                        <InputValue size='smaller' value={dayjs(invoiceDate).format(DATEANDTIMEFORMAT)} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Invoice No' />
                        <InputValue size='smaller' value={invoiceNo} />
                    </div>
                </div>
                <Divider />
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Invoice Amount' />
                        <InputValue size='smaller' value={`₹ ${invoiceAmount}`} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Tax Amount' />
                        <InputValue size='smaller' value={`₹ ${taxAmount}`} />
                    </div>
                </div>
                <Divider />
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Item Name' />
                        <InputValue size='smaller' value={itemName} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Item Code' />
                        <InputValue size='smaller' value={itemCode || '--'} />
                    </div>
                </div>
                <Divider />
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Item Description' />
                        <InputValue size='smaller' value={description} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Quantity' />
                        <InputValue size='smaller' value={itemQty} />
                    </div>
                </div>
                <Divider />
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Requested On' />
                        <InputValue size='smaller' value={dayjs(requestedDate).format(DATEANDTIMEFORMAT)} />
                    </div>
                    {
                        approvedDate && (
                            <div className='input-container'>
                                <InputLabel name='Approved On' />
                                <InputValue size='smaller' value={dayjs(approvedDate).format(DATEANDTIMEFORMAT)} />
                            </div>
                        )
                    }
                </div>
                <Divider />
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Vendor' />
                        <InputValue size='smaller' value={vendorName} />
                    </div>
                </div>
            </div>
        </>
    )
}
export default ReceivedMaterialView