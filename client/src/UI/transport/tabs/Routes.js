import { Menu, message, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import RouteForm from '../forms/Route';
import { http } from '../../../modules/http'
import Actions from '../../../components/Actions';
import Spinner from '../../../components/Spinner';
import { routeColumns } from '../../../assets/fixtures';
import CustomModal from '../../../components/CustomModal';
import DeleteModal from '../../../components/CustomModal';
import ConfirmModal from '../../../components/CustomModal';
import ConfirmMessage from '../../../components/ConfirmMessage';
import CustomPagination from '../../../components/CustomPagination';
import { EditIconGrey, TrashIconGrey } from '../../../components/SVG_Icons';
import { getRole, getWarehoseId, SUPERADMIN, TRACKFORM } from '../../../utils/constants';
import { deepClone, isEmpty, resetTrackForm, showToast } from '../../../utils/Functions';

const RoutesDashboard = ({ reFetch, departmentOptions }) => {
    const role = getRole()
    const [routes, setRoutes] = useState([])
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
    const [modalDelete, setModalDelete] = useState(false)
    const [currentId, setCurrentId] = useState('')

    const isWHAdmin = useMemo(() => role === 'WarehouseAdmin', [role])
    const isSuperAdmin = useMemo(() => getRole() === SUPERADMIN, [])
    const options = useMemo(() => getOptions(isSuperAdmin), [])

    useEffect(() => {
        setLoading(true)
        getRoutes()
    }, [reFetch])

    const getRoutes = async () => {
        const depId = getWarehoseId()
        const url = getUrl(isWHAdmin, depId)

        const data = await http.GET(url)
        setRoutes(data)
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
        else if (key === 'delete') {
            setModalDelete(true)
            setCurrentId(data.RouteId)
        }
    }

    const handleDelete = async (id) => {
        const options = { item: 'Route', v1Ing: 'Deleting', v2: 'deleted' }
        const url = `/warehouse/deleteRoute/${id}`

        try {
            showToast({ ...options, action: 'loading' })
            await http.DELETE(url)
            optimisticDelete(id)
            showToast(options)
        } catch (error) {
            message.destroy()
        }
    }

    const optimisticDelete = (id) => {
        const filtered = routes.filter(item => item.RouteId !== id)
        setRoutes(filtered)
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))
    }

    const handleSubmit = async () => {
        const formErrors = {}
        let { RouteName, RouteDescription, departmentId } = formData
        if (!isWHAdmin && !departmentId) formErrors.departmentId = 'Required'
        if (!RouteName) formErrors.RouteName = 'Required'
        if (!RouteDescription) formErrors.RouteDescription = 'Required'

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }
        departmentId = isWHAdmin ? getWarehoseId() : departmentId
        let body = { ...formData, departmentId }
        const url = '/warehouse/updateRoute'
        const options = { item: 'Route', v1Ing: 'Updating', v2: 'updated' }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(url, body)
            showToast(options)
            optimisticUpdate(formData)
            onModalClose(true)
        } catch (error) {
            message.destroy()
            setBtnDisabled(false)
        }
    }

    const optimisticUpdate = (data) => {
        let clone = deepClone(routes);
        const index = clone.findIndex(item => item.RouteId === data.RouteId)
        clone[index] = data;
        setRoutes(clone)
    }

    const onModalClose = (hasUpdated) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasUpdated) {
            return setConfirmModal(true)
        }
        setEditModal(false)
        setFormData({})
        setFormErrors({})
        resetTrackForm()
        setBtnDisabled(false)
    }

    const dataSource = useMemo(() => routes.map((route) => {
        const { RouteId: key, RouteName, RouteDescription, departmentName } = route

        return {
            key,
            RouteName,
            RouteDescription,
            departmentName,
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, route)} />
        }
    }), [routes])

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false)
        resetTrackForm()
        onModalClose()
    }, [])
    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])
    const handleModalCancel = useCallback(() => onModalClose(), [])
    const handleDeleteModalOk = useCallback(() => {
        setModalDelete(false);
        handleDelete(currentId)
    }, [currentId])

    const handleDeleteModalCancel = useCallback(() => {
        setModalDelete(false)
    }, [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <div className='product-container'>
            <div className='app-table dispatch-table'>
                <Table
                    loading={{ spinning: loading, indicator: <Spinner /> }}
                    dataSource={dataSource.slice(sliceFrom, sliceTo)}
                    columns={routeColumns}
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
                okTxt='Update'
                title='Route Details'
                visible={editModal}
                btnDisabled={btnDisabled}
                onOk={handleSubmit}
                onCancel={handleModalCancel}
                className={`app-form-modal ${shake ? 'app-shake' : ''}`}
            >
                <RouteForm
                    data={formData}
                    isWHAdmin={isWHAdmin}
                    errors={formErrors}
                    onChange={handleChange}
                    departmentOptions={departmentOptions}
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
            <DeleteModal
                visible={modalDelete}
                onOk={handleDeleteModalOk}
                onCancel={handleDeleteModalCancel}
                title='Are you sure you want to delete?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='This action cannot be undone.' />
            </DeleteModal>
        </div>
    )
}

const getUrl = (isWHAdmin, id) => {
    if (isWHAdmin) return `/customer/getRoutes/${id}`
    return '/bibo/getroutes'
}

const getOptions = (isSuperAdmin) => {
    const options = [
        <Menu.Item key="edit" icon={<EditIconGrey />}>Edit</Menu.Item>,
        <Menu.Item key="delete" icon={<TrashIconGrey />}>Delete</Menu.Item>
    ]

    if (!isSuperAdmin) options.pop()
    return options
}

export default RoutesDashboard
