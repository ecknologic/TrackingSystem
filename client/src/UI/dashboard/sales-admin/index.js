import Slider from "react-slick";
import React, { Fragment } from 'react';
import Header from '../../../components/ContentHeader';
import VisitedCustomers from './panels/VisitedCustomers';
import NormalCard from "../../../components/NormalCard";
import UpcomingCustomers from './panels/UpcomingCustomers';
import PendingApprovals from '../marketing/panels/PendingApprovals';
import { LeftChevronIconGrey, RightChevronIconGrey } from '../../../components/SVG_Icons';

const SalesAdminDashboard = () => {

    const { totalCorporateCustomers, totalIndividualCustomers, totalInactiveCustomers, totalDistributors } = {}

    return (
        <Fragment>
            <Header />
            <div className='dashboard-content'>
                <div className='panel-body quality-testing-panel pt-0'>
                    <Slider className='dashboard-slider' {...props} >
                        <NormalCard total={totalCorporateCustomers} title='Onboarded Customers' onClick={() => { }} />
                        <NormalCard total={totalIndividualCustomers} title='Approvals Pending' onClick={() => { }} />
                        <NormalCard total={totalInactiveCustomers} title='Request Pending' onClick={() => { }} />
                        <NormalCard total={totalDistributors} title='Total Visited Customers' onClick={() => { }} />
                    </Slider>
                </div>
                <div className='dashboard-content-other'>
                    <div className='left-content'>
                        <VisitedCustomers />
                        <UpcomingCustomers />
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