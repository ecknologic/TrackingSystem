import React from 'react';
import { Divider } from 'antd';
import InputLabel from '../../../../components/InputLabel';
import InputValue from '../../../../components/InputValue';
import { renderProductDetailsJSX } from '../../../../utils/Functions';

const DCView = ({ data }) => {
    const { routeName, mobileNumber, driverName, stockDetails, deliveredDetails, pendingDetails } = data

    return (
        <div className='app-form-container'>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Driver Name' />
                    <InputValue size='smaller' value={driverName} />
                </div>
                <div className='input-container'>
                    <InputLabel name='Mobile Number' />
                    <InputValue size='smaller' value={mobileNumber} />
                </div>
            </div>
            <Divider />
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Route' />
                    <InputValue size='smaller' value={routeName || 'Not Assigned'} />
                </div>
            </div>
            <Divider />
            {renderProductDetailsJSX(stockDetails, 'Stock Details')}
            <Divider />
            {renderProductDetailsJSX(deliveredDetails, 'Delivered Details')}
            <Divider />
            {renderProductDetailsJSX(pendingDetails, 'Pending Details')}
        </div>
    )
}

export default DCView