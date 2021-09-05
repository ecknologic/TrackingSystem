import axios from 'axios';
import { Table } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import { TODAYDATE } from '../../../../utils/constants';
import CustomButton from '../../../../components/CustomButton';
import { todayDeliveryColumns } from '../../../../assets/fixtures'
import { getStatusColor, renderProductDetails } from '../../../../utils/Functions';
import '../../../../sass/todayDeliveryDetails.scss'

const DispatchDetails = () => {
    const history = useHistory()
    const [loading, setLoading] = useState(true)
    const [dispatches, setDispatches] = useState([])

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getDispatches()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getDispatches = async () => {
        const url = `motherPlant/getDispatchDetails/${TODAYDATE}`

        try {
            const data = await http.GET(axios, url, config)
            setDispatches(data)
            setLoading(false)
        } catch (error) { }
    }

    const dataSource = useMemo(() => dispatches.map((order) => {
        const { DCNO, dispatchAddress, driverName, status, ...rest } = order
        return {
            key: DCNO,
            id: DCNO,
            DCNO,
            dispatchAddress,
            driverName: driverName || "Not Assigned",
            status: renderStatus(status),
            production: renderProductDetails(rest),
        }
    }), [dispatches])

    const goToDispatches = () => history.push('/manage-dispatches')

    return (
        <div className='today-delivery-details-panel'>
            <div className='panel-header'>
                <div className='head-container'>
                    <div className='title'>
                        Dispatch Details
                    </div>
                    <CustomButton
                        text='View All'
                        onClick={goToDispatches}
                        className='app-extra-btn inverse small-btn'
                    />
                </div>
            </div>
            <div className='panel-body'>
                <div className='app-table'>
                    <Table
                        loading={{ spinning: loading, indicator: <Spinner /> }}
                        dataSource={dataSource.slice(0, 4)}
                        columns={todayDeliveryColumns}
                        pagination={false}
                        scroll={{ x: true }}
                        size='middle'
                    />
                </div>
            </div>
        </div>
    )
}
const renderStatus = (status) => {
    const color = getStatusColor(status)
    const text = status ? status : 'Pending'
    return (
        <div className='status'>
            <span className='app-dot' style={{ background: color }}></span>
            <span className='status-text'>{text}</span>
        </div>
    )
}

export default DispatchDetails