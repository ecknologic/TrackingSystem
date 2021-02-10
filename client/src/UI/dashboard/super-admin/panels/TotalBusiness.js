import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { http } from '../../../../modules/http';
import PanelHeader from '../../../../components/PanelHeader';
import { TODAYDATE as d } from '../../../../utils/constants';
import { dummyWaterResults } from '../../../../assets/fixtures';
import TotalRevenueCard from '../../../../components/TotalRevenueCard';
const options = { startDate: d, endDate: d, fromStart: true }

const TotalBusiness = () => {
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


    return (
        <div className='total-business-panel'>
            <div className='header'>
                <PanelHeader title='Total Business' onSelect={handleOperation} showShow />
            </div>
            <TotalRevenueCard />
        </div>
    )
}

export default TotalBusiness