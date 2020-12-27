import dayjs from 'dayjs';
import { Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { http } from '../../../modules/http';
import Spinner from '../../../components/Spinner';
import { ScheduleIcon } from '../../../components/SVG_Icons';
import TableAction from '../../../components/TableAction';
import SearchInput from '../../../components/SearchInput';
import { TODAYDATE, TRACKFORM } from '../../../utils/constants';
import CustomPagination from '../../../components/CustomPagination';
import { getDispatchColumns } from '../../../assets/fixtures';
import { disableFutureDates, getStatusColor } from '../../../utils/Functions';
import DateValue from '../../../components/DateValue';
import CustomDateInput from '../../../components/CustomDateInput';
const DATEFORMAT = 'DD-MM-YYYY'
const DATEANDTIMEFORMAT = 'DD/MM/YYYY hh:mm A'
const format = 'YYYY-MM-DD'

const Dispatches = ({ reFetch }) => {
    const [loading, setLoading] = useState(true)
    const [viewData, setViewData] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [viewModal, setViewModal] = useState(false)
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const [open, setOpen] = useState(false)
    const [dispatches, setDispatches] = useState([])
    const [dispatchesClone, setDispatchesClone] = useState([])

    const dispatchColumns = useMemo(() => getDispatchColumns(), [])

    useEffect(() => {
        setLoading(true)
        getDispatches()
    }, [reFetch])

    const getDispatches = async () => {
        const data = await http.GET('/motherPlant/getDispatchDetails')
        setDispatches(data)
        setDispatchesClone(data)
        setTotalCount(data.length)
        setLoading(false)
    }

    const datePickerStatus = (status) => {
        !status && setOpen(false)
    }

    const handleDateSelect = (value) => {
        setOpen(false)
        setSelectedDate(dayjs(value).format(format))
        const filtered = dispatchesClone.filter(item => dayjs(value).format(DATEFORMAT) === dayjs(item.dispatchedDate).format(DATEFORMAT))
        setDispatches(filtered)
        setTotalCount(filtered.length)
        setPageNumber(1)
    }

    const handleMenuSelect = (key, data) => {
        if (key === 'view') {
            setViewData(data)
            setViewModal(true)
        }
    }

    const handlePageChange = (number) => {
        setPageNumber(number)
    }

    const handleSizeChange = (number, size) => {
        setPageSize(size)
        setPageNumber(number)
    }

    const dataSource = useMemo(() => dispatches.map((dispatch) => {
        const { DCNO: dcnumber, batchId, dispatchedDate, vehicleNo,
            dispatchAddress, vehicleType, driverName, status } = dispatch
        return {
            key: dcnumber,
            dcnumber,
            batchId,
            vehicleNo: vehicleNo + ' ' + vehicleType,
            driverName,
            dispatchTo: dispatchAddress,
            dateAndTime: dayjs(dispatchedDate).format(DATEANDTIMEFORMAT),
            productionDetails: renderOrderDetails(dispatch),
            status: renderStatus(status),
            action: <TableAction onSelect={({ key }) => handleMenuSelect(key, dispatch)} />
        }
    }), [dispatches])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <div className='stock-delivery-container'>
            <div className='header'>
                <div className='left'>
                    <DateValue date={selectedDate} />
                    <div className='app-date-picker-wrapper'>
                        <div className='date-picker' onClick={() => setOpen(true)}>
                            <ScheduleIcon />
                            <span>Select Date</span>
                        </div>
                        <CustomDateInput // Hidden in the DOM
                            open={open}
                            style={{ left: 0 }}
                            value={selectedDate}
                            placeholder='Select Date'
                            className='date-panel-picker'
                            onChange={handleDateSelect}
                            onOpenChange={datePickerStatus}
                            disabledDate={disableFutureDates}
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
            <div className='app-table dispatch-table'>
                <Table
                    loading={{ spinning: loading, indicator: <Spinner /> }}
                    dataSource={dataSource.slice(sliceFrom, sliceTo)}
                    columns={dispatchColumns}
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

const renderOrderDetails = ({ product20L, product1L, product500ML, product250ML }) => {
    return `
    20 lts - ${product20L ? product20L : 0}, 1 ltr - ${product1L ? product1L : 0} boxes, 
    500 ml - ${product500ML ? product500ML : 0} boxes, 250 ml - ${product250ML ? product250ML : 0} boxes
    `
}
export default Dispatches