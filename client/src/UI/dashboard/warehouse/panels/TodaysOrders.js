import { Empty } from 'antd';
import axios from 'axios';
import Scrollbars from 'react-custom-scrollbars-2';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import { isEmpty } from '../../../../utils/Functions';
import DaySlider from '../../../../components/DaySlider';
import { TODAYDATE } from '../../../../utils/constants';
import NoContent from '../../../../components/NoContent';
import OrderCard from '../../../../components/OrderCard';
import DCView from '../../../accounts/view/views/DCView';
import CustomModal from '../../../../components/CustomModal';

const TodaysOrders = () => {
    const [loading, setLoading] = useState(true)
    const [orders, setOrders] = useState([])
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const [DCModal, setDCModal] = useState(false)
    const [title, setTitle] = useState('')
    const [viewData, setViewData] = useState({})
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getOrders()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getOrders = async () => {
        const url = `/warehouse/deliveryDetails/${selectedDate}`
        try {
            const data = await http.GET(axios, url, config)
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

    return (
        <div className='todays-orders-panel'>
            <div className='panel-header'>
                <div className='head-container'>
                    {/* <DaySlider onChange={() => { }} /> */}
                    <div className='title'>
                        Today's Orders
                    </div>
                </div>
            </div>
            <div className='panel-body'>
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