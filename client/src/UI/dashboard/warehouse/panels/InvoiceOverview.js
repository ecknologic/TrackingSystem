import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useUser from '../../../../utils/hooks/useUser';
import { http, appApi } from '../../../../modules/http';
import PanelHeader from '../../../../components/PanelHeader';
import { TODAYDATE as d } from '../../../../utils/constants';
import { defaultPie } from '../../../../assets/fixtures';
import InvoiceOverviewCardSmall from '../../../../components/InvoiceOverviewCardSmall';
const options = { startDate: d, endDate: d, fromStart: true }

const InvoiceOverview = () => {
    const { WAREHOUSEID } = useUser()
    const [invoices, setInvoices] = useState([])
    const [opData, setOpData] = useState(() => options)
    const [graph, setGraph] = useState(defaultPie)
    const source = useMemo(() => appApi.CancelToken.source(), []);
    const config = { cancelToken: source.token }


    useEffect(() => {
        getInvoices(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getInvoices = async ({ startDate, endDate, fromStart }) => {
        const url = `invoice/getDepartmentInvoicesCount?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}&departmentId=${WAREHOUSEID}`

        try {
            const data = await http.GET(appApi, url, config)
            setInvoices(data)
            const graph = getPieData(data)
            setGraph(graph)
        } catch (error) { }
    }

    const handleInvoiceOp = useCallback((data) => {
        const newData = { ...opData, ...data }
        getInvoices(newData)
        setOpData(newData)
    }, [opData])

    return (
        <div className='invoice-overview-panel'>
            <div className='header'>
                <PanelHeader title='Invoice Overview' onSelect={handleInvoiceOp} showShow />
            </div>
            <InvoiceOverviewCardSmall data={invoices} graph={graph} />
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