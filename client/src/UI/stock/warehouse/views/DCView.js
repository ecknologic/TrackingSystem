import React from 'react';
import { Divider } from 'antd';
import InputLabel from '../../../../components/InputLabel';
import InputValue from '../../../../components/InputValue';

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
            {renderColumns(stockDetails, 'Stock Details')}
            <Divider />
            {renderColumns(deliveredDetails, 'Delivered Details')}
            <Divider />
            {renderColumns(pendingDetails, 'Pending Details')}
        </div>
    )
}

function renderColumns(data, title) {
    const { product20L, product2L, product1L, product500ML, product300ML } = data
    return (
        <div className='columns'>
            <InputLabel name={title} />
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
    )
}
export default DCView