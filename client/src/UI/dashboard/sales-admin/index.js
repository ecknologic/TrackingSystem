import Slider from "react-slick";
import { useHistory } from "react-router-dom";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { appApi, http } from "../../../modules/http";
import Header from '../../../components/ContentHeader';
import NormalCard from "../../../components/NormalCard";
import VisitedCustomers from './panels/VisitedCustomers';
import RevisitCustomers from './panels/RevisitCustomers';
import { TODAYDATE as d } from '../../../utils/constants';
import PendingApprovals from '../marketing/panels/PendingApprovals';
import { LeftChevronIconGrey, RightChevronIconGrey } from '../../../components/SVG_Icons';

const SalesAdminDashboard = () => {
    const history = useHistory()
    const [customerCount, setCustomerCount] = useState({})
    const [enquiriesCount, setEnquiriesCount] = useState({})
    const source = useMemo(() => appApi.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    const { onBoardedCount, pendingCount } = customerCount
    const { totalVisited, totalPendingRequests } = enquiriesCount

    useEffect(() => {
        getCustomersCount()
        getEnquiriesCount()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getCustomersCount = async () => {
        const url = `customer/getCustomersCountByStaff?startDate=${d}&endDate=${d}&fromStart=true`

        try {
            const { data } = await http.GET(appApi, url, config)
            setCustomerCount(data)
        } catch (error) { }
    }

    const getEnquiriesCount = async () => {
        const url = 'customer/getCustomerEnquiriesCount'

        try {
            const { data } = await http.GET(appApi, url, config)
            setEnquiriesCount(data)
        } catch (error) { }
    }

    const goToVisitedCustomers = useCallback(() => history.push('/visited-customers'), [])
    const goToCustomers = useCallback(() => history.push('/customers'), [])
    const goToPendingCustomers = useCallback(() => history.push('/customers/3'), [])

    return (
        <Fragment>
            <Header />
            <div className='dashboard-content'>
                <div className='panel-body quality-testing-panel pt-0'>
                    <Slider className='dashboard-slider' {...props} >
                        <NormalCard total={onBoardedCount} title='Onboarded Customers' onClick={goToCustomers} />
                        <NormalCard total={pendingCount} title='Approvals Pending' onClick={goToPendingCustomers} />
                        <NormalCard total={totalPendingRequests} title='Request Pending' onClick={goToVisitedCustomers} />
                        <NormalCard total={totalVisited} title='Total Visited Customers' onClick={goToVisitedCustomers} />
                    </Slider>
                </div>
                <div className='dashboard-content-other'>
                    <div className='left-content'>
                        <VisitedCustomers />
                        <RevisitCustomers />
                    </div>
                    <div className='right-content'>
                        <PendingApprovals />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

const props = {
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: <LeftChevronIconGrey />,
    nextArrow: <RightChevronIconGrey />
}
export default SalesAdminDashboard