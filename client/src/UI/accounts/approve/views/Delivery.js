import React from 'react';
import InputValue from '../../../../components/InputValue';
import UploadPreviewer from '../../../../components/UploadPreviewer';
import InputLabel from '../../../../components/InputLabel';

const DeliveryView = ({ data }) => {

    const {
        gstNo, gstProof, depositAmount, departmentName, devDays, phoneNumber, contactPerson, routeName,
        product20L, price20L, product1L, price1L, product500ML, price500ML, product250ML, price250ML
    } = data

    const days = devDays.includes('ALL') ? ['All Days'] : devDays
    return (
        <>
            <div className='app-view-info'>
                {
                    gstNo && gstProof && (
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
                    )
                }
                <div className='row half-stretch'>
                    <div className='input-container'>
                        <InputValue size='smaller' value='Warehouse' />
                        <InputValue size='large' value={departmentName} />
                    </div>
                    <div className='input-container'>
                        <InputValue size='smaller' value='Route' />
                        <InputValue size='large' value={routeName} />
                    </div>
                </div>
                <div className='row half-stretch'>
                    <div className='input-container'>
                        <InputValue size='smaller' value='Deposit Amount' />
                        <InputValue size='large' value={depositAmount} />
                    </div>
                    <div className='input-container'>
                        <InputValue size='smaller' value='Delivery Days' />
                        <InputValue size='large' value={days.join(', ')} />
                    </div>
                </div>
                <div className='columns'>
                    <InputLabel name='Stock Particulars' />
                    <div className='columns-container'>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='20 Ltrs' />
                                <InputValue value={product20L} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Unit Price' />
                                <InputValue value={price20L} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='1 Ltrs' />
                                <InputValue value={product1L} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Unit Price' />
                                <InputValue value={price1L} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='500 Ml' />
                                <InputValue value={product500ML} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Unit Price' />
                                <InputValue value={price500ML} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='250 Ml' />
                                <InputValue value={product250ML} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Unit Price' />
                                <InputValue value={price250ML} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row half-stretch'>
                    <div className='input-container'>
                        <InputValue size='smaller' value='Contact Person' />
                        <InputValue size='large' value={contactPerson} />
                    </div>
                    <div className='input-container'>
                        <InputValue size='smaller' value='Contact Number' />
                        <InputValue size='large' value={phoneNumber} />
                    </div>
                </div>
            </div>
        </>
    )
}
export default DeliveryView