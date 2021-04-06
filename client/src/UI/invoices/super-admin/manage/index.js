import axios from 'axios';
import { http } from '../../../../modules/http';
import { useHistory, useLocation } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import Header from './header';
import ListPanel from './panels/ListPanel';
import ContentPanel from './panels/ContentPanel';
import Spinner from '../../../../components/Spinner'
import NoContent from '../../../../components/NoContent'
import { getMainPathname } from '../../../../utils/Functions';
import { getRole, getWarehoseId, SUPERADMIN } from '../../../../utils/constants';
import '../../../../sass/invoices.scss';

const Invoices = () => {
    const history = useHistory()
    const { state, pathname } = useLocation()
    const [loading, setLoading] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [invoices, setInvoices] = useState([])
    const [activeMsg, setActiveMsg] = useState(state ? state.invoice : {})

    const mainUrl = useMemo(() => getMainPathname(pathname), [pathname])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        state && getInvoice(state.invoice.invoiceId)
        getInvoices()
    }, [])

    const getInvoice = async (id) => {
        const depId = getWarehoseId()
        const url = `/invoice/getInvoiceById/${id}?departmentId=${depId}`

        try {
            setIsLoading(true)
            const data = await http.GET(axios, url, config)
            setActiveMsg(data)
            setIsLoading(false)
        } catch (error) { }
    }

    const getInvoices = async () => {
        const { FOR } = state || {}

        let url = '/invoice/getDepartmentInvoices'
        if (FOR === SUPERADMIN) {
            url = '/invoice/getInvoices'
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
    const handleBack = () => history.push(`${mainUrl}`)

    const handlePrint = (event, pdf) => {
        event.preventDefault();
        // window.open(pdf, "PRINT", "height=400,width=600");
        window.print()

    }

    return (
        <div className='manage-invoice'>
            <Header onAdd={onAdd} onClick={handleBack} />
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