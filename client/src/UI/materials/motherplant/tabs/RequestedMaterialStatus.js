import axios from 'axios';
import dayjs from 'dayjs';
import { Menu, message, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import Actions from '../../../../components/Actions';
import DateValue from '../../../../components/DateValue';
import { getRMColumns } from '../../../../assets/fixtures';
import SearchInput from '../../../../components/SearchInput';
import CustomModal from '../../../../components/CustomModal';
import ConfirmModal from '../../../../components/CustomModal';
import { TODAYDATE, TRACKFORM } from '../../../../utils/constants';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import CustomDateInput from '../../../../components/CustomDateInput';
import CustomPagination from '../../../../components/CustomPagination';
import RequestedMaterialStatusView from '../views/RequestedMaterialStatus';
import { EditIconGrey, ScheduleIcon } from '../../../../components/SVG_Icons';
import { deepClone, disableFutureDates, doubleKeyComplexSearch, getStatusColor, resetTrackForm, showToast } from '../../../../utils/Functions';
const DATEFORMAT = 'DD-MM-YYYY'
const format = 'YYYY-MM-DD'

const MaterialStatus = ({ reFetch, isSuperAdmin = false }) => {
    const [loading, setLoading] = useState(true)
    const [viewData, setViewData] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [filteredClone, setFilteredClone] = useState([])
    const [viewModal, setViewModal] = useState(false)
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const [confirmModal, setConfirmModal] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [open, setOpen] = useState(false)
    const [RM, setRM] = useState([])
    const [RMClone, setRMClone] = useState([])
    const [formTitle, setFormTitle] = useState('')
    const [resetSearch, setResetSearch] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [filterON, setFilterON] = useState(false)
    const [shake, setShake] = useState(false)

    const RMColumns = useMemo(() => getRMColumns(null, isSuperAdmin), [])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        return () => {
            http.ABORT(source)
        }
    }, [])

    useEffect(() => {
        setLoading(true)
        getRM()
    }, [reFetch])

    const getRM = async () => {
        const url = `motherPlant/getRMDetails?isSuperAdmin=${isSuperAdmin}`

        try {
            const data = await http.GET(axios, url, config)
            setRM(data)
            setRMClone(data)
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
        const filtered = RMClone.filter(item => dayjs(value).format(DATEFORMAT) === dayjs(item.requestedDate).format(DATEFORMAT))
        setRM(filtered)
        setTotalCount(filtered.length)
        setFilteredClone(filtered)
        setPageNumber(1)
        setFilterON(true)
        searchON && setResetSearch(!resetSearch)
    }

    const handleMenuSelect = (key, data) => {
        if (key === 'view') {
            setFormTitle(`Requested Material Details - ${data.orderId}`)
            setViewData(data)
            setFormData({ reason: data.reason || '' })
            setViewModal(true)
        }
    }

    const handleApprove = () => {
        const { rawmaterialid: id, itemCode } = viewData
        const { reason } = formData
        updateRMStatus(id, itemCode, 'Approved', reason)
    }

    const handleReject = () => {
        const { rawmaterialid: id, itemCode } = viewData
        const { reason } = formData
        if (!reason.trim()) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            return setFormErrors({ reason: 'Reason is required on Reject' })
        }
        updateRMStatus(id, itemCode, 'Rejected', reason)
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))
    }

    const handlePageChange = (number) => {
        setPageNumber(number)
    }

    const handleSizeChange = (number, size) => {
        setPageSize(size)
        setPageNumber(number)
    }

    const updateRMStatus = async (rawmaterialid, itemCode, status, reason) => {
        const url = 'motherPlant/updateRMStatus'
        const body = { rawmaterialid, status, reason, itemCode }
        const options = { item: 'Material Request', v1Ing: status === 'Approved' ? 'Approving' : 'Rejecting', v2: status }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.PUT(axios, url, body, config)
            showToast(options)
            optimisticUpdate(rawmaterialid, status, reason)
            onModalClose(true)
        } catch (error) {
            message.destroy()
            if (!axios.isCancel(error)) {
                setBtnDisabled(false)
            }
        }
    }

    const optimisticUpdate = (id, status, reason) => {
        let clone = deepClone(RM);
        const index = clone.findIndex(item => item.rawmaterialid === id)
        clone[index].status = status;
        clone[index].reason = reason;
        setRM(clone)
    }

    const handleSearch = (value) => {
        setPageNumber(1)
        if (value === "") {
            setTotalCount(RMClone.length)
            setRM(RMClone)
            setSeachON(false)
            return
        }
        const data = filterON ? filteredClone : RMClone
        const result = doubleKeyComplexSearch(data, value, 'orderId', 'itemName')
        setTotalCount(result.length)
        setRM(result)
        setSeachON(true)
    }

    const dataSource = useMemo(() => RM.map((dispatch) => {
        const { rawmaterialid: key, orderId, itemName, requestedDate, reorderLevel,
            minOrderLevel, vendorName, itemQty, status, departmentName } = dispatch

        return {
            key,
            orderId,
            itemQty,
            reorderLevel,
            vendorName,
            minOrderLevel,
            departmentName,
            itemName,
            dateAndTime: dayjs(requestedDate).format('DD/MM/YYYY'),
            status: renderStatus(status),
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, dispatch)} />
        }
    }), [RM])

    const onModalClose = (hasSaved) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasSaved) {
            return setConfirmModal(true)
        }
        setViewModal(false)
        setBtnDisabled(false)
        setFormData({})
        setFormErrors({})
    }

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false);
        resetTrackForm()
        onModalClose()
    }, [])
    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])
    const handleModalCancel = useCallback(() => onModalClose(), [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    const { status } = viewData
    const canApprove = status === 'Rejected' || status === 'Pending'
    const canReject = status === 'Approved' || status === 'Pending'
    const editMode = status !== 'Confirmed'

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
                        placeholder='Search Material'
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
                bothDisabled={btnDisabled}
                showTwinBtn={isSuperAdmin && editMode}
                twinDisabled={!canReject}
                btnDisabled={isSuperAdmin && !canApprove && editMode}
                twinTxt='Reject'
                okTxt={isSuperAdmin && editMode ? 'Approve' : 'Close'}
                visible={viewModal}
                title={formTitle}
                onOk={isSuperAdmin && editMode ? handleApprove : handleModalCancel}
                onTwin={handleReject}
                onCancel={handleModalCancel}
                className={`
                    app-form-modal app-view-modal
                    ${shake ? 'app-shake' : ''}
                `}
            >
                <RequestedMaterialStatusView
                    data={viewData}
                    formData={formData}
                    errors={formErrors}
                    onChange={handleChange}
                    isSuperAdmin={isSuperAdmin}
                    editMode={editMode}
                />
            </CustomModal>
            <ConfirmModal
                visible={confirmModal}
                onOk={handleConfirmModalOk}
                onCancel={handleConfirmModalCancel}
                title='Are you sure you want to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </ConfirmModal>
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

const options = [<Menu.Item key="view" icon={<EditIconGrey />}>View/Edit</Menu.Item>]

export default MaterialStatus