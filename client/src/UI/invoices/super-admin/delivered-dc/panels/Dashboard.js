import dayjs from 'dayjs';
import axios from 'axios';
import { Menu, Table } from 'antd';
import { useLocation } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../../modules/http';
import Spinner from '../../../../../components/Spinner';
import Actions from '../../../../../components/Actions';
import DCView from '../../../../accounts/view/views/DCView';
import { TRACKFORM } from '../../../../../utils/constants';
import QuitModal from '../../../../../components/CustomModal';
import SearchInput from '../../../../../components/SearchInput';
import CustomModal from '../../../../../components/CustomModal';
import { deliveryColumns } from '../../../../../assets/fixtures';
import { EyeIconGrey } from '../../../../../components/SVG_Icons';
import ConfirmMessage from '../../../../../components/ConfirmMessage';
import CustomPagination from '../../../../../components/CustomPagination';
import { resetTrackForm, getStatusColor } from '../../../../../utils/Functions';
const APIDATEFORMAT = 'YYYY-MM-DD'
const DATEANDTIMEFORMAT = 'DD/MM/YYYY hh:mm A'

const DeliveredDC = () => {
    const { state: urlState = {} } = useLocation()
    const [loading, setLoading] = useState(true)
    const [deliveries, setDeliveries] = useState([])
    const [formData, setFormData] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [DCModal, setDCModal] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [title, setTitle] = useState('')

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }
    const { fromDate, toDate, customerId } = urlState

    useEffect(() => {
        setLoading(true)
        getDeliveries()

        return () => {
            http.ABORT(source)
        }
    }, [])


    const getDeliveries = async () => {
        const startDate = dayjs(fromDate).format(APIDATEFORMAT)
        const endDate = dayjs(toDate).format(APIDATEFORMAT)

        const url = `/warehouse/getAllDcDetails?fromDate=${startDate}&toDate=${endDate}&customerIds=${[customerId]}`

        try {
            const data = await http.GET(axios, url, config)
            setPageNumber(1)
            setLoading(false)
            setTotalCount(data.length)
            setDeliveries(data)
        } catch (error) { }
    }

    const handleMenuSelect = (key, data) => {
        if (key === 'view') {
            setTitle(data.dcNo)
            setFormData(data)
            setDCModal(true)
        }
    }

    const handlePageChange = (number) => {
        setPageNumber(number)
    }

    const handleSizeChange = (number, size) => {
        setPageSize(size)
        setPageNumber(number)
    }

    const onModalClose = (hasSaved) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasSaved) {
            return setConfirmModal(true)
        }
        setDCModal(false)
        setBtnDisabled(false)
        setFormData({})
    }

    const dataSource = useMemo(() => deliveries.map((dc) => {
        const { dcNo, customerOrderId, address, RouteName, driverName, customerName, isDelivered, returnEmptyCans, deliveredDate } = dc
        return {
            key: customerOrderId || dcNo,
            dcnumber: dcNo,
            shopAddress: address,
            route: RouteName,
            name: customerName,
            returnEmptyCans: returnEmptyCans || 0,
            driverName: driverName || 'Not Assigned',
            orderDetails: renderOrderDetails(dc),
            status: renderStatus(isDelivered),
            dateAndTime: dayjs(deliveredDate).format(DATEANDTIMEFORMAT),
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, dc)} />
        }
    }), [deliveries])

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false);
        resetTrackForm()
        onModalClose()
    }, [])

    const handleDCModalCancel = useCallback(() => onModalClose(), [])
    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize
    return (
        <div className='stock-delivery-container'>
            <div className='header'>
                <div className='right'>
                    <SearchInput
                        placeholder='Search Delivery Challan'
                        className='delivery-search'
                        width='50%'
                    />
                </div>
            </div>
            <div className='app-table delivery-table'>
                <Table
                    loading={{ spinning: loading, indicator: <Spinner /> }}
                    dataSource={dataSource.slice(sliceFrom, sliceTo)}
                    columns={deliveryColumns}
                    pagination={false}
                    scroll={{ x: true }}
                />
            </div>
            {
                !!totalCount && (
                    <CustomPagination
                        total={totalCount}
                        pageSize={pageSize}
                        current={pageNumber}
                        onChange={handlePageChange}
                        pageSizeOptions={['10', '20', '30', '40', '50']}
                        onPageSizeChange={handleSizeChange}
                    />)
            }
            <CustomModal
                className='app-form-modal app-view-modal'
                visible={DCModal}
                btnDisabled={btnDisabled}
                onOk={handleDCModalCancel}
                onCancel={handleDCModalCancel}
                title={title}
                okTxt='Close'
                hideCancel
            >
                <DCView data={formData} />
            </CustomModal>
            <QuitModal
                visible={confirmModal}
                onOk={handleConfirmModalOk}
                onCancel={handleConfirmModalCancel}
                title='Are you sure you want to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </QuitModal>
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

const renderOrderDetails = ({ product20L, product2L, product1L, product500ML, product300ML }) => {
    return `
    20 ltrs - ${Number(product20L)}, 2 ltrs - ${Number(product2L)} boxes, 1 ltr - ${Number(product1L)} boxes, 
    500 ml - ${Number(product500ML)} boxes, 300 ml - ${Number(product300ML)} boxes
    `
}
const options = [<Menu.Item key="view" icon={<EyeIconGrey />}>View</Menu.Item>]
export default DeliveredDC