import React from 'react';
import dayjs from 'dayjs';
import InputValue from '../../../components/InputValue';
const DATEFORMAT = 'DD/MM/YYYY'

const DependentView = ({ data }) => {

    const { gender, dob, mobileNumber, name, relation } = data

    return (
        <div className='app-view-info'>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Name' />
                    <InputValue size='large' value={name} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='Date of Birth' />
                    <InputValue size='large' value={dayjs(dob).format(DATEFORMAT)} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Gender' />
                    <InputValue size='large' value={gender} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='Contact Number' />
                    <InputValue size='large' value={mobileNumber} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Relation' />
                    <InputValue size='large' value={relation} />
                </div>
            </div>
        </div>
    )
}
export default DependentView