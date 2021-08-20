import axios from 'axios';
import dayjs from 'dayjs';
import { Menu, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import Actions from '../../../../components/Actions';
import { TODAYDATE } from '../../../../utils/constants';
import DateValue from '../../../../components/DateValue';
import SearchInput from '../../../../components/SearchInput';
import CustomModal from '../../../../components/CustomModal';
import { stockRequestColumns } from '../../../../assets/fixtures';
import CustomDateInput from '../../../../components/CustomDateInput';
import CustomPagination from '../../../../components/CustomPagination';
import RequestedStockStatusView from '../views/RequestedStockStatus';
import { EyeIconGrey, ScheduleIcon } from '../../../../components/SVG_Icons';
import { disableFutureDates, doubleKeyComplexSearch, getProductsForUI, getStatusColor } from '../../../../utils/Functions';
const DATEFORMAT = 'DD-MM-YYYY'
const dateFormatUI = 'DD/MM/YYYY'
const format = 'YYYY-MM-DD'

const MaterialStatus = ({ reFetch }) => {
    const [loading, setLoading] = useState(true)
    const [viewData, setViewData] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [filteredClone, setFilteredClone] = useState([])
    const [viewModal, setViewModal] = useState(false)
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const [open, setOpen] = useState(false)
    const [stock, setStock] = useState([])
    const [stockClone, setStockClone] = useState([])
    const [resetSearch, setResetSearch] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [filterON, setFilterON] = useState(false)

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        return () => {
            http.ABORT(source)
        }
    }, [])

    useEffect(() => {
        setLoading(true)
        getStock()
    }, [reFetch])

    const getStock = async () => {
        const url = 'warehouse/getRequestedStock'

        try {
            const data = await http.GET(axios, url, config)
            setStock(data)
            setStockClone(data)
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
        const filtered = stockClone.filter(item => dayjs(value).format(DATEFORMAT) === dayjs(item.createdDateTime).format(DATEFORMAT))
        setStock(filtered)
        setTotalCount(filtered.length)
        setFilteredClone(filtered)
        setPageNumber(1)
        setFilterON(true)
        searchON && setResetSearch(!resetSearch)
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

    const handleSearch = (value) => {
        setPageNumber(1)
        if (value === "") {
            setTotalCount(stockClone.length)
            setStock(stockClone)
            setSeachON(false)
            return
        }
        const data = filterON ? filteredClone : stockClone
        const result = doubleKeyComplexSearch(data, value, 'requestId', 'departmentName')
        setTotalCount(result.length)
        setStock(result)
        setSeachON(true)
    }

    const dataSource = useMemo(() => stock.map((stock, index) => {
        const { requestId, requiredDate, status, departmentName, createdDateTime, products } = stock
        const productsForUI = getProductsForUI(JSON.parse(products))
        return {
            key: requestId,
            sNo: index + 1,
            departmentName,
            dateAndTime: dayjs(createdDateTime).format(dateFormatUI),
            requiredDate: dayjs(requiredDate).format(dateFormatUI),
            status: renderStatus(status),
            stockDetails: renderStockDetails(productsForUI),
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, stock)} />
        }
    }), [stock])

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
                        placeholder='Search Stock'
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
                    columns={stockRequestColumns}
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
                title='Requested Stock Details'
                onOk={handleModalCancel}
                onCancel={handleModalCancel}
                className='app-form-modal app-view-modal'
            >
                <RequestedStockStatusView data={viewData} />
            </CustomModal>
        </div>
    )
}

const renderStatus = (status) => {
    const color = getStatusColor(status)
    return (
        <div className='status'>
            <span className='app-dot' style={{ background: color }}></span>
            <span className='status-text'>{status}</span>
        </div>
    )
}

const renderStockDetails = ({ product20L = 0, product2L = 0, product1L = 0, product500ML = 0, product300ML = 0 }) => {
    return `
    20 ltrs - ${Number(product20L)}, 2 ltrs - ${Number(product2L)} boxes, 1 ltr - ${Number(product1L)} boxes, 
    500 ml - ${Number(product500ML)} boxes, 300 ml - ${Number(product300ML)} boxes
    `
}

const options = [<Menu.Item key="view" icon={<EyeIconGrey />}>View</Menu.Item>]

export default MaterialStatus