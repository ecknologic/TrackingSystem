import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { Divider } from 'antd';
import InputLabel from '../../../../components/InputLabel';
import InputValue from '../../../../components/InputValue';
import CustomTextArea from '../../../../components/CustomTextArea';
import { getStatusColor, resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';
const DATEANDTIMEFORMAT = 'DD/MM/YYYY hh:mm A'

const RequestedMaterialStatusView = ({ data, formData, errors, isSuperAdmin, editMode, onChange }) => {

    const { orderId, status, itemName, itemCode, itemQty, description, vendorName, requestedDate, approvedDate } = data
    const { reason } = formData

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    const color = getStatusColor(status)
    const label = status === 'Rejected' ? status : 'Approved'

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
                        <span className='app-dot' style={{ background: color }}></span>
                        <InputValue size='smaller' value={status} />
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
                                <InputLabel name={`${label} On`} />
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
                {
                    isSuperAdmin &&
                    <>
                        <Divider />
                        <div className='row'>
                            <div className='input-container stretch'>
                                <InputLabel name='Description' error={errors.reason} />
                                {
                                    editMode ? (
                                        <CustomTextArea maxLength={256} error={errors.reason} placeholder='Add Description'
                                            value={reason} maxRows={4} onChange={(value) => onChange(value, 'reason')}
                                        />
                                    ) : <InputValue size='smaller' value={reason} />
                                }
                            </div>
                        </div>
                    </>
                }
            </div>
        </>
    )
}
export default RequestedMaterialStatusView