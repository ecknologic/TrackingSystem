import dayjs from 'dayjs';
import axios from 'axios';
import { Menu, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import Actions from '../../../../components/Actions';
import DCView from '../../../accounts/view/views/DCView';
import DateValue from '../../../../components/DateValue';
import SearchInput from '../../../../components/SearchInput';
import CustomModal from '../../../../components/CustomModal';
import { deliveryColumns } from '../../../../assets/fixtures';
import CustomButton from '../../../../components/CustomButton';
import RoutesFilter from '../../../../components/RoutesFilter';
import { getWarehoseId, TODAYDATE } from '../../../../utils/constants';
import CustomPagination from '../../../../components/CustomPagination';
import CustomRangeInput from '../../../../components/CustomRangeInput';
import { EyeIconGrey, ScheduleIcon } from '../../../../components/SVG_Icons';
import { getStatusColor, doubleKeyComplexSearch } from '../../../../utils/Functions';
const APIDATEFORMAT = 'YYYY-MM-DD'
const DATEANDTIMEFORMAT = 'DD/MM/YYYY hh:mm A'

const DeliveredDC = () => {
    const departmentId = getWarehoseId()
    const [customerList, setCustomerList] = useState([])
    const [loading, setLoading] = useState(true)
    const [customerIds, setCustomerIds] = useState([])
    const [filterBtnDisabled, setFilterBtnDisabled] = useState(true)
    const [deliveries, setDeliveries] = useState([])
    const [deliveriesClone, setDeliveriesClone] = useState([])
    const [formData, setFormData] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [DCModal, setDCModal] = useState(false)
    const [startDate, setStartDate] = useState(TODAYDATE)
    const [endDate, setEndDate] = useState(TODAYDATE)
    const [selectedRange, setSelectedRange] = useState([])
    const [resetSearch, setResetSearch] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        setLoading(true)
        getDeliveries()
        getCustomerList()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getCustomerList = async () => {
        const url = `/customer/getCustomerNames`

        try {
            const data = await http.GET(axios, url, config)
            setCustomerList(data)
        } catch (error) { }
    }

    const getDeliveries = async () => {
        const url = `/warehouse/getAllDcDetails?fromDate=${startDate}&toDate=${endDate}&departmentId=${departmentId}&customerIds=${customerIds}`

        try {
            const data = await http.GET(axios, url, config)
            setPageNumber(1)
            setLoading(false)
            setTotalCount(data.length)
            setDeliveriesClone(data)
            setDeliveries(data)
            searchON && setResetSearch(!resetSearch)
        } catch (error) { }
    }

    const onFilterChange = (data) => {
        setPageNumber(1)
        setCustomerIds(data)
        setFilterBtnDisabled(false)
    }

    const handleMenuSelect = (key, data) => {
        if (key === 'view') {
            setTitle(data.dcNo)
            setFormData(data)
            setDCModal(true)
        }
    }

    const datePickerStatus = (status) => {
        !status && setOpen(false)
    }

    const handleDateSelect = (selected) => {
        const [from, to] = selected
        setStartDate(from.format(APIDATEFORMAT))
        setEndDate(to.format(APIDATEFORMAT))
        setOpen(false)
        setSelectedRange(selected)
        setTimeout(() => setSelectedRange([]), 820)
        setPageNumber(1)
        setFilterBtnDisabled(false)
    }

    const handleFilter = () => {
        setFilterBtnDisabled(true)
        setLoading(true)
        getDeliveries()
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
        setFormData({})
    }

    const handleSearch = (value) => {
        setPageNumber(1)
        if (value === "") {
            setTotalCount(deliveriesClone.length)
            setDeliveries(deliveriesClone)
            setSeachON(false)
            return
        }
        const result = doubleKeyComplexSearch(deliveriesClone, value, 'dcNo', 'customerName')
        setTotalCount(result.length)
        setDeliveries(result)
        setSeachON(true)
    }

    const dataSource = useMemo(() => deliveries.map((dc) => {
        const { dcNo, customerOrderId, address, RouteName, driverName, deliveredDate, customerName, returnEmptyCans, isDelivered } = dc
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


    const handleDCModalCancel = useCallback(() => onModalClose(), [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <div className='stock-delivery-container'>
            <div className='header'>
                <div className='left fit'>
                    <RoutesFilter
                        data={customerList}
                        title='Select Customers'
                        keyValue='customerId'
                        keyLabel='customerName'
                        onChange={onFilterChange}
                    />
                    <DateValue date={startDate} to={endDate} />
                    <div className='app-date-picker-wrapper'>
                        <div className='date-picker' onClick={() => setOpen(true)}>
                            <ScheduleIcon />
                            <span>Select Date</span>
                        </div>
                        <CustomButton
                            style={{ marginLeft: '1em' }}
                            className={`${filterBtnDisabled ? 'disabled' : ''}`}
                            text='Apply'
                            onClick={handleFilter}
                        />
                        <CustomRangeInput // Hidden in the DOM
                            open={open}
                            value={selectedRange}
                            style={{ left: 0 }}
                            type='range'
                            className='date-panel-picker'
                            onChange={handleDateSelect}
                            onOpenChange={datePickerStatus}
                        />
                    </div>
                </div>
                <div className='right more'>
                    <SearchInput
                        placeholder='Search Delivery Challan'
                        className='delivery-search'
                        width='50%'
                        reset={resetSearch}
                        onChange={handleSearch}
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