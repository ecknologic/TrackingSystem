import axios from 'axios';
import { Empty } from 'antd';
import { useHistory } from 'react-router-dom';
import Scrollbars from 'react-custom-scrollbars-2';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import { isEmpty } from '../../../../utils/Functions';
import NoContent from '../../../../components/NoContent';
import DCView from '../../../accounts/view/views/DCView';
import PanelHeader from '../../../../components/PanelHeader';
import { TODAYDATE as d } from '../../../../utils/constants';
import CustomButton from '../../../../components/CustomButton';
import CustomModal from '../../../../components/CustomModal';
import InvoiceCard from '../../../../components/InvoiceCard';
import { RightChevronIconLight } from '../../../../components/SVG_Icons';
const options = { startDate: d, endDate: d, fromStart: true }

const UnclearedInvoiceOverview = () => {
    const history = useHistory()
    const [loading, setLoading] = useState(true)
    const [results, setResults] = useState([{
        "customerOrderId": 61,
        "deliveryLocation": "MG Road (James Street)",
        "contactPerson": "Rajesh",
        "EmailId": "bigc@gmail.com",
        "existingCustomerId": 14,
        "distributorId": null,
        "creationType": "auto",
        "customerType": "internal",
        "customerName": "Bigc Mobiles",
        "phoneNumber": 8521442225,
        "address": "Image Gardens, Madhapur",
        "routeId": 1,
        "driverId": null,
        "isDelivered": "Inprogress",
        "dcNo": "DC-61",
        "product20L": 10,
        "product1L": 10,
        "product500ML": 0,
        "product300ML": 0,
        "product2L": 5,
        "price20L": 45.5,
        "price2L": 25.2,
        "price1L": 18.2,
        "price500ML": 0,
        "price300ML": 0,
        "RouteId": 1,
        "RouteName": "Sangareddy-Choutuppal",
        "RouteDescription": "Sangareddy",
        "departmentId": 2,
        "createdDateTime": "2021-06-03T23:12:21.000Z",
        "deleted": 0,
        "driverName": null,
        "mobileNumber": null
    },
    {
        "customerOrderId": 60,
        "deliveryLocation": "Bharat Nagar",
        "contactPerson": "Achyuth",
        "EmailId": "ach@gmail.com",
        "existingCustomerId": 13,
        "distributorId": null,
        "creationType": "auto",
        "customerType": "internal",
        "customerName": "Achyuth",
        "phoneNumber": 8942144122,
        "address": "Near Kavuri hills, Madhapur, HYD",
        "routeId": 2,
        "driverId": null,
        "isDelivered": "Inprogress",
        "dcNo": "DC-60",
        "product20L": 10,
        "product1L": 0,
        "product500ML": 0,
        "product300ML": 0,
        "product2L": 10,
        "price20L": 43.25,
        "price2L": 25.25,
        "price1L": 0,
        "price500ML": 0,
        "price300ML": 0,
        "RouteId": 2,
        "RouteName": "CHoutupal-sangareddy",
        "RouteDescription": "sangareddy",
        "departmentId": 2,
        "createdDateTime": "2021-06-03T23:12:38.000Z",
        "deleted": 0,
        "driverName": null,
        "mobileNumber": null
    },
    {
        "customerOrderId": 59,
        "deliveryLocation": "Ameerpet",
        "contactPerson": "New Individual",
        "EmailId": "newI@gmail.com",
        "existingCustomerId": 12,
        "distributorId": null,
        "creationType": "auto",
        "customerType": "internal",
        "customerName": "New Individual",
        "phoneNumber": 9696868528,
        "address": "Hyder",
        "routeId": 2,
        "driverId": null,
        "isDelivered": "Inprogress",
        "dcNo": "DC-59",
        "product20L": 10,
        "product1L": 0,
        "product500ML": 0,
        "product300ML": 0,
        "product2L": 0,
        "price20L": 10,
        "price2L": 0,
        "price1L": 0,
        "price500ML": 0,
        "price300ML": 0,
        "RouteId": 2,
        "RouteName": "CHoutupal-sangareddy",
        "RouteDescription": "sangareddy",
        "departmentId": 2,
        "createdDateTime": "2021-06-03T23:12:38.000Z",
        "deleted": 0,
        "driverName": null,
        "mobileNumber": null
    }])
    const [opData, setOpData] = useState(() => options)
    const [DCModal, setDCModal] = useState(false)
    const [title, setTitle] = useState('')
    const [viewData, setViewData] = useState({})
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }


    useEffect(() => {
        getTestResults(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getTestResults = async ({ startDate, endDate, fromStart }) => {
        const url = `invoice/getTotalInvoicesCount?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}`

        try {
            // const data = await http.GET(axios, url, config)
            // setResults(data)
            setLoading(false)
        } catch (error) { }
    }

    const handleOperation = useCallback((data) => {
        const newData = { ...opData, ...data }
        getTestResults(newData)
        setOpData(newData)
    }, [opData])

    const handleView = (data) => {
        setTitle(data.dcNo)
        setViewData(data)
        setDCModal(true)
    }

    const onModalClose = () => {
        setDCModal(false)
        setViewData({})
    }

    const handleDCModalCancel = useCallback(() => onModalClose(), [])
    const goToOrders = useCallback(() => history.push('/manage-stock/2'), [])

    return (
        <div className='invoice-overview-panel'>
            <div className='header'>
                <PanelHeader title='Uncleared Invoices 46' onSelect={handleOperation} showShow />
            </div>
            <div className='todays-orders-panel uncleared-invoices-panel'>
                <div className='panel-header'>
                    <div className='head-container'>
                        <div className='head'>
                            <CustomButton
                                text='View All'
                                onClick={goToOrders}
                                className='app-btn app-view-btn'
                                suffix={<RightChevronIconLight className='chev' />}
                            />
                        </div>
                    </div>
                </div>
                <div className='panel-body pb-0'>
                    {
                        loading ? <NoContent content={<Spinner />} />
                            : isEmpty(results) ? <NoContent content={<Empty />} />
                                : (
                                    <Scrollbars renderThumbVertical={Thumb}>
                                        <div className='panel-details-scroll'>
                                            <div className='panel-details'>
                                                {
                                                    results.map((item) => <InvoiceCard key={item.dcNo} data={item} onClick={handleView} />)
                                                }
                                            </div>
                                        </div>
                                    </Scrollbars>
                                )
                    }
                </div>
                <CustomModal
                    className='app-form-modal app-view-modal'
                    visible={DCModal}
                    onOk={handleDCModalCancel}
                    onCancel={handleDCModalCancel}
                    title={title}
                    okTxt='Close'
                    hideCancel
                >
                    <DCView data={viewData} />
                </CustomModal>
            </div>
        </div>
    )
}

const Thumb = (props) => <div {...props} className="thumb-vertical" />
export default UnclearedInvoiceOverview