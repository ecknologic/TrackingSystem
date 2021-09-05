import React from 'react';
import dayjs from 'dayjs';
import { Divider } from 'antd';
import InputLabel from '../../../../components/InputLabel';
import InputValue from '../../../../components/InputValue';
import { getStatusColor, renderProductDetailsJSX } from '../../../../utils/Functions';
const DATEANDTIMEFORMAT = 'DD/MM/YYYY hh:mm A'

const DCView = ({ data }) => {
    const { dcNo, RouteName, mobileNumber, contactPerson, address, driverName, isDelivered,
        deliveredDate, returnEmptyCans, customerName, ...rest } = data

    const color = getStatusColor(isDelivered)
    const text = isDelivered === 'Completed' ? 'Delivered' : isDelivered === 'Postponed' ? isDelivered : 'Pending'

    return (
        <div className='app-form-container'>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Delivery Challan Number (DC Number)' />
                    <InputValue size='larger' value={dcNo} />
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
                    <InputLabel name='Customer Name' />
                    <InputValue size='smaller' value={customerName} />
                </div>
                <div className='input-container'>
                    <InputLabel name='Contact Person' />
                    <InputValue size='smaller' value={contactPerson || '--'} />
                </div>
            </div>
            <Divider />
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Route' />
                    <InputValue size='smaller' value={RouteName || 'Not Assigned'} />
                </div>
                {
                    isDelivered === 'Completed' &&
                    (
                        <div className='input-container'>
                            <InputLabel name='Delivered On' />
                            <InputValue size='smaller' value={dayjs(deliveredDate).format(DATEANDTIMEFORMAT)} />
                        </div>
                    )
                }
            </div>
            <Divider />
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Driver Name And Number' />
                    <InputValue size='smaller' value={`${driverName || 'Not Assigned'}, ${mobileNumber || '--'}`} />
                </div>
                <div className='input-container'>
                    <InputLabel name='Location Details' />
                    <InputValue size='smaller' value={address} />
                </div>
            </div>
            <Divider />
            {renderProductDetailsJSX(rest)}
            <Divider />
            <div className='columns'>
                <InputLabel name='Return Cans' />
                <div className='columns-container'>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='20 Ltrs' />
                            <InputValue size='smaller' value={returnEmptyCans || 0} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default DCView