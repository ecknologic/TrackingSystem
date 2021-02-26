import axios from 'axios';
import { http } from '../../../modules/http';
import { useHistory, useLocation } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import Header from './header';
import ListPanel from './panels/ListPanel';
import NoContent from '../../../components/NoContent'
import Spinner from '../../../components/Spinner'
import ContentPanel from './panels/ContentPanel';
import '../../../sass/invoices.scss';

const Invoices = () => {
    const history = useHistory()
    const { state } = useLocation()
    const [loading, setLoading] = useState(true)
    const [invoices, setInvoices] = useState([])
    const [activeMsg, setActiveMsg] = useState(state ? state.invoice : {})

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getInvoices()
    }, [])

    const getInvoices = async () => {
        const url = `/invoice/getInvoices/Paid`

        try {
            setLoading(true)
            const data = await http.GET(axios, url, config)
            setInvoices(data)
            setLoading(false)
        } catch (error) { }
    }

    const handleMsgSelect = (msg) => {
        setActiveMsg(msg)
    }

    const onAdd = () => history.push('/invoices/2')
    const onEdit = (id) => history.push(`/invoices/edit/${id}`)
    const handleBack = () => history.push('/invoices')

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
                                <ContentPanel data={activeMsg} onEdit={onEdit} />
                            </div>
                        </div >
                    )
            }
        </div >
    )
}
export default Invoices