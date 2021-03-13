import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { http } from '../../../../modules/http';
import PanelHeader from '../../../../components/PanelHeader';
import { TODAYDATE as d } from '../../../../utils/constants';
import { defaultPie, dummyWaterResults } from '../../../../assets/fixtures';
import InvoiceOverviewCardSmall from '../../../../components/InvoiceOverviewCardSmall';
const options = { startDate: d, endDate: d, fromStart: true }

const InvoiceOverview = () => {
    const [results, setResults] = useState(dummyWaterResults)
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

    const getTestResults = async () => {
        const url = '/invoice/getTotalInvoicesCount'

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

    return (
        <div className='invoice-overview-panel'>
            <div className='header'>
                <PanelHeader title='Invoice Overview' onSelect={handleInvoiceOp} showShow />
            </div>
            <InvoiceOverviewCardSmall data={results} graph={graph} />
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

export default InvoiceOverview