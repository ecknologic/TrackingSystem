import React from 'react';
import BackButton from '../../../../components/BackButton';
import '../../../../sass/invoices.scss'

const Header = ({ onClick, invoiceId }) => {

    return (
        <div className='app-simple-header manage-invoices-header'>
            <div className='left'>
                <BackButton onClick={onClick} />
                <span className='title'>Delivery Challan - {invoiceId}</span>
            </div>
        </div>
    )
}

export default Header