import axios from 'axios';
import dayjs from 'dayjs';
import { Menu, message, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import EmptyCansView from '../views/EmptyCans';
import { http } from '../../../../modules/http'
import Actions from '../../../../components/Actions';
import Spinner from '../../../../components/Spinner';
import { TRACKFORM } from '../../../../utils/constants';
import InputLabel from '../../../../components/InputLabel';
import InputValue from '../../../../components/InputValue';
import CustomModal from '../../../../components/CustomModal';
import ConfirmModal from '../../../../components/CustomModal';
import { getEmptyCanColumns } from '../../../../assets/fixtures';
import { EditIconGrey } from '../../../../components/SVG_Icons';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import CustomPagination from '../../../../components/CustomPagination';
import { computeTotal, deepClone, getStatusColor, resetTrackForm, showToast } from '../../../../utils/Functions';
const DATEFORMAT = 'DD/MM/YYYY'

const Dashboard = () => {
    const [emptyCans, setEmptyCans] = useState([])
    const [formData, setFormData] = useState({})
    const [viewData, setViewData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(1)
    const [totalCount, setTotalCount] = useState(null)
    const [viewModal, setViewModal] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)

    const totalAmount = useMemo(() => computeTotal(emptyCans, 'totalQuantity'), [emptyCans])
    const emptyCanColumns = useMemo(() => getEmptyCanColumns('motherplant'), [])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getEmptyCans()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getEmptyCans = async () => {
        try {
            const url = 'warehouse/getEmptyCansList'
            const data = await http.GET(axios, url, config)
            setEmptyCans(data)
            setTotalCount(data.length)
            setLoading(false)
        } catch (error) { }
    }

    const handlePageChange = (number) => {
        setPageNumber(number)
    }

    const handleSizeChange = (number, size) => {
        setPageSize(size)
        setPageNumber(number)
    }

    const handleMenuSelect = (key, data) => {
        if (key === 'edit') {
            setViewData(data)
            setFormData({ reason: data.reason || '' })
            setViewModal(true)
        }
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))
    }

    const handleApprove = () => {
        const { id } = viewData
        const { reason } = formData
        updateCansStatus(id, 'Approved', reason)
    }

    const handleReject = () => {
        const { id } = viewData
        const { reason } = formData
        if (!reason.trim()) return setFormErrors({ reason: 'Reason is required on Reject ' })
        updateCansStatus(id, 'Rejected', reason)
    }

    const updateCansStatus = async (id, status, reason) => {
        const url = 'motherPlant/updateEmptyCansStatus'
        const body = { id, status, reason }
        const options = { item: 'Empty Cans', v1Ing: status === 'Approved' ? 'Approving' : 'Rejecting', v2: status }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.PUT(axios, url, body, config)
            showToast(options)
            optimisticUpdate(id, status, reason)
            onModalClose(true)
        } catch (error) {
            message.destroy()
            if (!axios.isCancel(error)) {
                setBtnDisabled(false)
            }
        }
    }

    const optimisticUpdate = (id, status, reason) => {
        let clone = deepClone(emptyCans);
        const index = clone.findIndex(item => item.id === id)
        clone[index].status = status;
        clone[index].reason = reason;
        setEmptyCans(clone)
    }

    const onModalClose = (hasUpdated) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasUpdated) {
            return setConfirmModal(true)
        }
        setViewModal(false)
        setFormData({})
        setFormErrors({})
        resetTrackForm()
        setBtnDisabled(false)
    }

    const dataSource = useMemo(() => emptyCans.map((route) => {
        const { id, departmentName, status, driverName, createdDateTime, mobileNumber, emptycans_count } = route

        return {
            key: id,
            returnId: id,
            emptycans_count,
            departmentName,
            driverName,
            mobileNumber,
            status: renderStatus(status),
            dateAndTime: dayjs(createdDateTime).format(DATEFORMAT),
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, route)} />
        }
    }), [emptyCans])

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false)
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
                <div className='left'></div>
                <div className='right'>
                    <div className='field'>
                        <InputLabel name='Total Empty Cans' />
                        <InputValue size='larger' value={totalAmount} />
                    </div>
                </div>
            </div>
            <div className='app-table dispatch-table'>
                <Table
                    loading={{ spinning: loading, indicator: <Spinner /> }}
                    dataSource={dataSource.slice(sliceFrom, sliceTo)}
                    columns={emptyCanColumns}
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
                showTwinBtn={editMode}
                twinDisabled={!canReject}
                btnDisabled={!canApprove && editMode}
                twinTxt='Reject'
                okTxt={editMode ? 'Approve' : 'Close'}
                visible={viewModal}
                title='Empty Cans Details'
                onOk={editMode ? handleApprove : handleModalCancel}
                onTwin={handleReject}
                onCancel={handleModalCancel}
                className='app-form-modal app-view-modal'
            >
                <EmptyCansView
                    data={viewData}
                    formData={formData}
                    errors={formErrors}
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
const options = [<Menu.Item key="edit" icon={<EditIconGrey />}>View/Edit</Menu.Item>]
export default Dashboard
