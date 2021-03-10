import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Header from './header';
import Dashboard from './panels/Dashboard';
import '../../../../sass/invoices.scss';

const DeliveredDC = () => {
    const history = useHistory()
    const { invoiceId } = useParams()

    const handleBack = () => history.goBack()

    return (
        <div className='invoice-content'>
            <Header onClick={handleBack} invoiceId={invoiceId} />
            <Dashboard />
        </div >
    )
}
export default DeliveredDC