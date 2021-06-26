import axios from 'axios';
import { useHistory } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import PanelHeader from '../../../../components/PanelHeader';
import { TODAYDATE as d } from '../../../../utils/constants';
import InvoiceCard from '../../../../components/InvoiceCard';
const options = { startDate: d, endDate: d, fromStart: true, type: 'Till Now' }

const InvoiceOverview = ({ showHeader }) => {
    const history = useHistory()
    const [TPA, setTPA] = useState(0)
    const [IA, setIA] = useState({})
    const [CA, setCA] = useState(0)
    const [DA, setDA] = useState({})
    const [opData, setOpData] = useState(() => options)
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    const { prevInvoiceAmount, invoicePercent, invoiceCompareText } = IA
    const { previousMonthAmount, currentMonthAmount, depositPercent, depositCompareText } = DA

    useEffect(() => {
        getTPA(opData)
        getIA(opData)
        getCA(opData)
        getDA(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])


    const getTPA = async ({ startDate, endDate, fromStart }) => {
        const url = `invoice/getTotalPendingAmount?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}`

        try {
            const data = await http.GET(axios, url, config)
            setTPA(data)
        } catch (error) { }
    }

    const getIA = async ({ startDate, endDate, fromStart, type }) => {
        const url = `invoice/getPreviousInvoiceAmount?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}&type=${type}`

        try {
            const data = await http.GET(axios, url, config)
            setIA(data)
        } catch (error) { }
    }

    const getCA = async ({ startDate, endDate, fromStart }) => {
        const url = `invoice/getReceivedInvoiceAmount?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}`

        try {
            const data = await http.GET(axios, url, config)
            setCA(data)
        } catch (error) { }
    }

    const getDA = async ({ startDate, endDate, fromStart, type }) => {
        const url = `customer/getTotalDepositAmount?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}&type=${type}`

        try {
            const data = await http.GET(axios, url, config)
            setDA(data)
        } catch (error) { }
    }

    const handleOperation = useCallback((data) => {
        const newData = { ...opData, ...data }
        getTPA(newData)
        getIA(newData)
        getCA(newData)
        getDA(newData)
        setOpData(newData)
    }, [opData])

    const goToInvoices = useCallback(() => history.push('/invoices'), [])

    return (
        <div className='invoice-overview-panel'>
            {
                showHeader &&
                (
                    <div className='header'>
                        <PanelHeader title='Invoice Overview' onSelect={handleOperation} showShow />
                    </div>
                )
            }
            <div className='panel-body pb-0'>
                <div className='panel-details'>
                    <InvoiceCard title='Total Pending Amount' amount={TPA} onClick={goToInvoices} />
                    <InvoiceCard title='Invoice Amount' showPercent text={invoiceCompareText} amount={prevInvoiceAmount} percent={invoicePercent} onClick={goToInvoices} />
                    <InvoiceCard title='Collected Amount' amount={CA} onClick={goToInvoices} />
                    <InvoiceCard title='Deposit Amount' showPercent text={depositCompareText} amount={currentMonthAmount} percent={depositPercent} onClick={goToInvoices} />
                </div>
            </div>
        </div>
    )
}

const Thumb = (props) => <div {...props} className="thumb-vertical" />
export default InvoiceOverview