import React from 'react';
import dayjs from 'dayjs';
import { Divider } from 'antd';
import InputLabel from '../../../../components/InputLabel';
import InputValue from '../../../../components/InputValue';
import { getStatusColor } from '../../../../utils/Functions';
const DATEANDTIMEFORMAT = 'DD/MM/YYYY hh:mm A'

const DCView = ({ data }) => {
    const { dcNo, RouteName, mobileNumber, product20L, product2L, product1L, product500ML, contactPerson,
        product300ML, address, driverName, isDelivered, deliveredDate, returnEmptyCans, customerName } = data

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
            <div className='columns'>
                <InputLabel name='Stock Particulars' />
                <div className='columns-container'>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='20 Ltrs' />
                            <InputValue size='smaller' value={product20L || 0} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='2 Ltrs (Box-1&times;9)' />
                            <InputValue size='smaller' value={product2L || 0} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='1 Ltrs (Box-1&times;12)' />
                            <InputValue size='smaller' value={product1L || 0} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='500 Ml (Box-1&times;24)' />
                            <InputValue size='smaller' value={product300ML || 0} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='300 Ml (Box-1&times;30)' />
                            <InputValue size='smaller' value={product500ML || 0} />
                        </div>
                    </div>
                </div>
            </div>
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