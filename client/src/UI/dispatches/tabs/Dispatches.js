import axios from 'axios';
import dayjs from 'dayjs';
import { Menu, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../modules/http';
import DispatchView from '../views/Dispatch';
import Spinner from '../../../components/Spinner';
import { TODAYDATE } from '../../../utils/constants';
import DateValue from '../../../components/DateValue';
import { EditIconGrey, ScheduleIcon } from '../../../components/SVG_Icons';
import Actions from '../../../components/Actions';
import SearchInput from '../../../components/SearchInput';
import CustomModal from '../../../components/CustomModal';
import { getDispatchColumns } from '../../../assets/fixtures';
import CustomDateInput from '../../../components/CustomDateInput';
import CustomPagination from '../../../components/CustomPagination';
import { disableFutureDates, doubleKeyComplexSearch, getStatusColor } from '../../../utils/Functions';
const DATEFORMAT = 'DD-MM-YYYY'
const DATEANDTIMEFORMAT = 'DD/MM/YYYY hh:mm A'
const format = 'YYYY-MM-DD'

const Dispatches = ({ reFetch }) => {
    const [loading, setLoading] = useState(true)
    const [viewData, setViewData] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const [dispatchesClone, setDispatchesClone] = useState([])
    const [filteredClone, setFilteredClone] = useState([])
    const [viewModal, setViewModal] = useState(false)
    const [formTitle, setFormTitle] = useState('')
    const [dispatches, setDispatches] = useState([])
    const [resetSearch, setResetSearch] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [filterON, setFilterON] = useState(false)
    const [open, setOpen] = useState(false)

    const dispatchColumns = useMemo(() => getDispatchColumns(), [])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        return () => {
            http.ABORT(source)
        }
    }, [])

    useEffect(() => {
        setLoading(true)
        getDispatches()
    }, [reFetch])

    const getDispatches = async () => {
        const url = '/motherPlant/getDispatchDetails'

        try {
            const data = await http.GET(axios, url, config)
            setDispatches(data)
            setDispatchesClone(data)
            setTotalCount(data.length)
            setLoading(false)
        } catch (error) { }
    }

    const datePickerStatus = (status) => {
        !status && setOpen(false)
    }

    const handleDateSelect = (value) => {
        setOpen(false)
        setSelectedDate(dayjs(value).format(format))
        const filtered = dispatchesClone.filter(item => dayjs(value).format(DATEFORMAT) === dayjs(item.dispatchedDate).format(DATEFORMAT))
        setDispatches(filtered)
        setFilteredClone(filtered)
        setTotalCount(filtered.length)
        setPageNumber(1)
        setFilterON(true)
        searchON && setResetSearch(!resetSearch)
    }

    const handleMenuSelect = (key, data) => {
        if (key === 'view') {
            setFormTitle(`Dispatch Details - ${data.DCNO}`)
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

    const handleSearch = (value) => {
        setPageNumber(1)
        if (value === "") {
            setTotalCount(dispatchesClone.length)
            setDispatches(dispatchesClone)
            setSeachON(false)
            return
        }
        const data = filterON ? filteredClone : dispatchesClone
        const result = doubleKeyComplexSearch(data, value, 'dcNo', 'batchId')
        setTotalCount(result.length)
        setDispatches(result)
        setSeachON(true)
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
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, dispatch)} />
        }
    }), [dispatches])

    const handleModalCancel = useCallback(() => setViewModal(false), [])

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
                            className='app-date-panel-picker'
                            onChange={handleDateSelect}
                            onOpenChange={datePickerStatus}
                            disabledDate={disableFutureDates}
                        />
                    </div>
                </div>
                <div className='right'>
                    <SearchInput
                        placeholder='Search Dispatches'
                        className='delivery-search'
                        reset={resetSearch}
                        onChange={handleSearch}
                        width='50%'
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
            <CustomModal
                hideCancel
                okTxt='Close'
                visible={viewModal}
                title={formTitle}
                onOk={handleModalCancel}
                onCancel={handleModalCancel}
                className='app-form-modal app-view-modal'
            >
                <DispatchView
                    data={viewData}
                />
            </CustomModal>
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

const renderOrderDetails = ({ product20L = 0, product2L = 0, product1L = 0, product500ML = 0, product300ML = 0 }) => {
    return `
    20 ltrs - ${Number(product20L)}, 2 ltrs - ${Number(product2L)} boxes, 1 ltr - ${Number(product1L)} boxes, 
    500 ml - ${Number(product500ML)} boxes, 300 ml - ${Number(product300ML)} boxes
    `
}
const options = [<Menu.Item key="view" icon={<EditIconGrey />}>View/Edit</Menu.Item>]
export default Dispatches