import React from 'react';
import { Divider } from 'antd';
import InputLabel from '../../../components/InputLabel';
import InputValue from '../../../components/InputValue';
import { getStatusColor } from '../../../utils/Functions';
import dayjs from 'dayjs';
const DATEANDTIMEFORMAT = 'DD/MM/YYYY hh:mm A'

const InternalQCView = ({ data }) => {

    const { batchId, phLevel, TDS, ozoneLevel, managerName, requestedDate, shiftType, status } = data

    const color = getStatusColor(status)
    const text = status === 'Pending' ? status : 'Approved'

    return (
        <>
            <div className='app-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Batch No' />
                        <InputValue size='larger' value={batchId} />
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
                        <InputLabel name='pH Level' />
                        <InputValue size='smaller' value={phLevel} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='TDS' />
                        <InputValue size='smaller' value={TDS || '--'} />
                    </div>
                </div>
                <Divider />
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Ozone Level' />
                        <InputValue size='smaller' value={ozoneLevel} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Shift Type' />
                        <InputValue size='smaller' value={shiftType} />
                    </div>
                </div>
                <Divider />
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Requested On' />
                        <InputValue size='smaller' value={dayjs(requestedDate).format(DATEANDTIMEFORMAT)} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Manager Name' />
                        <InputValue size='smaller' value={managerName} />
                    </div>
                </div>
            </div>
        </>
    )
}
export default InternalQCView