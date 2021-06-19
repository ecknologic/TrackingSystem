import { Empty } from 'antd';
import Slider from "react-slick";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Spinner from '../../../../components/Spinner';
import { isEmpty } from "../../../../utils/Functions";
import { http, appApi } from '../../../../modules/http';
import NoContent from '../../../../components/NoContent';
import PanelHeader from '../../../../components/PanelHeader';
import { TODAYDATE as d } from '../../../../utils/constants';
import RevisitCard from '../../../../components/RevisitCard';
import { LeftChevronIconGrey, RightChevronIconGrey } from '../../../../components/SVG_Icons';
const options = { startDate: d, endDate: d, fromStart: true }

const RevisitCustomers = () => {
    const [customers, setCustomers] = useState([])
    const [opData, setOpData] = useState(() => options)
    const [loading, setLoading] = useState(true)
    const source = useMemo(() => appApi.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getEnquiriesCount(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getEnquiriesCount = async () => {
        const url = 'customer/getRevisitCustomers'

        try {
            const { data } = await http.GET(appApi, url, config)
            setLoading(false)
            setCustomers(data)
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
            <PanelHeader title='Revisit Customers' onSelect={handleInvoiceOp} />
            <div className='panel-body'>
                {
                    loading ? <NoContent content={<Spinner />} />
                        : isEmpty(customers) ? <NoContent content={<Empty />} />
                            : <Slider className='dashboard-slider' {...props} >
                                {
                                    customers.map((item) => <RevisitCard data={item} />)
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
export default RevisitCustomers