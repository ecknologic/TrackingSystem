import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { http } from '../../../../modules/http';
import PanelHeader from '../../../../components/PanelHeader';
import { TODAYDATE as d } from '../../../../utils/constants';
import { defaultPie } from '../../../../assets/fixtures';
import InvoiceOverviewCard from '../../../../components/InvoiceOverviewCard';
import { RightChevronIconLight } from '../../../../components/SVG_Icons';
import CustomButton from '../../../../components/CustomButton';
const options = { startDate: d, endDate: d, fromStart: true }

const GeneratedInvoiceOverview = () => {
    const [results, setResults] = useState([])
    const [opData, setOpData] = useState(() => options)
    const [graph, setGraph] = useState(defaultPie)
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }


    useEffect(() => {
        getTestResults(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getTestResults = async ({ startDate, endDate, fromStart }) => {
        const url = `invoice/getTotalInvoicesCount?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}`

        try {
            const data = await http.GET(axios, url, config)
            setResults(data)
            const graph = getPieData(data)
            setGraph(graph)
        } catch (error) { }
    }

    const handleInvoiceOp = useCallback((data) => {
        const newData = { ...opData, ...data }
        getTestResults(newData)
        setOpData(newData)
    }, [opData])

    const handleMembershipOp = useCallback((data) => {
        // const newData = { ...opData, ...data }
        // getTestResults(newData)
        // setOpData(newData)
    }, [opData])

    const handleClick = () => { }

    return (
        <div className='invoice-overview-panel mr-1'>
            <InvoiceOverviewCard className='generated-invoice-overview' data={results} graph={graph} />
            <div className='second-header'>
                <PanelHeader title='Memberships' onSelect={handleMembershipOp} showShow />
            </div>
            <div className='second-overview-card'>
                <div className='heading'>
                    <span className='title'>Renewal Memberships</span>
                    <span className='red-num'>50</span>
                </div>
                <div className='stat'>
                    <span className='title'>Expired Memberships</span>
                    <span className='number'>192</span>
                </div>
                <CustomButton
                    text='View Details'
                    className='app-view-btn'
                    onClick={handleClick}
                    suffix={<RightChevronIconLight className='chev' />}
                />
            </div>
        </div>
    )
}

const getPieData = ({ paidCount, totalCount }) => {
    const cleared = Math.round(paidCount / (totalCount || 1) * 100)
    let pending = 100 - cleared

    if (!totalCount) pending = 0

    return [
        {
            type: 'Cleared',
            value: cleared,
        },
        {
            type: 'Pending',
            value: pending,
        }
    ]
}

export default GeneratedInvoiceOverview