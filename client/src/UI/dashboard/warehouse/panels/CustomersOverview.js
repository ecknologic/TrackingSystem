import Slider from "react-slick";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http, appApi } from '../../../../modules/http';
import PanelHeader from '../../../../components/PanelHeader';
import { TODAYDATE as d } from '../../../../utils/constants';
import CustomerOverviewCard from '../../../../components/CustomerOverviewCard';
import { LeftChevronIconGrey, RightChevronIconGrey } from '../../../../components/SVG_Icons';
const options = { startDate: d, endDate: d, fromStart: true, type: 'Till Now' }

const CustomersOverview = () => {
    const [opData, setOpData] = useState(() => options)
    const [active, setActive] = useState({})

    const source = useMemo(() => appApi.CancelToken.source(), []);
    const config = { cancelToken: source.token }
    const { totalCustomers, corporateCustomersPercent, corporateCustomersCompareText, individualCustomersPercent, individualCustomersCompareText, totalCorporateCustomers, totalIndividualCustomers, totalInactiveCustomers } = active

    useEffect(() => {
        getActiveData(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getActiveData = async ({ startDate, endDate, fromStart, type }) => {
        const url = `warehouse/getCustomersCount?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}&type=${type}`

        try {
            const data = await http.GET(appApi, url, config)
            setActive(data)
        } catch (error) { }
    }

    const handleOperation = useCallback((data) => {
        const newData = { ...opData, ...data }
        getActiveData(newData)
        setOpData(newData)
    }, [opData])

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
            <PanelHeader title='Customers Overview' onSelect={handleOperation} showShow hideReports />
            <div className='panel-body quality-testing-panel'>
                <Slider className='dashboard-slider' {...props} >
                    <CustomerOverviewCard isWHAdmin compareText={corporateCustomersCompareText} percent={corporateCustomersPercent} total={totalCorporateCustomers} title='Corporate Customers' />
                    <CustomerOverviewCard isWHAdmin compareText={individualCustomersCompareText} total={totalIndividualCustomers} percent={individualCustomersPercent} title='Individual Customers' />
                    <CustomerOverviewCard isWHAdmin title='Memberships' onClick={() => { }} />
                </Slider>
            </div>
        </>
    )
}
const props = {
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <LeftChevronIconGrey />,
    nextArrow: <RightChevronIconGrey />
}

export default CustomersOverview