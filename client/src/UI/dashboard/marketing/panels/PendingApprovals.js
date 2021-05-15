import { Empty } from 'antd';
import { useHistory } from 'react-router';
import Scrollbars from 'react-custom-scrollbars-2';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http, appApi } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import { isEmpty } from '../../../../utils/Functions';
import { TODAYDATE as d } from '../../../../utils/constants';
import NoContent from '../../../../components/NoContent';
import DCView from '../../../accounts/view/views/DCView';
import CustomModal from '../../../../components/CustomModal';
import PanelHeader from '../../../../components/PanelHeader';
import CustomerCard from '../../../../components/CustomerCard';
const options = { startDate: d, endDate: d, fromStart: true }

const PendingApprovals = () => {
    const history = useHistory()
    const [opData, setOpData] = useState(() => options)
    const [loading, setLoading] = useState(true)
    const [orders, setOrders] = useState([])
    const [DCModal, setDCModal] = useState(false)
    const [title, setTitle] = useState('')
    const [viewData, setViewData] = useState({})
    const source = useMemo(() => appApi.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getResults(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getResults = async ({ startDate, endDate, fromStart }) => {
        const url = `warehouse/deliveryDetails?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}`
        try {
            // const data = await http.GET(appApi, url, config)
            const data = [{ "customerOrderId": 3870, "deliveryLocation": "Prakash Nagar", "EmailId": "rameshrao@gmail.com", "existingCustomerId": 318, "distributorId": null, "creationType": "auto", "customerType": "internal", "customerName": "Rameshrao", "phoneNumber": 9523654789, "address": "Madhapur flat no 1067 ayyappa society madhapur", "routeId": 19, "driverId": null, "isDelivered": "Inprogress", "dcNo": "DC-3870", "product20L": 10, "product1L": 0, "product500ML": 0, "product300ML": 0, "product2L": 0, "price20L": 45.86, "price2L": 0, "price1L": 0, "price500ML": 0, "price300ML": 0, "RouteId": 19, "RouteName": "Kukatpally One", "RouteDescription": "KPHB", "departmentId": 22, "createdDateTime": "2021-01-28T17:20:56.000Z", "deleted": 0, "driverName": null, "mobileNumber": null }, { "customerOrderId": 3852, "deliveryLocation": "Begumpet", "EmailId": "mrftyres@mrf.com", "existingCustomerId": 292, "distributorId": null, "creationType": "auto", "customerType": "internal", "customerName": "Mahindra", "phoneNumber": 8949849849, "address": "New No:, 124, Greams Road, Thousand Lights West, Thousand Lights, Chennai, Tamil Nadu,Chennai, Tamil Nadu,Chennai, Tamil Nadu", "routeId": 19, "driverId": null, "isDelivered": "Inprogress", "dcNo": "DC-3852", "product20L": 10, "product1L": 0, "product500ML": 0, "product300ML": 0, "product2L": 0, "price20L": 45, "price2L": 0, "price1L": 0, "price500ML": 0, "price300ML": 0, "RouteId": 19, "RouteName": "Kukatpally One", "RouteDescription": "KPHB", "departmentId": 22, "createdDateTime": "2021-01-28T17:20:56.000Z", "deleted": 0, "driverName": null, "mobileNumber": null }, { "customerOrderId": 3851, "deliveryLocation": "Kavali", "EmailId": "jammu@gmail.com", "existingCustomerId": 291, "distributorId": null, "creationType": "auto", "customerType": "internal", "customerName": "Jammu Ravi Kumar", "phoneNumber": 9908270622, "address": "Kavali main road flat no 123", "routeId": 19, "driverId": null, "isDelivered": "Inprogress", "dcNo": "DC-3851", "product20L": 20, "product1L": 0, "product500ML": 0, "product300ML": 0, "product2L": 0, "price20L": 45.26, "price2L": 0, "price1L": 0, "price500ML": 0, "price300ML": 0, "RouteId": 19, "RouteName": "Kukatpally One", "RouteDescription": "KPHB", "departmentId": 22, "createdDateTime": "2021-01-28T17:20:56.000Z", "deleted": 0, "driverName": null, "mobileNumber": null }, { "customerOrderId": 3844, "deliveryLocation": "Hyderabad", "EmailId": "bvnsaikumar444@gmail.com", "existingCustomerId": 277, "distributorId": null, "creationType": "auto", "customerType": "internal", "customerName": "Deepak", "phoneNumber": 7588888888, "address": "Hyderabad", "routeId": 19, "driverId": null, "isDelivered": "Inprogress", "dcNo": "DC-3844", "product20L": 7, "product1L": 0, "product500ML": 0, "product300ML": 0, "product2L": 21, "price20L": 45, "price2L": 15, "price1L": 0, "price500ML": 0, "price300ML": 0, "RouteId": 19, "RouteName": "Kukatpally One", "RouteDescription": "KPHB", "departmentId": 22, "createdDateTime": "2021-01-28T17:20:56.000Z", "deleted": 0, "driverName": null, "mobileNumber": null }, { "customerOrderId": 3843, "deliveryLocation": "Kadapa", "EmailId": "radha@Gmail.com", "existingCustomerId": 276, "distributorId": null, "creationType": "auto", "customerType": "internal", "customerName": "Radha Jogendra", "phoneNumber": 7855555555, "address": "Kadapa", "routeId": 19, "driverId": null, "isDelivered": "Inprogress", "dcNo": "DC-3843", "product20L": 10, "product1L": 0, "product500ML": 0, "product300ML": 0, "product2L": 10, "price20L": 50, "price2L": 20, "price1L": 0, "price500ML": 0, "price300ML": 0, "RouteId": 19, "RouteName": "Kukatpally One", "RouteDescription": "KPHB", "departmentId": 22, "createdDateTime": "2021-01-28T17:20:56.000Z", "deleted": 0, "driverName": null, "mobileNumber": null }, { "customerOrderId": 3842, "deliveryLocation": "Madhapur", "EmailId": "praveen14568@gmail.com", "existingCustomerId": 275, "distributorId": null, "creationType": "auto", "customerType": "internal", "customerName": "Hemanth", "phoneNumber": 9090099999, "address": "Near Madhpur ", "routeId": 19, "driverId": null, "isDelivered": "Inprogress", "dcNo": "DC-3842", "product20L": 20, "product1L": 10, "product500ML": 0, "product300ML": 0, "product2L": 10, "price20L": 30, "price2L": 20, "price1L": 20, "price500ML": 0, "price300ML": 0, "RouteId": 19, "RouteName": "Kukatpally One", "RouteDescription": "KPHB", "departmentId": 22, "createdDateTime": "2021-01-28T17:20:56.000Z", "deleted": 0, "driverName": null, "mobileNumber": null }, { "customerOrderId": 3838, "deliveryLocation": "Ranapsi", "EmailId": "bvnsaikumar444@gmail.com", "existingCustomerId": 274, "distributorId": null, "creationType": "auto", "customerType": "internal", "customerName": "Ramu", "phoneNumber": 8999999999, "address": "Plot No -362, Ranapasi, Odisha 759013", "routeId": 18, "driverId": null, "isDelivered": "Inprogress", "dcNo": "DC-3838", "product20L": 10, "product1L": 10, "product500ML": 0, "product300ML": 0, "product2L": 10, "price20L": 50, "price2L": 50, "price1L": 50, "price500ML": 0, "price300ML": 0, "RouteId": 18, "RouteName": "sangareddy", "RouteDescription": "sangareddy-uppal", "departmentId": 22, "createdDateTime": "2021-01-26T17:34:55.000Z", "deleted": 0, "driverName": null, "mobileNumber": null }, { "customerOrderId": 3835, "deliveryLocation": "Wipro Kondapur", "EmailId": "praveen14568@gmail.com", "existingCustomerId": 273, "distributorId": null, "creationType": "auto", "customerType": "internal", "customerName": "Trinath", "phoneNumber": 8444444444, "address": "Near kondapur Cross roads road number 53 near KIA showroom", "routeId": 19, "driverId": null, "isDelivered": "Inprogress", "dcNo": "DC-3835", "product20L": 0, "product1L": 0, "product500ML": 0, "product300ML": 0, "product2L": 100, "price20L": 0, "price2L": 25, "price1L": 0, "price500ML": 0, "price300ML": 0, "RouteId": 19, "RouteName": "Kukatpally One", "RouteDescription": "KPHB", "departmentId": 22, "createdDateTime": "2021-01-28T17:20:56.000Z", "deleted": 0, "driverName": null, "mobileNumber": null }, { "customerOrderId": 3833, "deliveryLocation": "Wipro Madhapur", "EmailId": "praveen14568@gmail.com", "existingCustomerId": 273, "distributorId": null, "creationType": "auto", "customerType": "internal", "customerName": "Hemanth", "phoneNumber": 8999999999, "address": "Nagole cross roads road number 45", "routeId": 16, "driverId": null, "isDelivered": "Inprogress", "dcNo": "DC-3833", "product20L": 50, "product1L": 0, "product500ML": 0, "product300ML": 0, "product2L": 40, "price20L": 50, "price2L": 30, "price1L": 0, "price500ML": 0, "price300ML": 0, "RouteId": 16, "RouteName": "Madhapur one", "RouteDescription": "Covers all Kaveri Hills and part of Madhapur", "departmentId": 22, "createdDateTime": "2021-01-21T07:55:46.000Z", "deleted": 0, "driverName": null, "mobileNumber": null }, { "customerOrderId": 3830, "deliveryLocation": "Ayyappa Society", "EmailId": "sukesh.2593@gmail.com", "existingCustomerId": 271, "distributorId": null, "creationType": "auto", "customerType": "internal", "customerName": "Hemanth Alahari", "phoneNumber": 9493327022, "address": "1145 & 1146 ,, Road no 56 , Megha Hills, Ayyappa Society, Madhapur CGR Inter national school, Hyderabad", "routeId": 18, "driverId": null, "isDelivered": "Inprogress", "dcNo": "DC-3830", "product20L": 10, "product1L": 10, "product500ML": 0, "product300ML": 0, "product2L": 10, "price20L": 50, "price2L": 50, "price1L": 50, "price500ML": 0, "price300ML": 0, "RouteId": 18, "RouteName": "sangareddy", "RouteDescription": "sangareddy-uppal", "departmentId": 22, "createdDateTime": "2021-01-26T17:34:55.000Z", "deleted": 0, "driverName": null, "mobileNumber": null }, { "customerOrderId": 3829, "deliveryLocation": "Madhapur", "EmailId": "sukesh.346@gmail.com", "existingCustomerId": 270, "distributorId": null, "creationType": "auto", "customerType": "internal", "customerName": "Sukesh Pasupuleti", "phoneNumber": 8008088080, "address": "Plot no. 161, Road no. 9 Ayyappa society, Madhapur CGR international school, Hyderabad ", "routeId": 16, "driverId": null, "isDelivered": "Inprogress", "dcNo": "DC-3829", "product20L": 10, "product1L": 30, "product500ML": 0, "product300ML": 0, "product2L": 20, "price20L": 50, "price2L": 40, "price1L": 20, "price500ML": 0, "price300ML": 0, "RouteId": 16, "RouteName": "Madhapur one", "RouteDescription": "Covers all Kaveri Hills and part of Madhapur", "departmentId": 22, "createdDateTime": "2021-01-21T07:55:46.000Z", "deleted": 0, "driverName": null, "mobileNumber": null }, { "customerOrderId": 3827, "deliveryLocation": "Madhapur", "EmailId": "harish@gmail.com", "existingCustomerId": 268, "distributorId": null, "creationType": "auto", "customerType": "internal", "customerName": "Harish Kalepu", "phoneNumber": 9666666666, "address": "Road no 53 plot no 1086 Near ayyappa society park Madhapur", "routeId": 16, "driverId": null, "isDelivered": "Inprogress", "dcNo": "DC-3827", "product20L": 10, "product1L": 10, "product500ML": 10, "product300ML": 10, "product2L": 10, "price20L": 50, "price2L": 40, "price1L": 35, "price500ML": 25, "price300ML": 20, "RouteId": 16, "RouteName": "Madhapur one", "RouteDescription": "Covers all Kaveri Hills and part of Madhapur", "departmentId": 22, "createdDateTime": "2021-01-21T07:55:46.000Z", "deleted": 0, "driverName": null, "mobileNumber": null }, { "customerOrderId": 3826, "deliveryLocation": "Ranigunj", "EmailId": "dilip.gujju@gmail.com", "existingCustomerId": 267, "distributorId": null, "creationType": "auto", "customerType": "internal", "customerName": "abdul", "phoneNumber": 8949498451, "address": "Near Ranigunj", "routeId": 16, "driverId": null, "isDelivered": "Inprogress", "dcNo": "DC-3826", "product20L": 10, "product1L": 0, "product500ML": 0, "product300ML": 0, "product2L": 5, "price20L": 50, "price2L": 25, "price1L": 0, "price500ML": 0, "price300ML": 0, "RouteId": 16, "RouteName": "Madhapur one", "RouteDescription": "Covers all Kaveri Hills and part of Madhapur", "departmentId": 22, "createdDateTime": "2021-01-21T07:55:46.000Z", "deleted": 0, "driverName": null, "mobileNumber": null }]
            setOrders(data)
            setLoading(false)
        } catch (error) { }
    }

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

    const handleOperation = useCallback((data) => {
        const newData = { ...opData, ...data }
        setLoading(true)
        getResults(newData)
        setOpData(newData)
    }, [opData])

    return (
        <div className='todays-orders-panel pending-approval-panel'>
            <PanelHeader title='Approvals Pending' onSelect={handleOperation} showShow hideReports />
            <div className='panel-body pb-0'>
                {
                    loading ? <NoContent content={<Spinner />} />
                        : isEmpty(orders) ? <NoContent content={<Empty />} />
                            : (
                                <Scrollbars renderThumbVertical={Thumb}>
                                    <div className='panel-details-scroll'>
                                        <div className='panel-details'>
                                            {
                                                orders.map((item) => <CustomerCard key={item.dcNo} data={item} onClick={handleView} />)
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
    )
}
const Thumb = (props) => <div {...props} className="thumb-vertical" />
export default PendingApprovals