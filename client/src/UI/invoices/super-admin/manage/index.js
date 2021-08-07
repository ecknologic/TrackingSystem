import axios from 'axios';
import { http } from '../../../../modules/http';
import { useHistory, useLocation } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import Header from './header';
import ListPanel from './panels/ListPanel';
import ContentPanel from './panels/ContentPanel';
import Spinner from '../../../../components/Spinner'
import useUser from '../../../../utils/hooks/useUser';
import NoContent from '../../../../components/NoContent'
import { getMainPathname } from '../../../../utils/Functions';
import { ACCOUNTSADMIN, MARKETINGMANAGER, SUPERADMIN } from '../../../../utils/constants';
import '../../../../sass/invoices.scss';

const Invoices = () => {
    const { ROLE } = useUser()
    const history = useHistory()
    const { state, pathname } = useLocation()
    const [loading, setLoading] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [invoices, setInvoices] = useState([])
    const [activeMsg, setActiveMsg] = useState(state ? state.invoice : {})

    const mainUrl = useMemo(() => getMainPathname(pathname), [pathname])
    const isSMManager = useMemo(() => ROLE === MARKETINGMANAGER, [ROLE])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        state && getInvoice(state.invoice.invoiceId)
        getInvoices()
    }, [])

    const getInvoice = async (id) => {
        const { invoice = {} } = state || {}
        const { departmentId } = invoice

        let url = `invoice/getInvoiceById/${id}`
        if (departmentId) {
            url = `invoice/getDepartmentInvoiceById/${id}`
        }

        try {
            setIsLoading(true)
            const data = await http.GET(axios, url, config)
            setActiveMsg(data)
            setIsLoading(false)
        } catch (error) { }
    }

    const getInvoices = async () => {
        const { FOR, id, TYPE } = state || {}

        let url = 'invoice/getDepartmentInvoices'
        if (TYPE === 'PAYMENTS') {
            url = 'invoice/getDepartmentInvoicePayments'
        }

        if (FOR === SUPERADMIN || FOR === ACCOUNTSADMIN) {
            url = 'invoice/getInvoices/Pending'
            if (TYPE === 'PAYMENTS') {
                url = 'invoice/getInvoicePayments'
            }
        }
        else if (FOR === 'CUSTOMER') {
            url = `invoice/getCustomerInvoices/${id}`
        }
        else if (FOR === MARKETINGMANAGER) {
            url = 'invoice/getInvoicesByRole/5' // 5 is Sales and Marketing Admin Role
        }

        try {
            setLoading(true)
            const data = await http.GET(axios, url, config)
            setInvoices(data)
            setLoading(false)
        } catch (error) { }
    }

    const handleMsgSelect = (msg) => {
        setActiveMsg(msg)
        getInvoice(msg.invoiceId)
    }

    const onAdd = () => history.push(`${mainUrl}/2`)
    const handleBack = () => history.goBack()

    const handlePrint = (event) => {
        event.preventDefault();
        window.print()
    }

    return (
        <div className='manage-invoice'>
            <Header onAdd={onAdd} onClick={handleBack} hideAdd={isSMManager} />
            {
                loading ? <NoContent content={<Spinner />} />
                    : (
                        <div className='invoice-manage-content'>
                            <div className='left-panel '>
                                <ListPanel data={invoices} onSelect={handleMsgSelect} active={activeMsg} />
                            </div>
                            <div className='right-panel'>
                                <ContentPanel isLoading={isLoading} data={activeMsg} onPrint={handlePrint} />
                            </div>
                        </div >
                    )
            }
        </div >
    )
}
export default Invoices