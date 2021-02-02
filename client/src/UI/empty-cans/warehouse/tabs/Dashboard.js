import dayjs from 'dayjs';
import { Menu, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http'
import EmptyCansForm from '../forms/EmptyCans';
import Actions from '../../../../components/Actions';
import Spinner from '../../../../components/Spinner';
import CustomModal from '../../../../components/CustomModal';
import ConfirmModal from '../../../../components/CustomModal';
import { getEmptyCanColumns } from '../../../../assets/fixtures';
import { EditIconGrey } from '../../../../components/SVG_Icons';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import CustomPagination from '../../../../components/CustomPagination';
import { getRole, TRACKFORM } from '../../../../utils/constants';
import { deepClone, getStatusColor, isEmpty, resetTrackForm, showToast } from '../../../../utils/Functions';
import { validateNumber, validateRECValues } from '../../../../utils/validations';
const DATEFORMAT = 'DD/MM/YYYY'

const Dashboard = ({ reFetch, driverList, ...rest }) => {
    const role = getRole()
    const [emptyCans, setEmptyCans] = useState([])
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(1)
    const [totalCount, setTotalCount] = useState(null)
    const [editModal, setEditModal] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [shake, setShake] = useState(false)

    const isWHAdmin = useMemo(() => role === 'WarehouseAdmin', [role])
    const emptyCanColumns = useMemo(() => getEmptyCanColumns(), [])

    useEffect(() => {
        setLoading(true)
        getEmptyCans()
    }, [reFetch])

    const getEmptyCans = async () => {
        const url = '/warehouse/getEmptyCansList'
        const data = await http.GET(url)
        setEmptyCans(data)
        setTotalCount(data.length)
        setLoading(false)
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
            setFormData(data)
            setEditModal(true)
        }
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'driverId') {
            let selectedDriver = driverList.find(driver => driver.driverId === Number(value))
            let { mobileNumber = null } = selectedDriver || {}
            setFormData(data => ({ ...data, mobileNumber }))
            setFormErrors(errors => ({ ...errors, mobileNumber: '' }))
        }
        else if (key === 'isDamaged') {
            if (!value) {
                let damaged20LCans, damaged1LBoxes, damaged500MLBoxes, damaged250MLBoxes, damagedDesc;
                setFormData(data => ({
                    ...data, damaged20LCans, damaged1LBoxes, damaged500MLBoxes, damaged250MLBoxes, damagedDesc
                }))
                setFormErrors(errors => ({ ...errors, damagedDesc: '', damaged: '' }))
            }
        }

        // Validations
        if (key.includes('Box') || key.includes('Can')) {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, damaged: error }))
        }
        else if (key === 'emptycans_count') {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, emptycans_count: error }))
        }
    }

    const handleSubmit = async () => {
        const formErrors = validateRECValues(formData)

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        let url = '/warehouse/updateReturnEmptyCans'
        const body = {
            ...formData, status: 'Pending'
        }
        const options = { item: 'Empty Cans', v1Ing: 'Updating', v2: 'updated' }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            const [data] = await http.PUT(url, body)
            optimisticUpdate(data)
            showToast(options)
            setEditModal(false)
            resetForm()
        } catch (error) {
            setBtnDisabled(false)
        }
    }

    const resetForm = () => {
        setBtnDisabled(false)
        resetTrackForm()
        setFormData({})
        setFormErrors({})
    }

    const optimisticUpdate = (data) => {
        let clone = deepClone(emptyCans);
        const index = clone.findIndex(item => item.id === data.id)
        clone[index] = data;
        setEmptyCans(clone)
    }

    const onModalClose = (hasUpdated) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasUpdated) {
            return setConfirmModal(true)
        }
        setEditModal(false)
        resetForm()
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

    return (
        <div className='product-container'>
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
                className={`app-form-modal app-view-modal stock-details-modal ${shake ? 'app-shake' : ''}`}
                visible={editModal}
                btnDisabled={btnDisabled}
                onOk={handleSubmit}
                onCancel={handleModalCancel}
                title='Empty Cans Details'
                okTxt='Update'
                track
            >
                <EmptyCansForm
                    data={formData}
                    errors={formErrors}
                    onChange={handleChange}
                    {...rest}
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
const options = [<Menu.Item key="edit" icon={<EditIconGrey />}>Edit</Menu.Item>]
export default Dashboard
