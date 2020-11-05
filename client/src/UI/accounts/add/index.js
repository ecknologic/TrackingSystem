import React, { Fragment, useState } from 'react';
import { Divider, Checkbox } from 'antd';
import Header from './header';
import CustomButton from '../../../components/CustomButton';
import Delivery from './forms/Delivery';
import CorporateAccount from './forms/CorporateAccount';
import GeneralAccount from './forms/GeneralAccount';

const AddAccount = () => {
    const [corporate, setCorporate] = useState(true)

    const highlight = { backgroundColor: '#5C63AB', color: '#fff' }
    const fade = { backgroundColor: '#EBEBEB', color: '#1B2125' }

    return (
        <Fragment>
            <Header />
            <div className='account-add-content'>
                <div className='header-buttons-container'>
                    <CustomButton
                        className='big'
                        style={corporate ? highlight : fade}
                        text='Corporate Customers' onClick={() => setCorporate(true)}
                    />
                    <CustomButton
                        className='big second'
                        style={corporate ? fade : highlight}
                        text='Other Customers' onClick={() => setCorporate(false)}
                    />
                </div>
                {
                    corporate ? <CorporateAccount />
                        : <GeneralAccount />
                }
                {
                    corporate ? (
                        <>
                            <div className='checkbox-container'>
                                <Checkbox /> <span className='text'>Delivery to the same address?</span>
                            </div>
                            <Divider />
                            <Delivery />
                        </>
                    ) : null
                }
                <div className='footer-buttons-container'>
                    <CustomButton className='big' className='cancel-btn footer-btn' text='Cancel' />
                    <CustomButton className='create-btn footer-btn' text='Create Account' />
                </div>
            </div>
        </Fragment>
    )
}

export default AddAccount
