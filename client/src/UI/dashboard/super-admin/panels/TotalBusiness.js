import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import PanelHeader from '../../../../components/PanelHeader';
import { TODAYDATE as d } from '../../../../utils/constants';
import TotalRevenueCard from '../../../../components/TotalRevenueCard';
const options = { startDate: d, endDate: d, fromStart: true, type: 'Today' }

const TotalBusiness = () => {
    const [business, setBusiness] = useState([])
    const [opData, setOpData] = useState(() => options)

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getTotalBusiness(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getTotalBusiness = async ({ startDate, endDate, fromStart, type }) => {
        const url = `/motherPlant/getTotalRevenue?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}&type=${type}`

        try {
            const data = await http.GET(axios, url, config)
            setBusiness(data)
        } catch (error) { }
    }

    const handleOperation = useCallback((data) => {
        const newData = { ...opData, ...data }
        getTotalBusiness(newData)
        setOpData(newData)
    }, [opData])


    return (
        <div className='total-business-panel'>
            <div className='header'>
                <PanelHeader title='Total Business' onSelect={handleOperation} showShow beginning />
            </div>
            <TotalRevenueCard data={business} />
        </div>
    )
}

export default TotalBusiness