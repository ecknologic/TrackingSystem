import dayjs from 'dayjs';
import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import PanelStats from '../../../../components/PanelStats';
import ColumnChart from '../../../../components/ColumnChart';
import { TODAYDATE as d } from '../../../../utils/constants';
import PanelHeader from '../../../../components/PanelHeader';
import DashboardResultsCard from '../../../../components/DashboardResultsCard';
const APIDATEFORMAT = 'YYYY-MM-DD'

const ProductionResults = ({ depOptions }) => {
    const startDate = useMemo(() => dayjs().weekday(1).format(APIDATEFORMAT), [])
    const options = { startDate, endDate: d, departmentId: 'All' }
    const [results, setResults] = useState({})
    const [opData, setOpData] = useState(() => options)

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getResults(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getResults = async ({ startDate, endDate, departmentId }) => {
        const url = `/motherPlant/getTotalProduction?startDate=${startDate}&endDate=${endDate}&departmentId=${departmentId}`

        try {
            const data = await http.GET(axios, url, config)
            setResults(data)
        } catch (error) { }
    }

    const handleOperation = useCallback((data) => {
        const newData = { ...opData, ...data }
        getResults(newData)
        setOpData(newData)
    }, [opData])

    const Header = (
        <PanelHeader
            title='Production Results'
            onSelect={handleOperation}
            depName='Mother Plant'
            depOptions={depOptions}
            initTime='This Week'
            showFooter
        />
    )

    const Stats = (
        <PanelStats title='Total Production' data={results} />
    )

    const Chart = (
        <ColumnChart />
    )

    return <DashboardResultsCard isFirst Header={Header} Stats={Stats} Chart={Chart} />
}

export default ProductionResults