import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http, appApi } from '../../../../modules/http';
import StatusCard from '../../../../components/StatusCard';
import PanelHeader from '../../../../components/PanelHeader';
import { TODAYDATE as d } from '../../../../utils/constants';
import { defaultPie, dummyWaterResults } from '../../../../assets/fixtures';
import CustomerOnboardCard from '../../../../components/CustomerOnboardCard';
const options = { startDate: d, endDate: d, fromStart: true }

const VisitedCustomers = () => {
    const [invoices, setInvoices] = useState(dummyWaterResults)
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

    const getInvoices = async ({ startDate, endDate, fromStart, departmentId = 'All' }) => {
        const url = `invoice/getDepartmentInvoicesCount?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}&departmentId=${departmentId}`

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
        <div className='visited-customers-panel'>
            <PanelHeader title='Visited Customers' onSelect={handleInvoiceOp} showShow />
            <div className='vcp__body panel-body'>
                <div className='vcp__body__left'>
                    <CustomerOnboardCard data={invoices} graph={graph} />
                </div>
                <div className='vcp__body__right'>
                    <StatusCard count={443} title='Onboarded Customers' />
                    <StatusCard count={54} title='Approvals Pending' />
                    <StatusCard count={23} title='Requests Pending' />
                    <StatusCard count={933} title='Inactive Customers' />
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