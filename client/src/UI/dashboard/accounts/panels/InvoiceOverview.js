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

const InvoiceOverview = () => {
    const { ROLE } = useUser()
    const history = useHistory()
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [TPA, setTPA] = useState({})
    const [opData, setOpData] = useState(() => options)
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    const { TPACompareText, IACompareText, CACompareText, DACompareText, TPAPercent, IAPercent,
        CAPercent, DAPercent, TPAAmount, IAAmount, CAAmount, DAAmount } = TPA

    useEffect(() => {
        getTPA(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])


    const getTPA = async ({ startDate, endDate, fromStart }) => {
        const url = `invoice/getTotalPendingAmount?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}`

        try {
            const data = await http.GET(axios, url, config)
            console.log('data>>>', data)
            setTPA(data)
            setLoading(false)
        } catch (error) { }
    }

    const handleOperation = useCallback((data) => {
        const newData = { ...opData, ...data }
        setLoading(true)
        getTPA(newData)
        setOpData(newData)
    }, [opData])

    const goToInvoices = useCallback(() => history.push('/invoices'), [])

    return (
        <div className='invoice-overview-panel'>
            <div className='header'>
                <PanelHeader title='Invoice Overview' onSelect={handleOperation} showShow />
            </div>
            <div className='panel-body pb-0'>
                <div className='panel-details'>
                    <InvoiceCard title='Total Pending Amount' text={TPACompareText} amount={TPAAmount} percent={TPAPercent} onClick={goToInvoices} />
                    <InvoiceCard title='Invoice Amount' text={IACompareText} amount={IAAmount} percent={IAPercent} onClick={goToInvoices} />
                    <InvoiceCard title='Collected Amount' text={CACompareText} amount={CAAmount} percent={CAPercent} onClick={goToInvoices} />
                    <InvoiceCard title='Deposit Amount' text={DACompareText} amount={DAAmount} percent={DAPercent} onClick={goToInvoices} />
                </div>
            </div>
        </div>
    )
}

const Thumb = (props) => <div {...props} className="thumb-vertical" />
export default InvoiceOverview