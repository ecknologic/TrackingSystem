import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import PanelStats from '../../../../components/PanelStats';
import ColumnChart from '../../../../components/ColumnChart';
import { TODAYDATE as d } from '../../../../utils/constants';
import PanelHeader from '../../../../components/PanelHeader';
import { defaultBars } from '../../../../assets/fixtures';
import DashboardResultsCard from '../../../../components/DashboardResultsCard';

const SalesResults = ({ depOptions }) => {
    const options = { startDate: d, endDate: d, departmentId: 'All', fromStart: true, type: 'Till Now' }
    const [results, setResults] = useState({})
    const [graph, setGraph] = useState(defaultBars)
    const [columnWidthRatio, setColumnWidthRatio] = useState()
    const [opData, setOpData] = useState(() => options)

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getResults(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getResults = async ({ startDate, endDate, departmentId, fromStart, type }) => {
        const url = `warehouse/getTotalSales?startDate=${startDate}&endDate=${endDate}&departmentId=${departmentId}&fromStart=${fromStart}&type=${type}`

        try {
            const { graph = [], ...rest } = await http.GET(axios, url, config)
            setResults(rest)
            setGraph(graph)
            if (type !== 'This Week') setColumnWidthRatio(1)
            else setColumnWidthRatio()
        } catch (error) { }
    }

    const handleOperation = useCallback((data) => {
        const newData = { ...opData, ...data }
        getResults(newData)
        setOpData(newData)
    }, [opData])

    const Header = (
        <PanelHeader
            title='Sales Results'
            onSelect={handleOperation}
            depOptions={depOptions}
            depName='Warehouse'
            initTime='Till Now'
            showFooter
        />
    )

    const Stats = (
        <PanelStats title='Total Sales' data={results} />
    )

    const Chart = (
        <ColumnChart data={graph} columnWidthRatio={columnWidthRatio} />
    )

    return <DashboardResultsCard Header={Header} Stats={Stats} Chart={Chart} />
}

export default SalesResults