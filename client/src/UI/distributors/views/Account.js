import React from 'react';
import InputLabel from '../../../components/InputLabel';
import InputValue from '../../../components/InputValue';

const AccountView = ({ data }) => {

    const { agencyName, operationalArea, contactPerson, mobileNumber, address, alternatePhNo, mailId,
        alternateMailId, deliveryLocation, product20L, price20L, product2L, product1L, price2L, price1L, product500ML,
        price500ML, product300ML, price300ML } = data

    return (
        <div className='app-view-info'>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Agency Name' />
                    <InputValue size='large' value={agencyName} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value="Operational Area" />
                    <InputValue size='large' value={operationalArea} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container stretch'>
                    <InputValue size='smaller' value='Address' />
                    <InputValue size='large' value={address} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Delivery Location' />
                    <InputValue size='large' value={deliveryLocation} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='Contact Person' />
                    <InputValue size='large' value={contactPerson} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Mobile Number' />
                    <InputValue size='large' value={mobileNumber} />
                </div>
                {
                    alternatePhNo && (
                        <div className='input-container'>
                            <InputValue size='smaller' value='Alternate Mobile No' />
                            <InputValue size='large' value={alternatePhNo} />
                        </div>
                    )
                }
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Email' />
                    <InputValue size='large' value={mailId} />
                </div>
                {
                    alternateMailId && (
                        <div className='input-container'>
                            <InputValue size='smaller' value='Alternate Email' />
                            <InputValue size='large' value={alternateMailId} />
                        </div>
                    )
                }
            </div>
            <div className='columns'>
                <InputLabel name='Stock Particulars' />
                <div className='columns-container'>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='20 Ltrs' />
                            <InputValue value={product20L} />
                        </div>
                        <div className='input-container'>
                            <InputLabel name='Unit Price' />
                            <InputValue value={price20L} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='1 Ltrs (Box-1&times;12)' />
                            <InputValue value={product2L} />
                        </div>
                        <div className='input-container'>
                            <InputLabel name='Unit Price' />
                            <InputValue value={price2L} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='1 Ltrs (Box-1&times;12)' />
                            <InputValue value={product1L} />
                        </div>
                        <div className='input-container'>
                            <InputLabel name='Unit Price' />
                            <InputValue value={price1L} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='500 Ml (Box-1&times;24)' />
                            <InputValue value={product500ML} />
                        </div>
                        <div className='input-container'>
                            <InputLabel name='Unit Price' />
                            <InputValue value={price500ML} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='300 Ml (Box-1&times;30)' />
                            <InputValue value={product300ML} />
                        </div>
                        <div className='input-container'>
                            <InputLabel name='Unit Price' />
                            <InputValue value={price300ML} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AccountView