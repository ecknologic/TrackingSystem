import { Empty } from 'antd';
import { useHistory } from 'react-router';
import Scrollbars from 'react-custom-scrollbars-2';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http, appApi } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import { isEmpty } from '../../../../utils/Functions';
import DaySlider from '../../../../components/DaySlider';
import { TODAYDATE } from '../../../../utils/constants';
import NoContent from '../../../../components/NoContent';
import OrderCard from '../../../../components/OrderCard';
import DCView from '../../../accounts/view/views/DCView';
import CustomModal from '../../../../components/CustomModal';
import CustomButton from '../../../../components/CustomButton';

const TodaysOrders = () => {
    const history = useHistory()
    const [loading, setLoading] = useState(true)
    const [orders, setOrders] = useState([])
    const [DCModal, setDCModal] = useState(false)
    const [title, setTitle] = useState('')
    const [viewData, setViewData] = useState({})
    const source = useMemo(() => appApi.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getOrders()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getOrders = async (selectedDate = TODAYDATE) => {
        const url = `warehouse/deliveryDetails/${selectedDate}`
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

    const handleDateChange = (date) => {
        setLoading(true)
        getOrders(date)
    }

    const handleDCModalCancel = useCallback(() => onModalClose(), [])
    const goToOrders = useCallback(() => history.push('/manage-stock/2'), [])

    return (
        <div className='todays-orders-panel'>
            <div className='panel-header'>
                <div className='head-container'>
                    <div className='head'>
                        <DaySlider onChange={handleDateChange} />
                        <CustomButton
                            text='View All'
                            onClick={goToOrders}
                            className='app-extra-btn inverse small-btn'
                        />
                    </div>
                    <div className='title'>
                        Today's Orders
                    </div>
                </div>
            </div>
            <div className='panel-body pb-0'>
                {
                    loading ? <NoContent content={<Spinner />} />
                        : isEmpty(orders) ? <NoContent content={<Empty />} />
                            : (
                                <Scrollbars renderThumbVertical={Thumb}>
                                    <div className='panel-details-scroll'>
                                        <div className='panel-details'>
                                            {
                                                orders.map((item) => <OrderCard key={item.dcNo} data={item} onClick={handleView} />)
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
export default TodaysOrders