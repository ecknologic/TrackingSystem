import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { http } from '../../../../modules/http';
import PanelHeader from '../../../../components/PanelHeader';
import { TODAYDATE as d } from '../../../../utils/constants';
import { dummyWaterResults } from '../../../../assets/fixtures';
import InvoiceOverviewCard from '../../../../components/InvoiceOverviewCard';
import CustomButton from '../../../../components/CustomButton';
import { RightChevronIconLight } from '../../../../components/SVG_Icons';
const options = { startDate: d, endDate: d, fromStart: true }

const InvoiceOverview = () => {
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

    const handleClick = () => { }

    return (
        <div className='invoice-overview-panel'>
            <div className='header'>
                <PanelHeader title='Invoice Overview' onSelect={handleOperation} showShow />
            </div>
            <InvoiceOverviewCard />
            <div className='second-header'>
                <PanelHeader title='Invoice Overview' onSelect={handleOperation} showShow />
            </div>
            <div className='second-overview-card'>
                <div className='heading'>
                    <span className='title'>Renewal Memberships</span>
                    <span className='red-num'>50</span>
                </div>
                <div className='stat'>
                    <span className='title'>Expired Memberships</span>
                    <span className='number'>192</span>
                </div>
                <CustomButton
                    text='View Details'
                    className='app-view-btn'
                    onClick={handleClick}
                    suffix={<RightChevronIconLight className='chev' />}
                />
            </div>
        </div>
    )
}

export default InvoiceOverview