import dayjs from 'dayjs';
import { Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import { ScheduleIcon } from '../../../../components/SVG_Icons';
import TableAction from '../../../../components/TableAction';
import SearchInput from '../../../../components/SearchInput';
import { TODAYDATE } from '../../../../utils/constants';
import CustomPagination from '../../../../components/CustomPagination';
import { getRMColumns } from '../../../../assets/fixtures';
import DateValue from '../../../../components/DateValue';
import CustomDateInput from '../../../../components/CustomDateInput';
import CustomModal from '../../../../components/CustomModal';
import { disableFutureDates, getStatusColor } from '../../../../utils/Functions';
import RequestedMaterialStatusView from '../views/RequestedMaterialStatus';
const DATEFORMAT = 'DD-MM-YYYY'
const format = 'YYYY-MM-DD'

const MaterialStatus = ({ reFetch }) => {
    const [loading, setLoading] = useState(true)
    const [viewData, setViewData] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [viewModal, setViewModal] = useState(false)
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const [open, setOpen] = useState(false)
    const [RM, setRM] = useState([])
    const [RMClone, setRMClone] = useState([])
    const [formTitle, setFormTitle] = useState('')

    const RMColumns = useMemo(() => getRMColumns(), [])

    useEffect(() => {
        setLoading(true)
        getRM()
    }, [reFetch])

    const getRM = async () => {
        const data = await http.GET('/motherPlant/getRMDetails')
        setRM(data)
        setRMClone(data)
        setTotalCount(data.length)
        setLoading(false)
    }

    const datePickerStatus = (status) => {
        !status && setOpen(false)
    }

    const handleDateSelect = (value) => {
        setOpen(false)
        setSelectedDate(dayjs(value).format(format))
        const filtered = RMClone.filter(item => dayjs(value).format(DATEFORMAT) === dayjs(item.requestedDate).format(DATEFORMAT))
        setRM(filtered)
        setTotalCount(filtered.length)
        setPageNumber(1)
    }

    const handleMenuSelect = (key, data) => {
        if (key === 'view') {
            setFormTitle(`Requested Material Details - ${data.orderId}`)
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

    const dataSource = useMemo(() => RM.map((dispatch) => {
        const { rawmaterialid: key, orderId, itemName, requestedDate, reorderLevel,
            minOrderLevel, vendorName, itemQty, status } = dispatch
        return {
            key,
            orderId,
            itemQty,
            reorderLevel,
            vendorName,
            minOrderLevel,
            itemName,
            dateAndTime: dayjs(requestedDate).format('DD/MM/YYYY'),
            status: renderStatus(status),
            action: <TableAction onSelect={({ key }) => handleMenuSelect(key, dispatch)} />
        }
    }), [RM])

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
                    />
                </div>
            </div>
            <div className='app-table dispatch-table'>
                <Table
                    loading={{ spinning: loading, indicator: <Spinner /> }}
                    dataSource={dataSource.slice(sliceFrom, sliceTo)}
                    columns={RMColumns}
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
                <RequestedMaterialStatusView
                    data={viewData}
                />
            </CustomModal>
        </div>
    )
}

const renderStatus = (status) => {
    const color = getStatusColor(status)
    const text = status === 'Pending' ? status : 'Approved'
    return (
        <div className='status'>
            <span className='app-dot' style={{ background: color }}></span>
            <span className='status-text'>{text}</span>
        </div>
    )
}

export default MaterialStatus