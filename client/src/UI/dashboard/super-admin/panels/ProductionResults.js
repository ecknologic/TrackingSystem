import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import PanelStats from '../../../../components/PanelStats';
import ColumnChart from '../../../../components/ColumnChart';
import { TODAYDATE as d } from '../../../../utils/constants';
import PanelHeader from '../../../../components/PanelHeader';
import { dummyWaterResults, dummyDepOptions } from '../../../../assets/fixtures';
import DashboardResultsCard from '../../../../components/DashboardResultsCard';
const options = { startDate: d, endDate: d, fromStart: true }

const ProductionResults = () => {
    const [results, setResults] = useState(dummyWaterResults)
    const [opData, setOpData] = useState(() => options)

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getTestResults(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getTestResults = async ({ startDate, endDate, fromStart }) => {
        const url = `/motherPlant/getQCTestResults?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}`

        try {
            // const data = await http.GET(axios, url, config)
            // setResults(data)
        } catch (error) { }
    }

    const handleOperation = useCallback((data) => {
        const newData = { ...opData, ...data }
        getTestResults(newData)
        setOpData(newData)
    }, [opData])

    const Header = (
        <PanelHeader
            title='Production Results'
            onSelect={handleOperation}
            depName='Mother Plant'
            depOptions={dummyDepOptions}
            showFooter
        />
    )

    const Stats = (
        <PanelStats title='Total Production' />
    )

    const Chart = (
        <ColumnChart />
    )

    return <DashboardResultsCard
        isFirst
        Header={Header}
        Stats={Stats}
        Chart={Chart}
    />
}

export default ProductionResults