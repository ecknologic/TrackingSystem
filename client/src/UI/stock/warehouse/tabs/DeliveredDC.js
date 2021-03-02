import axios from 'axios';
import { Menu, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import Actions from '../../../../components/Actions';
import DateValue from '../../../../components/DateValue';
import QuitModal from '../../../../components/CustomModal';
import SearchInput from '../../../../components/SearchInput';
import CustomModal from '../../../../components/CustomModal';
import { deliveryColumns } from '../../../../assets/fixtures';
import RoutesFilter from '../../../../components/RoutesFilter';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import CustomPagination from '../../../../components/CustomPagination';
import CustomRangeInput from '../../../../components/CustomRangeInput';
import { EyeIconGrey, ScheduleIcon } from '../../../../components/SVG_Icons';
import { getWarehoseId, TODAYDATE, TRACKFORM } from '../../../../utils/constants';
import { validateMobileNumber, validateNames, validateNumber, validateDCValues } from '../../../../utils/validations';
import { isEmpty, resetTrackForm, getDCValuesForDB, showToast, deepClone, getStatusColor } from '../../../../utils/Functions';
import DCView from '../../../accounts/view/views/DCView';
const APIDATEFORMAT = 'YYYY-MM-DD'

const DeliveredDC = () => {
    const warehouseId = getWarehoseId()
    const [customerList, setCustomerList] = useState([])
    const [loading, setLoading] = useState(true)
    const [deliveriesClone, setDeliveriesClone] = useState([])
    const [deliveries, setDeliveries] = useState([])
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [DCModal, setDCModal] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [startDate, setStartDate] = useState(TODAYDATE)
    const [generateDisabled, setGenerateDisabled] = useState(true)
    const [endDate, setEndDate] = useState(TODAYDATE)
    const [selectedRange, setSelectedRange] = useState([])
    const [filterInfo, setFilterInfo] = useState([])
    const [open, setOpen] = useState(false)
    const [shake, setShake] = useState(false)
    const [okTxt, setOkTxt] = useState('')
    const [title, setTitle] = useState('')
    const [mode, setMode] = useState(false)

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        setLoading(true)
        getDeliveries()
        getRoutes()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getRoutes = async () => {
        const url = `/customer/getCustomers`

        try {
            const data = await http.GET(axios, url, config)
            setCustomerList(data)
        } catch (error) { }
    }

    const getDeliveries = async () => {
        const url = `/warehouse/getAllDcDetails?fromDate=${startDate}&toDate=${endDate}`

        try {
            const data = await http.GET(axios, url, config)
            setPageNumber(1)
            setDeliveriesClone(data)
            setLoading(false)
            if (!isEmpty(filterInfo)) {
                generateFiltered(data, filterInfo)
            }
            else {
                setTotalCount(data.length)
                setDeliveries(data)
            }
        } catch (error) { }
    }

    const onFilterChange = (data) => {
        setPageNumber(1)
        setFilterInfo(data)
        if (isEmpty(data)) {
            setDeliveries(deliveriesClone)
            setTotalCount(deliveriesClone.length)
        }
        else generateFiltered(deliveriesClone, data)
    }

    const generateFiltered = (original, filterInfo) => {
        const filtered = original.filter((item) => filterInfo.includes(item.customerId))
        setDeliveries(filtered)
        setTotalCount(filtered.length)
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
        setGenerateDisabled(false)
        setTimeout(() => setSelectedRange([]), 820)
        setPageNumber(1)
    }

    const handlePageChange = (number) => {
        setPageNumber(number)
    }

    const handleSizeChange = (number, size) => {
        setPageSize(size)
        setPageNumber(number)
    }

    const optimisticUpdate = (data, method) => {
        if (method === 'PUT') {
            const clone = deepClone(deliveries)
            const index = clone.findIndex(dc => dc.customerOrderId === data.customerOrderId)
            clone[index] = data
            setDeliveries(clone)
        }
        else setDeliveries([data, ...deliveries])
    }

    const onModalClose = (hasSaved) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasSaved) {
            return setConfirmModal(true)
        }
        setDCModal(false)
        setBtnDisabled(false)
        setFormData({})
        setFormErrors({})
    }

    const dataSource = useMemo(() => deliveries.map((dc) => {
        const { dcNo, customerOrderId, address, RouteName, driverName, customerName, isDelivered } = dc
        return {
            key: customerOrderId || dcNo,
            dcnumber: dcNo,
            shopAddress: address,
            route: RouteName,
            name: customerName,
            driverName: driverName || 'Not Assigned',
            orderDetails: renderOrderDetails(dc),
            status: renderStatus(isDelivered),
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, dc)} />
        }
    }), [deliveries])

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false);
        resetTrackForm()
        onModalClose()
    }, [])

    const onCreateDC = useCallback(() => {
        setMode('create')
        setTitle('Add New DC')
        setOkTxt('Save')
        setDCModal(true)
    }, [])

    const handleDCModalCancel = useCallback(() => onModalClose(), [])
    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize
    const disabledItems = mode === 'view' ? 'ALL' : mode === 'create' ? 'NONE' : 'FEW'
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
                        {/* <CustomButton
                            style={{ marginLeft: '1em' }}
                            className={`${generateDisabled ? 'disabled' : ''}`}
                            text='Generate'
                        onClick={handleGenerateInvoices}
                        /> */}
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
                className={`app-form-modal ${shake ? 'app-shake' : ''}`}
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