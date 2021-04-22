import axios from 'axios';
import Slider from "react-slick";
import { useHistory } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import PanelHeader from '../../../../components/PanelHeader';
import { TODAYDATE as d } from '../../../../utils/constants';
import CustomerOverviewCard from '../../../../components/CustomerOverviewCard';
import { LeftChevronIconGrey, RightChevronIconGrey } from '../../../../components/SVG_Icons';
const options = { startDate: d, endDate: d, fromStart: true, type: 'Till Now' }

const CustomersOverview = () => {
    const history = useHistory()
    const [opData, setOpData] = useState(() => options)
    const [active, setActive] = useState({})
    const [inactive, setInactive] = useState({})

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }
    const { totalCustomers, corporateCustomersPercent, corporateCustomersCompareText, totalActiveCustomers,
        individualCustomersPercent, individualCustomersCompareText, totalCorporateCustomers, totalIndividualCustomers } = active
    const { distributorsPercent, totalInactiveCustomers, distributorsCompareText, pendingIndividualCustomers,
        totalDistributors, pendingCorporateCustomers } = inactive

    useEffect(() => {
        getActiveData(opData)
        getInactiveData(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getActiveData = async ({ startDate, endDate, fromStart, type }) => {
        const url = `customer/getActiveCustomersCount?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}&type=${type}`

        try {
            const data = await http.GET(axios, url, config)
            setActive(data)
        } catch (error) { }
    }

    const getInactiveData = async ({ startDate, endDate, fromStart, type }) => {
        const url = `customer/getInactiveCustomersCount?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}&type=${type}`

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

    const goToCustomers = (active) => history.push(`/customers/${active}`)
    const goToDistributors = () => history.push('/distributors')

    return (
        <>
            <div className='total-customer-panel'>
                <div className='heading'>
                    <span className='title'>Total Customers</span>
                    <span className='number'>{totalCustomers || 0}</span>
                </div>
                <div className='sub-title green'>Active Customers  {totalCustomers - totalInactiveCustomers || 0}</div>
                <div className='sub-title'>Inactive Customers  {totalInactiveCustomers || 0}</div>
            </div>
            <PanelHeader title='Customers Overview' onSelect={handleOperation} showShow />
            <div className='panel-body quality-testing-panel'>
                <Slider className='dashboard-slider' {...props} >
                    <CustomerOverviewCard compareText={corporateCustomersCompareText} percent={corporateCustomersPercent} total={totalCorporateCustomers} pending={pendingCorporateCustomers} title='Corporate Customers' onClick={() => goToCustomers('1')} />
                    <CustomerOverviewCard compareText={individualCustomersCompareText} total={totalIndividualCustomers} pending={pendingIndividualCustomers} percent={individualCustomersPercent} title='Individual Customers' onClick={() => goToCustomers('2')} />
                    <CustomerOverviewCard title='Memberships' onClick={() => { }} />
                    <CustomerOverviewCard compareText={distributorsCompareText} percent={distributorsPercent} total={totalDistributors} title='Dealerships' onClick={goToDistributors} />
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