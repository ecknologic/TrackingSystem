import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { Divider } from 'antd';
import InputLabel from '../../../../components/InputLabel';
import InputValue from '../../../../components/InputValue';
import CustomTextArea from '../../../../components/CustomTextArea';
import { getStatusColor, resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';
const DATEANDTIMEFORMAT = 'DD/MM/YYYY hh:mm A'

const EmptyCansView = ({ data, formData, errors, editMode, onChange }) => {

    const { id, status, emptycans_count, departmentName, vehicleNo, vehicleType,
        driverName, mobileNumber, createdDateTime, details } = data
    const { reason } = formData

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    const color = getStatusColor(status)

    return (
        <>
            <div className='app-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Return ID' />
                        <InputValue size='larger' value={id} />
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
                        <InputLabel name='Return Cans' />
                        <InputValue size='smaller' value={emptycans_count} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Returned On' />
                        <InputValue size='smaller' value={dayjs(createdDateTime).format(DATEANDTIMEFORMAT)} />
                    </div>
                </div>
                <Divider />
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Location Details' />
                        <InputValue size='smaller' value={departmentName} />
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
                </div>
                <Divider />
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Details' />
                        <InputValue size='smaller' value={details} />
                    </div>
                </div>
                <Divider />
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Description' error={errors.reason} />
                        {
                            editMode ? (
                                <CustomTextArea maxLength={256} error={errors.reason} placeholder='Add Description'
                                    value={reason} maxRows={4} onChange={(value) => onChange(value, 'reason')}
                                />
                            ) : <InputValue size='smaller' value={reason || '--'} />
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
export default EmptyCansView