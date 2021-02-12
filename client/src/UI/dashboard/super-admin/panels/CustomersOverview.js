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
    const [active, setActive] = useState({})
    const [inactive, setInactive] = useState({})

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }
    const { totalActiveCustomers, totalCorporateCustomers, totalOtherCustomers } = active
    const { totalInactiveCustomers, pendingCorporateCustomers, pendingOtherCustomers, totalDistributors } = inactive

    useEffect(() => {
        getActiveData(opData)
        getInactiveData(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getActiveData = async ({ startDate, endDate, fromStart }) => {
        const url = `/customer/getActiveCustomersCount?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}`

        try {
            const data = await http.GET(axios, url, config)
            setActive(data)
        } catch (error) { }
    }

    const getInactiveData = async ({ startDate, endDate, fromStart }) => {
        const url = `/customer/getInactiveCustomersCount?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}`

        try {
            const data = await http.GET(axios, url, config)
            setInactive(data)
        } catch (error) { }
    }

    const handleOperation = useCallback((data) => {
        const newData = { ...opData, ...data }
        getActiveData(newData)
        getInactiveData(newData)
        setOpData(newData)
    }, [opData])

    const goToCustomers = () => history.push('/customers')

    return (
        <>
            <PanelHeader title='Customers Overview' onSelect={handleOperation} beginning showShow />
            <div className='panel-body quality-testing-panel'>
                <Slider className='dashboard-slider' {...props} >
                    <CustomerOverviewCard total={totalActiveCustomers} title='Active Customers' onClick={goToCustomers} />
                    <CustomerOverviewCard total={totalInactiveCustomers} title='Inactive Customers' onClick={goToCustomers} />
                    <CustomerOverviewCard total={totalCorporateCustomers} pending={pendingCorporateCustomers} title='Corporate Customers' onClick={goToCustomers} />
                    <CustomerOverviewCard total={totalOtherCustomers} pending={pendingOtherCustomers} title='Other Customers' onClick={goToCustomers} />
                    <CustomerOverviewCard title='Memberships' onClick={goToCustomers} />
                    <CustomerOverviewCard total={totalDistributors} title='Dealerships' onClick={goToCustomers} />
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