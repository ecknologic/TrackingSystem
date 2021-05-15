import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http, appApi } from '../../../../modules/http';
import PanelHeader from '../../../../components/PanelHeader';
import { TODAYDATE as d } from '../../../../utils/constants';
import { dummyWaterResults } from '../../../../assets/fixtures';
import ExecutiveCard from '../../../../components/ExecutiveCard';
const options = { startDate: d, endDate: d, fromStart: true }

const ExecutiveOverview = () => {
    const [invoices, setInvoices] = useState(dummyWaterResults)
    const [opData, setOpData] = useState(() => options)
    const source = useMemo(() => appApi.CancelToken.source(), []);
    const config = { cancelToken: source.token }


    useEffect(() => {
        getInvoices(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getInvoices = async ({ startDate, endDate, fromStart, departmentId = 'All' }) => {
        const url = `invoice/getDepartmentInvoicesCount?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}&departmentId=${departmentId}`

        try {
            const data = await http.GET(appApi, url, config)
            setInvoices(data)
        } catch (error) { }
    }

    const handleInvoiceOp = useCallback((data) => {
        const newData = { ...opData, ...data }
        getInvoices(newData)
        setOpData(newData)
    }, [opData])

    return (
        <div className='executive-overview-panel'>
            <PanelHeader title='Executive Overview' onSelect={handleInvoiceOp} showShow />
            <div className='eop__body panel-body'>
                <ExecutiveCard />
                <ExecutiveCard />
                <ExecutiveCard />
                <ExecutiveCard />
                <ExecutiveCard />
                <ExecutiveCard />
            </div>
        </div>
    )
}


export default ExecutiveOverview