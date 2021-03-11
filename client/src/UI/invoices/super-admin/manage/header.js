import React from 'react';
import BackButton from '../../../../components/BackButton';
import CustomButton from '../../../../components/CustomButton';
import { PlusIconGrey } from '../../../../components/SVG_Icons';
import '../../../../sass/invoices.scss'

const Header = ({ onClick, onAdd }) => {

    return (
        <div className='app-simple-header manage-invoices-header'>
            <div className='left'>
                <BackButton onClick={onClick} />
                <span className='title'>All Invoices</span>
            </div>
            <CustomButton text='Create Invoice'
                onClick={onAdd}
                className='app-create-acc-btn'
                icon={<PlusIconGrey />}
            />
        </div>
    )

}

export default Header