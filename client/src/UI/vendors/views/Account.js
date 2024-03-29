import React from 'react';
import InputValue from '../../../components/InputValue';

const AccountView = ({ data, itemsSupplied }) => {

    const { vendorName, gstNo, address, contactPerson, creditPeriod, remarks } = data
    const items = itemsSupplied.filter(item => item !== "ALL").join(', ')

    return (
        <div className='app-view-info'>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Vendor Name' />
                    <InputValue size='large' value={vendorName} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='GST Number' />
                    <InputValue size='large' value={gstNo} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container stretch'>
                    <InputValue size='smaller' value='Address' />
                    <InputValue size='large' value={address} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Contact Person' />
                    <InputValue size='large' value={contactPerson} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='Credit Period' />
                    <InputValue size='large' value={creditPeriod} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container stretch'>
                    <InputValue size='smaller' value='Items Supplied' />
                    <InputValue size='large' value={items} />
                </div>
            </div>
            {remarks && (
                <div className='row half-stretch'>
                    <div className='input-container stretch'>
                        <InputValue size='smaller' value='Remarks' />
                        <InputValue size='large' value={remarks} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default AccountView