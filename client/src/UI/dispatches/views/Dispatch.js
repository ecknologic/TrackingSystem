import React from 'react';
import dayjs from 'dayjs';
import { Divider } from 'antd';
import InputLabel from '../../../components/InputLabel';
import InputValue from '../../../components/InputValue';
import { getStatusColor } from '../../../utils/Functions';
const DATEANDTIMEFORMAT = 'DD/MM/YYYY hh:mm A'

const DispatchView = ({ data }) => {

    const { DCNO, batchId, dispatchedDate, vehicleNo, mobileNumber, managerName,
        product20L, product2L, product1L, product500ML, product300ML, dispatchAddress, vehicleType, driverName, status } = data

    const color = getStatusColor(status)

    return (
        <div className='app-form-container'>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Delivery Challan Number (DC Number)' />
                    <InputValue size='larger' value={DCNO} />
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
                    <InputLabel name='Batch No' />
                    <InputValue size='large' value={batchId} />
                </div>
                <div className='input-container'>
                    <InputLabel name='Dispatched On' />
                    <InputValue size='smaller' value={dayjs(dispatchedDate).format(DATEANDTIMEFORMAT)} />
                </div>
            </div>
            <Divider />
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Location Details' />
                    <InputValue size='smaller' value={dispatchAddress} />
                </div>
            </div>
            <Divider />
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Vehicle Details' />
                    <InputValue size='smaller' value={`${vehicleNo} - ${vehicleType}`} />
                </div>
            </div>
            <Divider />
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Contact Name And Number' />
                    <InputValue size='smaller' value={`${driverName}, ${mobileNumber || '--'}`} />
                </div>
                <div className='input-container'>
                    <InputLabel name='Manager' />
                    <InputValue size='larger' value={managerName} />
                </div>
            </div>
            <Divider />
            <div className='columns'>
                <InputLabel name='Stock Particulars' />
                <div className='columns-container'>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='20 Ltrs' />
                            <InputValue size='smaller' value={product20L} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='2 Ltrs (Box-1&times;12)' />
                            <InputValue size='smaller' value={product2L} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='1 Ltrs (Box-1&times;12)' />
                            <InputValue size='smaller' value={product1L} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='500 Ml (Box-1&times;12)' />
                            <InputValue size='smaller' value={product300ML} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='300 Ml (Box-1&times;12)' />
                            <InputValue size='smaller' value={product500ML} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default DispatchView