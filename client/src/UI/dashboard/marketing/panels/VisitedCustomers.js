import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http, appApi } from '../../../../modules/http';
import StatusCard from '../../../../components/StatusCard';
import PanelHeader from '../../../../components/PanelHeader';
import { TODAYDATE as d } from '../../../../utils/constants';
import { defaultPie } from '../../../../assets/fixtures';
import CustomerOnboardCard from '../../../../components/CustomerOnboardCard';
const options = { startDate: d, endDate: d, fromStart: true }

const VisitedCustomers = () => {
    const [visitedReport, setVisitedReport] = useState([])
    const [opData, setOpData] = useState(() => options)
    const [graph, setGraph] = useState(defaultPie)
    const source = useMemo(() => appApi.CancelToken.source(), []);
    const config = { cancelToken: source.token }


    useEffect(() => {
        getVisitedCustomersReport(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getVisitedCustomersReport = async ({ startDate, endDate, fromStart, departmentId = 'All' }) => {
        const url = `reports/getVisitedCustomersReport?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}&departmentId=${departmentId}`

        try {
            const data = await http.GET(appApi, url, config)
            setVisitedReport(data)
            const graph = getPieData(data)
            setGraph(graph)
        } catch (error) { }
    }

    const handleInvoiceOp = useCallback((data) => {
        const newData = { ...opData, ...data }
        getVisitedCustomersReport(newData)
        setOpData(newData)
    }, [opData])

    const { onboardedCustomers = 0, pendingApprovals = 0, revisitCustomers = 0, visitedCustomers = 0 } = visitedReport
    return (
        <div className='visited-customers-panel'>
            <PanelHeader title='Visited Customers' onSelect={handleInvoiceOp} showShow />
            <div className='vcp__body panel-body'>
                <div className='vcp__body__left'>
                    <CustomerOnboardCard data={visitedReport} graph={graph} />
                </div>
                <div className='vcp__body__right'>
                    <StatusCard count={visitedCustomers} showViewDetails={false} title='Total Visited Customers' />
                    <StatusCard count={onboardedCustomers} showViewDetails={false} title='Onboarded Customers' />
                    <StatusCard count={pendingApprovals} showViewDetails={false} title='Approval Pending' />
                    <StatusCard count={revisitCustomers} showViewDetails={false} title='Revisit Customers' />
                </div>
            </div>
        </div>
    )
}

const getPieData = (data) => {
    const { onboardedCustomers, pendingApprovals, revisitCustomers, visitedCustomers } = data
    const totalCount = onboardedCustomers + pendingApprovals + revisitCustomers + visitedCustomers;
    const onboarded = Math.round(onboardedCustomers / (totalCount || 1) * 100)
    const visited = Math.round(visitedCustomers / (totalCount || 1) * 100)
    const pending = Math.round(pendingApprovals / (totalCount || 1) * 100)
    const revisit = Math.round(revisitCustomers / (totalCount || 1) * 100)

    const onobardedItem = {
        type: 'Onboarded',
        value: onboarded,
    }
    const visitedItem = {
        type: 'Visited',
        value: visited,
    }
    const pendingItem = {
        type: 'Pending',
        value: pending,
    }
    const revisitItem = {
        type: 'Revisit',
        value: revisit,
    }

    if (onboarded || visited || pending || revisit) {

        const data = []

        if (onboarded) data.push(onobardedItem)
        if (visited) data.push(visitedItem)
        if (pending) data.push(pendingItem)
        if (revisit) data.push(revisitItem)

        return data
    }

    return [onobardedItem, visitedItem, pendingItem, revisitItem]
}

export default VisitedCustomers