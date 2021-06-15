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
        const url = `customer/getMarketingCustomerDetailsByStatus?status=0&startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}`
        try {
            const data = await http.GET(appApi, url, config)
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
                                                orders.map((item) => <div className='order-card-container'>
                                                    <span className='title clamp-2'>ID: {item.customerNo}</span>
                                                    <span className='title clamp-2'>Name: {item.organizationName || item.customerName}</span>
                                                    <span className='address clamp-2'>Address:{item.address}</span>
                                                    <span className='stock clamp-2'>CustomerType:{item.customertype}</span>
                                                    {/* <span className='stat-head'>Delivery Status</span> */}
                                                    {/* {status} */}
                                                    {/* <CustomButton
                                                        text='View Details'
                                                        className='app-extra-btn inverse small-btn'
                                                        onClick={() => onClick(data)}
                                                    /> */}
                                                </div>)
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