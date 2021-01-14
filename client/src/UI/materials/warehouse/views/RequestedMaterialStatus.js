import dayjs from 'dayjs';
import React from 'react';
import { Divider } from 'antd';
import InputLabel from '../../../../components/InputLabel';
import InputValue from '../../../../components/InputValue';
import { getStatusColor } from '../../../../utils/Functions';
const DATEANDTIMEFORMAT = 'DD/MM/YYYY hh:mm A'

const RequestedMaterialStatusView = ({ data }) => {

    const { orderId, status, itemName, itemCode, itemQty, description, vendorName, requestedDate, approvedDate } = data

    const color = getStatusColor(status)
    const text = status === 'Pending' || status === 'Rejected' ? status : 'Approved'

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
                        <InputValue size='smaller' value={text} />
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
                                <InputLabel name={`${text} On`} />
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
export default RequestedMaterialStatusView