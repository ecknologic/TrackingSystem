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
                    <StatusCard count={visitedCustomers} title='Total Visited Customers' />
                    <StatusCard count={onboardedCustomers} title='Onboarded Customers' />
                    <StatusCard count={pendingApprovals} title='Approval Pending' />
                    <StatusCard count={revisitCustomers} title='Revisit Customers' />
                </div>
            </div>
        </div>
    )
}

const getPieData = ({ paidCount, totalCount }) => {
    // const cleared = Math.round(paidCount / (totalCount || 1) * 100)
    // let pending = 100 - cleared

    // if (!totalCount) pending = 0
    const corporate = 60
    const other = 15
    const membership = 25

    return [
        {
            type: 'Corporate',
            value: corporate,
        },
        {
            type: 'Other',
            value: other,
        },
        {
            type: 'Membership',
            value: membership,
        }
    ]
}

export default VisitedCustomers