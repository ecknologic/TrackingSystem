import axios from 'axios';
import Slider from "react-slick";
import { useHistory } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import PanelHeader from '../../../../components/PanelHeader';
import { TODAYDATE as d } from '../../../../utils/constants';
import CustomerOverviewCard from '../../../../components/CustomerOverviewCard';
import { LeftChevronIconGrey, RightChevronIconGrey } from '../../../../components/SVG_Icons';
const options = { startDate: d, endDate: d, fromStart: true }

const CustomersOverview = () => {
    const history = useHistory()
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

    const goToCustomers = () => history.push('/customers')

    return (
        <>
            <PanelHeader title='Customers Overview' onSelect={handleOperation} beginning showShow />
            <div className='panel-body quality-testing-panel'>
                <Slider className='dashboard-slider' {...props} >
                    <CustomerOverviewCard title='Corporate Customers' onClick={goToCustomers} />
                    <CustomerOverviewCard title='Other Customers' onClick={goToCustomers} />
                    <CustomerOverviewCard title='Memberships' onClick={goToCustomers} />
                    <CustomerOverviewCard title='Dealerships' onClick={goToCustomers} />
                </Slider>
            </div>
        </>
    )
}
const props = {
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: <LeftChevronIconGrey />,
    nextArrow: <RightChevronIconGrey />
}

export default CustomersOverview