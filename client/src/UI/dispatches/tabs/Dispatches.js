import { DatePicker, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { http } from '../../../modules/http';
import Spinner from '../../../components/Spinner';
import QuitModal from '../../../components/CustomModal';
import { ScheduleIcon } from '../../../components/SVG_Icons';
import TableAction from '../../../components/TableAction';
import SearchInput from '../../../components/SearchInput';
import ConfirmMessage from '../../../components/ConfirmMessage';
import { getWarehoseId, TRACKFORM } from '../../../utils/constants';
import CustomPagination from '../../../components/CustomPagination';
import { dispatchColumns } from '../../../assets/fixtures';
import { disableFutureDates } from '../../../utils/Functions';

const Dispatches = ({ date }) => {
    const warehouseId = getWarehoseId()
    const [routes, setRoutes] = useState([])
    const [drivers, setDrivers] = useState([])
    const [loading, setLoading] = useState(false)
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
    const [filterInfo, setFilterInfo] = useState([])
    const [shake, setShake] = useState(false)
    const [open, setOpen] = useState(false)

    const customerOrderIdRef = useRef()
    const DCFormTitleRef = useRef()
    const DCFormBtnRef = useRef()

    useEffect(() => {
        // getRoutes()
        // getDrivers()
    }, [])

    useEffect(() => {
        // getDeliveries()
    }, [date])

    const getRoutes = async () => {
        const data = await http.GET('/warehouse/getroutes')
        setRoutes(data)
    }

    const getDrivers = async () => {
        const url = `/warehouse/getdriverDetails/${warehouseId}`
        const data = await http.GET(url)
        setDrivers(data)
    }

    const getDeliveries = async () => {
        setLoading(true)
        const url = `/warehouse/deliveryDetails/${date}`
        const data = await http.GET(url)
        setPageNumber(1)
        setDeliveriesClone(data)
        setLoading(false)
        if (filterInfo.length) {
            generateFiltered(data, filterInfo)
        }
        else {
            setTotalCount(data.length)
            setDeliveries(data)
        }
    }

    const datePickerStatus = (status) => {
        !status && setOpen(false)
    }

    const handleDateSelect = (value) => {
        setOpen(false)
    }

    const generateFiltered = (original, filterInfo) => {
        const filtered = original.filter((item) => filterInfo.includes(item.RouteId))
        setDeliveries(filtered)
        setTotalCount(filtered.length)
    }

    const handleMenuSelect = (key, data) => {
        if (key === 'view') {
            customerOrderIdRef.current = data.customerOrderId
            DCFormTitleRef.current = `DC - ${data.customerName}`
            DCFormBtnRef.current = 'Update'
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
        customerOrderIdRef.current = undefined
        setDCModal(false)
        setBtnDisabled(false)
        setFormData({})
        setFormErrors({})
    }

    const dataSource = useMemo(() => deliveries.map((delivery) => {
        const { dcNo, address, RouteName, driverName, isDelivered } = delivery
        return {
            key: dcNo,
            dcnumber: dcNo,
            shopAddress: address,
            route: RouteName,
            driverName: driverName,
            orderDetails: renderOrderDetails(delivery),
            status: renderStatus(isDelivered),
            action: <TableAction onSelect={({ key }) => handleMenuSelect(key, delivery)} />
        }
    }), [deliveries])

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false);
        onModalClose()
    }, [])

    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <div className='stock-delivery-container'>
            <div className='header'>
                <div className='left'>
                    <div className='app-date-picker-wrapper'>
                        <div className='date-picker' onClick={() => setOpen(true)}>
                            <ScheduleIcon />
                            <span>Select Date</span>
                        </div>
                        <DatePicker // Hidden in the DOM
                            open={open}
                            style={{ left: 0 }}
                            placeholder='Select Date'
                            className='date-panel-picker'
                            onChange={handleDateSelect}
                            onOpenChange={datePickerStatus}
                            disabledDate={disableFutureDates}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                        />
                    </div>
                </div>
                <div className='right'>
                    <SearchInput
                        placeholder='Search Delivery Challan'
                        className='delivery-search'
                        width='50%'
                        onSearch={() => { }}
                        onChange={() => { }}
                    />

                </div>
            </div>
            <div className='stock-delivery-table'>
                <Table
                    loading={{ spinning: loading, indicator: <Spinner /> }}
                    dataSource={dataSource.slice(sliceFrom, sliceTo)}
                    columns={dispatchColumns}
                    pagination={false}
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
            <QuitModal
                visible={confirmModal}
                onOk={handleConfirmModalOk}
                onCancel={handleConfirmModalCancel}
                title='Are you sure to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </QuitModal>
        </div>
    )
}

const renderStatus = (delivered) => {
    const color = delivered === 'Inprogress' ? '#A10101' : '#0EDD4D'
    const text = delivered === 'Inprogress' ? 'Pending' : 'Delivered'
    return (
        <div className='status'>
            <span className='dot' style={{ background: color }}></span>
            <span className='status-text'>{text}</span>
        </div>
    )
}

const renderOrderDetails = ({ cans20L, boxes1L, boxes500ML, boxes250ML }) => {
    return `
    20 lts - ${cans20L}, 1 ltr - ${boxes1L} boxes, 
    500 ml - ${boxes500ML} boxes, 250 ml - ${boxes250ML} boxes
    `
}
export default Dispatches