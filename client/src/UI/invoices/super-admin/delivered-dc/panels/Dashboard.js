import dayjs from 'dayjs';
import axios from 'axios';
import { Menu, Table } from 'antd';
import { useLocation } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../../modules/http';
import Spinner from '../../../../../components/Spinner';
import Actions from '../../../../../components/Actions';
import DCView from '../../../../accounts/view/views/DCView';
import Worksheet from '../../../../../components/Worksheet';
import SearchInput from '../../../../../components/SearchInput';
import CustomModal from '../../../../../components/CustomModal';
import { EyeIconGrey } from '../../../../../components/SVG_Icons';
import { getDeliveryColumns } from '../../../../../assets/fixtures';
import CustomPagination from '../../../../../components/CustomPagination';
import { doubleKeyComplexSearch, getStatusColor, isEmpty } from '../../../../../utils/Functions';
const APIDATEFORMAT = 'YYYY-MM-DD'
const DATEANDTIMEFORMAT = 'DD/MM/YYYY hh:mm A'

const DeliveredDC = ({ invoiceId }) => {
    const { state: urlState = {} } = useLocation()
    const [loading, setLoading] = useState(true)
    const [deliveries, setDeliveries] = useState([])
    const [deliveriesClone, setDeliveriesClone] = useState([])
    const [formData, setFormData] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [DCModal, setDCModal] = useState(false)
    const [excelRows, setExelRows] = useState([])
    const [title, setTitle] = useState('')

    const deliveryColumns = useMemo(() => getDeliveryColumns('date'), [])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }
    const { fromDate, toDate, customerId, customerType } = urlState

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

        const url = `warehouse/getAllDcDetails?fromDate=${startDate}&toDate=${endDate}&customerIds=${[customerId]}&customerType=${customerType}`

        try {
            const data = await http.GET(axios, url, config)
            setPageNumber(1)
            setLoading(false)
            setTotalCount(data.length)
            setDeliveriesClone(data)
            setDeliveries(data)
            generateExcelRows(data)
        } catch (error) { }
    }

    const generateExcelRows = (data) => {
        const rows = data.map((item) => {
            const orderDetails = renderOrderDetails(item)
            const status = getStatusText(item.isDelivered)
            const deliveredDate = dayjs(item.deliveryDate).format(DATEANDTIMEFORMAT)
            return { ...item, status, orderDetails, deliveredDate }
        })

        setExelRows(rows)
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

    const onModalClose = () => {
        setDCModal(false)
        setBtnDisabled(false)
        setFormData({})
    }

    const handleSearch = (value) => {
        setPageNumber(1)
        if (value === "") {
            setTotalCount(deliveriesClone.length)
            setDeliveries(deliveriesClone)
            return
        }
        const result = doubleKeyComplexSearch(deliveriesClone, value, 'dcNo', 'customerName')
        setTotalCount(result.length)
        setDeliveries(result)
    }

    const dataSource = useMemo(() => deliveries.map((dc) => {
        const { dcNo, customerOrderId, address, RouteName, driverName, customerName, isDelivered, deliveredDate } = dc
        return {
            key: customerOrderId || dcNo,
            dcnumber: dcNo,
            shopAddress: address,
            name: customerName,
            route: RouteName || 'Not Assigned',
            driverName: driverName || 'Not Assigned',
            orderDetails: renderOrderDetails(dc),
            status: renderStatus(isDelivered),
            dateAndTime: dayjs(deliveredDate).format(DATEANDTIMEFORMAT),
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, dc)} />
        }
    }), [deliveries])


    const handleDCModalCancel = useCallback(() => onModalClose(), [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <div className='stock-delivery-container'>
            <div className='header'>
                <div className='left'>
                    <Worksheet
                        fileName={`DC List for ${invoiceId}`}
                        rows={excelRows}
                        columns={columns}
                        disabled={loading || isEmpty(deliveries)}
                    />
                </div>
                <div className='right'>
                    <SearchInput
                        placeholder='Search Delivery Challan'
                        className='delivery-search'
                        onChange={handleSearch}
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
        </div>
    )
}

const columns = [
    { label: 'DC Number', value: 'dcNo' },
    { label: 'Date & Time', value: 'deliveredDate' },
    { label: 'Name', value: 'customerName' },
    { label: 'Address', value: 'address' },
    { label: 'Route', value: 'RouteName' },
    { label: 'Driver', value: 'driverName' },
    { label: 'Order Details', value: 'orderDetails' },
    { label: 'Status', value: 'status' },
]

const renderStatus = (status) => {
    const color = getStatusColor(status)
    const text = getStatusText(status)
    return (
        <div className='status'>
            <span className='app-dot' style={{ background: color }}></span>
            <span className='status-text'>{text}</span>
        </div>
    )
}

const getStatusText = (status) => {
    return status === 'Completed' ? 'Delivered' : status === 'Postponed' ? status : 'Pending'
}

const renderOrderDetails = ({ product20L, product2L, product1L, product500ML, product300ML }) => {
    return `
    20 ltrs - ${Number(product20L)}, 2 ltrs - ${Number(product2L)} boxes, 1 ltr - ${Number(product1L)} boxes, 
    500 ml - ${Number(product500ML)} boxes, 300 ml - ${Number(product300ML)} boxes
    `
}
const options = [<Menu.Item key="view" icon={<EyeIconGrey />}>View</Menu.Item>]
export default DeliveredDC