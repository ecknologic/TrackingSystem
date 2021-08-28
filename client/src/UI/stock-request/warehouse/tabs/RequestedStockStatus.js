import axios from 'axios';
import dayjs from 'dayjs';
import { Menu, message, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import Actions from '../../../../components/Actions';
import useUser from '../../../../utils/hooks/useUser';
import DateValue from '../../../../components/DateValue';
import SearchInput from '../../../../components/SearchInput';
import CustomModal from '../../../../components/CustomModal';
import ConfirmModal from '../../../../components/CustomModal';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import RequestedStockStatusView from '../views/RequestedStockStatus';
import { getStockRequestColumns } from '../../../../assets/fixtures';
import CustomDateInput from '../../../../components/CustomDateInput';
import CustomPagination from '../../../../components/CustomPagination';
import { MOTHERPLANTADMIN, TODAYDATE, TRACKFORM } from '../../../../utils/constants';
import { EditIconGrey, EyeIconGrey, ScheduleIcon } from '../../../../components/SVG_Icons';
import { deepClone, disableFutureDates, doubleKeyComplexSearch, getProductsForUI, getStatusColor, resetTrackForm, showToast } from '../../../../utils/Functions';
const DATEFORMAT = 'DD-MM-YYYY'
const dateFormatUI = 'DD/MM/YYYY'
const format = 'YYYY-MM-DD'

const MaterialStatus = ({ reFetch }) => {
    const { ROLE } = useUser()
    const [stock, setStock] = useState([])
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [viewData, setViewData] = useState({})
    const [formData, setFormData] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [searchON, setSeachON] = useState(false)
    const [filterON, setFilterON] = useState(false)
    const [pageNumber, setPageNumber] = useState(1)
    const [formErrors, setFormErrors] = useState({})
    const [stockClone, setStockClone] = useState([])
    const [viewModal, setViewModal] = useState(false)
    const [totalCount, setTotalCount] = useState(null)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [filteredClone, setFilteredClone] = useState([])
    const [confirmModal, setConfirmModal] = useState(false)
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const [resetSearch, setResetSearch] = useState(false)
    const [shake, setShake] = useState(false)

    const isMPAdmin = useMemo(() => ROLE === MOTHERPLANTADMIN, [])
    const stockRequestColumns = useMemo(() => getStockRequestColumns(isMPAdmin), [])
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
            setFormData({ reason: data.reason || '' })
        }
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

    const handleApprove = () => {
        const { requestId } = viewData
        const { reason } = formData
        updateStockStatus(requestId, 'Approved', reason)
    }

    const handleReject = () => {
        const { requestId } = viewData
        const { reason } = formData
        if (!reason.trim()) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            return setFormErrors({ reason: 'Reason is required on Reject' })
        }
        updateStockStatus(requestId, 'Rejected', reason)
    }

    const updateStockStatus = async (requestId, status, reason) => {
        const url = 'warehouse/updateRequestedStockStatus'
        const body = { requestId, status, reason }
        const options = { item: 'Stock Request', v1Ing: status === 'Approved' ? 'Approving' : 'Rejecting', v2: status }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.PUT(axios, url, body, config)
            showToast(options)
            optimisticUpdate(requestId, status, reason)
            onModalClose(true)
        } catch (error) {
            message.destroy()
            if (!axios.isCancel(error)) {
                setBtnDisabled(false)
            }
        }
    }

    const optimisticUpdate = (id, status, reason) => {
        let clone = deepClone(stock);
        const index = clone.findIndex(item => item.requestId === id)
        clone[index].status = status;
        clone[index].reason = reason;
        setStock(clone)
    }

    const dataSource = useMemo(() => stock.map((stock, index) => {
        const { requestId, requiredDate, status, departmentName, createdDateTime, products } = stock
        const productsForUI = getProductsForUI(JSON.parse(products))

        const getActions = () => {
            if (status === 'Approved' || !isMPAdmin)
                return [<Menu.Item key="view" icon={<EyeIconGrey />}>View</Menu.Item>]
            return [<Menu.Item key="view" icon={<EditIconGrey />}>Edit</Menu.Item>]
        }
        return {
            key: requestId,
            sNo: index + 1,
            departmentName,
            dateAndTime: dayjs(createdDateTime).format(dateFormatUI),
            requiredDate: dayjs(requiredDate).format(dateFormatUI),
            status: renderStatus(status),
            stockDetails: renderStockDetails(productsForUI),
            action: <Actions options={getActions(status)} onSelect={({ key }) => handleMenuSelect(key, stock)} />
        }
    }), [stock])

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
    const handleModalCancel = useCallback(() => setViewModal(false), [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    const { status } = viewData
    const canApprove = status === 'Rejected' || status === 'Pending'
    const canReject = status === 'Approved' || status === 'Pending'
    const editMode = status === 'Pending' && isMPAdmin

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
                twinTxt='Reject'
                visible={viewModal}
                bothDisabled={btnDisabled}
                showTwinBtn={editMode}
                twinDisabled={!canReject}
                onTwin={handleReject}
                onCancel={handleModalCancel}
                title='Requested Stock Details'
                okTxt={editMode ? 'Approve' : 'Close'}
                btnDisabled={!canApprove && editMode}
                onOk={editMode ? handleApprove : handleModalCancel}
                className={`
                    app-form-modal app-view-modal
                    ${shake ? 'app-shake' : ''}
                `}
            >
                <RequestedStockStatusView
                    data={viewData}
                    formData={formData}
                    errors={formErrors}
                    isMPAdmin={isMPAdmin}
                    editMode={editMode}
                    onChange={handleChange}
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

const renderStockDetails = ({ product20L = 0, product2L = 0, product1L = 0, product500ML = 0, product300ML = 0 }) => {
    return `
    20 ltrs - ${Number(product20L)}, 2 ltrs - ${Number(product2L)} boxes, 1 ltr - ${Number(product1L)} boxes, 
    500 ml - ${Number(product500ML)} boxes, 300 ml - ${Number(product300ML)} boxes
    `
}

export default MaterialStatus