import axios from 'axios';
import { Table } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import { TODAYDATE } from '../../../../utils/constants';
import { getStatusColor } from '../../../../utils/Functions';
import CustomButton from '../../../../components/CustomButton';
import { todayDeliveryColumns } from '../../../../assets/fixtures'
import '../../../../sass/todayDeliveryDetails.scss'

const TodayDeliveryDetails = () => {
    const [loading, setLoading] = useState(true)
    const [delivery, setDelivery] = useState([])

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getDelivery()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getDelivery = async () => {
        const url = `/warehouse/deliveryDetails/${TODAYDATE}`

        try {
            const data = await http.GET(axios, url, config)
            setDelivery(data)
            setLoading(false)
        } catch (error) { }
    }

    const dataSource = useMemo(() => delivery.map((order) => {
        const { customerOrderId: key, dcNo, contactPerson, address, driverName, cans20L,
            boxes1L, boxes250ML, boxes500ML, isDelivered } = order
        return {
            key,
            id: `${key}`,
            dcNo,
            address,
            contactPerson,
            driverName: driverName || "Not Assigned",
            status: renderStatus(isDelivered),
            orderDetails: renderOrderDetails({ cans20L, boxes1L, boxes250ML, boxes500ML }),
        }
    }), [delivery])

    return (
        <div className='today-delivery-details-panel'>
            <div className='panel-header'>
                <div className='head-container'>
                    <div className='title'>
                        Today Delivery Details
                    </div>
                    <CustomButton
                        text='View All'
                        onClick={() => { }}
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
    const text = status === 'Completed' ? 'Delivered' : status === 'Postponed' ? status : 'Pending'
    return (
        <div className='status'>
            <span className='app-dot' style={{ background: color }}></span>
            <span className='status-text'>{text}</span>
        </div>
    )
}
const renderOrderDetails = ({ product20L, product1L, product500ML, product250ML }) => {
    return `
    20 lts - ${product20L ? product20L : 0}, 1 ltr - ${product1L ? product1L : 0} boxes, 
    500 ml - ${product500ML ? product500ML : 0} boxes, 250 ml - ${product250ML ? product250ML : 0} boxes
    `
}
export default TodayDeliveryDetails