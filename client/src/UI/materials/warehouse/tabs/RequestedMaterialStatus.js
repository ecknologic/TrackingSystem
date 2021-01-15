import dayjs from 'dayjs';
import { Menu, Table } from 'antd';
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
import { deepClone, disableFutureDates, getStatusColor, resetTrackForm, showToast } from '../../../../utils/Functions';
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
    const [viewModal, setViewModal] = useState(false)
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const [confirmModal, setConfirmModal] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)
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
        const data = await http.GET(`/motherPlant/getRMDetails?isSuperAdmin=${isSuperAdmin}`)
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
        else if (key === 'approve') {
            updateRMStatus(data.rawmaterialid, 'Approved')
        }
        else if (key === 'reject') {
            updateRMStatus(data.rawmaterialid, 'Rejected')
        }
    }

    const handleApprove = () => {
        const { rawmaterialid: id } = viewData
        updateRMStatus(id, 'Approved')
    }

    const handleReject = () => {
        const { rawmaterialid: id } = viewData
        const { reason = '' } = formData
        if (!reason.trim()) return setFormErrors({ reason: 'Reason is required on Reject ' })
        updateRMStatus(id, 'Rejected')
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

    const updateRMStatus = async (rawmaterialid, status) => {
        const url = '/motherPlant/updateRMStatus'
        const body = { rawmaterialid, status }
        const options = { item: 'Order', v1Ing: status === 'Approved' ? 'Approving' : 'Rejecting', v2: status }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.PUT(url, body)
            showToast(options)
            optimisticUpdate(rawmaterialid, status)
            onModalClose(true)
        } catch (error) {
            setBtnDisabled(false)
        }
    }

    const optimisticUpdate = (id, status) => {
        let clone = deepClone(RM);
        const index = clone.findIndex(item => item.rawmaterialid === id)
        clone[index].status = status;
        setRM(clone)
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

    const canApprove = viewData.status === 'Rejected' || viewData.status === 'Pending'
    const canReject = viewData.status === 'Approved' || viewData.status === 'Pending'

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
                bothDisabled={btnDisabled}
                showTwinBtn={isSuperAdmin}
                twinDisabled={!canReject}
                btnDisabled={isSuperAdmin && !canApprove}
                twinTxt='Reject'
                okTxt={isSuperAdmin ? 'Approve' : 'Close'}
                visible={viewModal}
                title={formTitle}
                onOk={isSuperAdmin ? handleApprove : handleModalCancel}
                onTwin={handleReject}
                onCancel={handleModalCancel}
                className='app-form-modal app-view-modal'
            >
                <RequestedMaterialStatusView
                    data={viewData}
                    formData={formData}
                    errors={formErrors}
                    onChange={handleChange}
                    isSuperAdmin={isSuperAdmin}
                />
            </CustomModal>
            <ConfirmModal
                visible={confirmModal}
                onOk={handleConfirmModalOk}
                onCancel={handleConfirmModalCancel}
                title='Are you sure to leave?'
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