import React from 'react';
import InputValue from '../../../../components/InputValue';
import UploadPreviewer from '../../../../components/UploadPreviewer';
import { renderProductDetailsJSX } from '../../../../utils/Functions';

const DeliveryView = ({ data }) => {

    const {
        gstNo, gstProof, departmentName, devDays, phoneNumber, contactPerson, routeName, ...rest } = data

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
                        <InputValue size='smaller' value='Delivery Days' />
                        <InputValue size='large' value={days.join(', ')} />
                    </div>
                </div>
                {renderProductDetailsJSX(rest)}
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