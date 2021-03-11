import axios from 'axios';
import dayjs from 'dayjs';
import { Menu, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../modules/http';
import InternalQCView from '../views/InternalQC';
import Spinner from '../../../components/Spinner';
import { TODAYDATE } from '../../../utils/constants';
import DateValue from '../../../components/DateValue';
import SearchInput from '../../../components/SearchInput';
import Actions from '../../../components/Actions';
import CustomModal from '../../../components/CustomModal';
import { EditIconGrey, ScheduleIcon } from '../../../components/SVG_Icons';
import { internalQCColumns } from '../../../assets/fixtures';
import CustomDateInput from '../../../components/CustomDateInput';
import CustomPagination from '../../../components/CustomPagination';
import { disableFutureDates, doubleKeyComplexSearch, getStatusColor } from '../../../utils/Functions';
const DATEFORMAT = 'DD-MM-YYYY'
const DATEANDTIMEFORMAT = 'DD/MM/YYYY hh:mm A'
const format = 'YYYY-MM-DD'

const InternalQC = ({ reFetch }) => {
    const [loading, setLoading] = useState(true)
    const [viewData, setViewData] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [filteredClone, setFilteredClone] = useState([])
    const [viewModal, setViewModal] = useState(false)
    const [formTitle, setFormTitle] = useState('')
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const [open, setOpen] = useState(false)
    const [QC, setQC] = useState([])
    const [QCClone, setQCClone] = useState([])
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
        getQC()
    }, [reFetch])

    const getQC = async () => {
        const url = '/motherPlant/getProductionQcList'

        try {
            const data = await http.GET(axios, url, config)
            setQC(data)
            setQCClone(data)
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
        const filtered = QCClone.filter(item => dayjs(value).format(DATEFORMAT) === dayjs(item.dispatchedDate).format(DATEFORMAT))
        setQC(filtered)
        setFilteredClone(filtered)
        setTotalCount(filtered.length)
        setPageNumber(1)
        setFilterON(true)
        searchON && setResetSearch(!resetSearch)
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

    const handleSearch = (value) => {
        setPageNumber(1)
        if (value === "") {
            setTotalCount(QCClone.length)
            setQC(QCClone)
            setSeachON(false)
            return
        }
        const data = filterON ? filteredClone : QCClone
        const result = doubleKeyComplexSearch(data, value, 'batchId', 'managerName')
        setTotalCount(result.length)
        setQC(result)
        setSeachON(true)
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
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, qc)} />
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
                            className='date-panel-picker'
                            onChange={handleDateSelect}
                            onOpenChange={datePickerStatus}
                            disabledDate={disableFutureDates}
                        />
                    </div>
                </div>
                <div className='right'>
                    <SearchInput
                        placeholder='Search Batch'
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
const options = [<Menu.Item key="view" icon={<EditIconGrey />}>View/Edit</Menu.Item>]
export default InternalQC