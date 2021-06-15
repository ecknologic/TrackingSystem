import axios from 'axios';
import { Empty } from 'antd';
import { useHistory } from 'react-router-dom';
import Scrollbars from 'react-custom-scrollbars-2';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import useUser from '../../../../utils/hooks/useUser';
import { isEmpty } from '../../../../utils/Functions';
import NoContent from '../../../../components/NoContent';
import PanelHeader from '../../../../components/PanelHeader';
import { TODAYDATE as d } from '../../../../utils/constants';
import CustomButton from '../../../../components/CustomButton';
import InvoiceCard from '../../../../components/InvoiceCard';
import { RightChevronIconLight } from '../../../../components/SVG_Icons';
const options = { startDate: d, endDate: d, fromStart: true }

const UnclearedInvoiceOverview = () => {
    const { ROLE } = useUser()
    const history = useHistory()
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [results, setResults] = useState([])
    const [opData, setOpData] = useState(() => options)
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }


    useEffect(() => {
        getUnclearedInvoices(opData)
        getCount(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getCount = async ({ startDate, endDate, fromStart }) => {
        const url = `invoice/getUnclearedInvoices/count?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}`

        try {
            const data = await http.GET(axios, url, config)
            setCount(data)
        } catch (error) { }
    }

    const getUnclearedInvoices = async ({ startDate, endDate, fromStart }) => {
        const url = `invoice/getUnclearedInvoices?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}&limit=5`

        try {
            const data = await http.GET(axios, url, config)
            setResults(data)
            setLoading(false)
        } catch (error) { }
    }

    const handleOperation = useCallback((data) => {
        const newData = { ...opData, ...data }
        setLoading(true)
        getCount(newData)
        getUnclearedInvoices(newData)
        setOpData(newData)
    }, [opData])

    const goToInvoice = useCallback((invoiceId) => history.push('/invoices/manage', { invoice: { invoiceId }, FOR: ROLE }), [])
    const goToInvoices = useCallback(() => history.push('/invoices'), [])

    return (
        <div className='invoice-overview-panel'>
            <div className='header'>
                <PanelHeader title={`Pending Invoices ${count}`} onSelect={handleOperation} showShow />
            </div>
            <div className='todays-orders-panel uncleared-invoices-panel'>
                <div className='panel-header'>
                    <div className='head-container'>
                        <div className='head'>
                            <CustomButton
                                text='View All'
                                onClick={goToInvoices}
                                className='app-btn app-view-btn'
                                suffix={<RightChevronIconLight className='chev' />}
                            />
                        </div>
                    </div>
                </div>
                <div className='panel-body pb-0'>
                    {
                        loading ? <NoContent content={<Spinner />} />
                            : isEmpty(results) ? <NoContent content={<Empty />} />
                                : (
                                    <Scrollbars renderThumbVertical={Thumb}>
                                        <div className='panel-details-scroll'>
                                            <div className='panel-details'>
                                                {
                                                    results.map((item) => <InvoiceCard key={item.invoiceId} data={item} onClick={goToInvoice} />)
                                                }
                                            </div>
                                        </div>
                                    </Scrollbars>
                                )
                    }
                </div>
            </div>
        </div>
    )
}

const Thumb = (props) => <div {...props} className="thumb-vertical" />
export default UnclearedInvoiceOverview