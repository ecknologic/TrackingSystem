import { Empty } from 'antd';
import Slider from "react-slick";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isEmpty } from "../../../../utils/Functions";
import { http, appApi } from '../../../../modules/http';
import NoContent from '../../../../components/NoContent';
import PanelHeader from '../../../../components/PanelHeader';
import { TODAYDATE as d } from '../../../../utils/constants';
import { LeftChevronIconGrey, RightChevronIconGrey } from '../../../../components/SVG_Icons';
import RevisitCard from '../../../../components/RevisitCard';
const options = { startDate: d, endDate: d, fromStart: true }

const UpcomingCustomers = () => {
    const [salesAgentDetails, setsalesAgentDetails] = useState([])
    const [opData, setOpData] = useState(() => options)
    const [loading, setLoading] = useState(true)
    const source = useMemo(() => appApi.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    const { totalCorporateCustomers } = {}


    useEffect(() => {
        getEnquiriesCount(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getEnquiriesCount = async ({ startDate, endDate, fromStart }) => {
        const url = `reports/getEnquiriesCount?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}`

        try {
            const data = await http.GET(appApi, url, config)
            setLoading(false)
            setsalesAgentDetails(data)
        } catch (error) { }
    }

    const handleInvoiceOp = useCallback((data) => {
        const newData = { ...opData, ...data }
        setLoading(true)
        getEnquiriesCount(newData)
        setOpData(newData)
    }, [opData])

    return (
        <div className='executive-overview-panel'>
            <PanelHeader title='Upcoming Customers' onSelect={handleInvoiceOp} />
            <div className='panel-body'>
                {
                    isEmpty(salesAgentDetails) ? <NoContent content={<Empty />} />
                        : <Slider className='dashboard-slider' {...props} >
                            {
                                salesAgentDetails.map((item) => <RevisitCard total={totalCorporateCustomers} title='Onboarded Customers' onClick={() => { }} />)
                            }
                        </Slider>
                }
            </div>
        </div>
    )
}
const props = {
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <LeftChevronIconGrey />,
    nextArrow: <RightChevronIconGrey />
}
export default UpcomingCustomers