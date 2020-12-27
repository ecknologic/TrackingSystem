import dayjs from 'dayjs';
import { Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../modules/http';
import InternalQCView from '../views/InternalQC';
import Spinner from '../../../components/Spinner';
import { TODAYDATE } from '../../../utils/constants';
import DateValue from '../../../components/DateValue';
import SearchInput from '../../../components/SearchInput';
import TableAction from '../../../components/TableAction';
import CustomModal from '../../../components/CustomModal';
import { ScheduleIcon } from '../../../components/SVG_Icons';
import { internalQCColumns } from '../../../assets/fixtures';
import CustomDateInput from '../../../components/CustomDateInput';
import CustomPagination from '../../../components/CustomPagination';
import { disableFutureDates, getStatusColor } from '../../../utils/Functions';
const DATEFORMAT = 'DD-MM-YYYY'
const DATEANDTIMEFORMAT = 'DD/MM/YYYY hh:mm A'
const format = 'YYYY-MM-DD'

const InternalQC = () => {
    const [loading, setLoading] = useState(true)
    const [viewData, setViewData] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [viewModal, setViewModal] = useState(false)
    const [formTitle, setFormTitle] = useState('')
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const [open, setOpen] = useState(false)
    const [QC, setQC] = useState([])
    const [QCClone, setQCClone] = useState([])

    useEffect(() => {
        getQC()
    }, [])

    const getQC = async () => {
        const data = await http.GET('/motherPlant/getProductionQcList')
        setQC(data)
        setQCClone(data)
        setTotalCount(data.length)
        setLoading(false)
    }

    const datePickerStatus = (status) => {
        !status && setOpen(false)
    }

    const handleDateSelect = (value) => {
        setOpen(false)
        setSelectedDate(dayjs(value).format(format))
        const filtered = QCClone.filter(item => dayjs(value).format(DATEFORMAT) === dayjs(item.dispatchedDate).format(DATEFORMAT))
        setQC(filtered)
        setTotalCount(filtered.length)
        setPageNumber(1)
    }

    const handleMenuSelect = (key, data) => {
        if (key === 'view') {
            setFormTitle(`Quality Control - ${data.batchId}`)
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

    const dataSource = useMemo(() => QC.map((qc) => {
        const { productionQcId: key, batchId, phLevel, TDS,
            ozoneLevel, managerName, requestedDate, shiftType, status } = qc
        return {
            key,
            TDS,
            phLevel,
            batchId,
            ozoneLevel,
            managerName,
            shiftType,
            dateAndTime: dayjs(requestedDate).format(DATEANDTIMEFORMAT),
            status: renderStatus(status),
            action: <TableAction onSelect={({ key }) => handleMenuSelect(key, qc)} />
        }
    }), [QC])

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
                        onSearch={() => { }}
                        onChange={() => { }}
                    />

                </div>
            </div>
            <div className='app-table dispatch-table'>
                <Table
                    loading={{ spinning: loading, indicator: <Spinner /> }}
                    dataSource={dataSource.slice(sliceFrom, sliceTo)}
                    columns={internalQCColumns}
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
                <InternalQCView
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

export default InternalQC