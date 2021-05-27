import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http, appApi } from '../../../../modules/http';
import PanelHeader from '../../../../components/PanelHeader';
import { TODAYDATE as d } from '../../../../utils/constants';
import ExecutiveCard from '../../../../components/ExecutiveCard';
const options = { startDate: d, endDate: d, fromStart: true }

const ExecutiveOverview = () => {
    const [salesAgentDetails, setsalesAgentDetails] = useState([])
    const [opData, setOpData] = useState(() => options)
    const source = useMemo(() => appApi.CancelToken.source(), []);
    const config = { cancelToken: source.token }


    useEffect(() => {
        getEnquiriesCount(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getEnquiriesCount = async ({ startDate, endDate, fromStart }) => {
        const url = `reports/getEnquiriesCount?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}`

        try {
            const data = await http.GET(appApi, url, config)
            setsalesAgentDetails(data)
        } catch (error) { }
    }

    const handleInvoiceOp = useCallback((data) => {
        const newData = { ...opData, ...data }
        getEnquiriesCount(newData)
        setOpData(newData)
    }, [opData])

    return (
        <div className='executive-overview-panel'>
            <PanelHeader title='Executive Overview' onSelect={handleInvoiceOp} showShow />
            <div className='eop__body panel-body'>
                {
                    salesAgentDetails.map(item => <ExecutiveCard item={item} />)
                }
            </div>
        </div>
    )
}


export default ExecutiveOverview