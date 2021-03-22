import React, { useMemo } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import Header from './header';
import Dashboard from './panels/Dashboard';
import { getMainPathname } from '../../../../utils/Functions';
import '../../../../sass/invoices.scss';

const DeliveredDC = () => {
    const history = useHistory()
    const { pathname } = useLocation()
    const { invoiceId } = useParams()
    const mainUrl = useMemo(() => getMainPathname(pathname), [pathname])

    const handleBack = () => history.push(`${mainUrl}`)

    return (
        <div className='invoice-content'>
            <Header onClick={handleBack} invoiceId={invoiceId} />
            <Dashboard invoiceId={invoiceId} />
        </div >
    )
}
export default DeliveredDC