import React from 'react';
import dayjs from 'dayjs';
import InputValue from '../../../../components/InputValue';
import UploadPreviewer from '../../../../components/UploadPreviewer';
import { getInvoiceLabel } from '../../../../utils/Functions';
const DATEFORMAT = 'DD/MM/YYYY'

const AccountView = ({ data }) => {

    const {
        gstNo, natureOfBussiness, address, customerName, mobileNumber, invoicetype, creditPeriodInDays, EmailId,
        registeredDate, gstProof
    } = data

    return (
        <>
            <div className='app-view-info'>
                <div className='row half-stretch'>
                    <div className='input-container'>
                        <InputValue size='smaller' value='GST Number' />
                        <InputValue size='large' value={gstNo} />
                    </div>
                    <div className='input-container'>
                        <InputValue size='smaller' value='GST Proof' />
                        <div className='upload-preview-container'>
                            <UploadPreviewer value={gstProof} disabled />
                        </div>
                    </div>
                </div>
                <div className='input-container half-stretch'>
                    <InputValue size='smaller' value='Address' />
                    <InputValue size='large' value={address} />
                </div>
                <div className='row half-stretch'>
                    <div className='input-container'>
                        <InputValue size='smaller' value='Email ID' />
                        <InputValue size='large' value={EmailId} />
                    </div>
                    <div className='input-container'>
                        <InputValue size='smaller' value='Contact Number' />
                        <InputValue size='large' value={mobileNumber} />
                    </div>
                </div>
                <div className='row half-stretch'>
                    <div className='input-container'>
                        <InputValue size='smaller' value='Account Owner' />
                        <InputValue size='large' value={customerName} />
                    </div>
                    <div className='input-container'>
                        <InputValue size='smaller' value='Nature of Business' />
                        <InputValue size='large' value={natureOfBussiness} />
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
                <div className='input-container'>
                    <InputValue size='smaller' value='Credit Period in Days' />
                    <InputValue size='large' value={creditPeriodInDays} />
                </div>
            </div>
        </>
    )
}
export default AccountView