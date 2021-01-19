import { Menu, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DeliveryForm from '../forms/Delivery';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import QuitModal from '../../../../components/CustomModal';
import { EditIconGrey } from '../../../../components/SVG_Icons';
import Actions from '../../../../components/Actions';
import SearchInput from '../../../../components/SearchInput';
import CustomModal from '../../../../components/CustomModal';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import { getWarehoseId, TRACKFORM } from '../../../../utils/constants';
import CustomPagination from '../../../../components/CustomPagination';
import { orderColumns, getRouteOptions, getDriverOptions, getVehicleOptions } from '../../../../assets/fixtures';
import { validateMobileNumber, validateNames, validateNumber, validateDCValues } from '../../../../utils/validations';
import { isEmpty, resetTrackForm, getDCValuesForDB, showToast, deepClone, getStatusColor, getProductsForUI } from '../../../../utils/Functions';

const Orders = () => {
    const warehouseId = getWarehoseId()
    const [routes, setRoutes] = useState([])
    const [drivers, setDrivers] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [loading, setLoading] = useState(true)
    const [orders, setOrders] = useState([])
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [DCModal, setDCModal] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [fetchList, setFetchList] = useState(false)
    const [shake, setShake] = useState(false)
    const [label, setLabel] = useState('Create')

    const routeOptions = useMemo(() => getRouteOptions(routes), [routes])
    const driverOptions = useMemo(() => getDriverOptions(drivers), [drivers])
    const vehicleOptions = useMemo(() => getVehicleOptions(vehicles), [vehicles])

    useEffect(() => {
        if (fetchList) {
            getRoutes()
            getDrivers()
            getVehicles()
        }
    }, [fetchList])

    useEffect(() => {
        getOrders()
    }, [])

    const getRoutes = async () => {
        const data = await http.GET(`/customer/getRoutes/${warehouseId}`)
        setRoutes(data)
    }

    const getDrivers = async () => {
        const url = `/warehouse/getdriverDetails/${warehouseId}`
        const data = await http.GET(url)
        setDrivers(data)
    }

    const getVehicles = async () => {
        const url = `/motherPlant/getVehicleDetails`
        const data = await http.GET(url)
        setVehicles(data)
    }

    const getOrders = async () => {
        setLoading(true)
        const url = `/customer/getOrders`
        const data = await http.GET(url)
        setPageNumber(1)
        setLoading(false)
        setTotalCount(data.length)
        setOrders(data)
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'driverId') {
            let selectedDriver = drivers.find(driver => driver.driverId === Number(value))
            let { mobileNumber = null } = selectedDriver || {}
            setFormData(data => ({ ...data, mobileNumber }))
            setFormErrors(errors => ({ ...errors, mobileNumber: '' }))
        }
    }

    const handleBlur = (value, key) => {
        // Validations
        // if (key === 'mobileNumber') {
        //     const error = validateMobileNumber(value, true)
        //     setFormErrors(errors => ({ ...errors, [key]: error }))
        // }
    }

    const handleMenuSelect = (key, data) => {
        setFetchList(true)
        if (key === 'view') {
        }
        else if (key === 'create-delivery') {
            if (data.driverName) setLabel("Update")
            setFormData(data)
            setDCModal(true)
        }
    }

    const handlePageChange = (number) => {
        setPageNumber(number)
    }

    const handleSizeChange = (number, size) => {
        setPageSize(size)
        setPageNumber(number)
    }

    const handleSubmit = async () => {
        const formErrors = {}
        const { driverId, vehicleId } = formData
        if (!driverId) formErrors.driverId = 'Required'
        if (!vehicleId) formErrors.vehicleId = 'Required'

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        let url = '/customer/createOrderDelivery'
        const body = { ...formData }
        const options = { item: 'Delivery', v1Ing: 'Creating', v2: 'created' }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(url, body)
            showToast(options)
            optimisticUpdate(formData)
            onModalClose(true)
        } catch (error) {
            setBtnDisabled(false)
        }
    }

    const optimisticUpdate = (data) => {
        const clone = deepClone(orders)
        const index = clone.findIndex(dc => dc.deliveryDetailsId === data.deliveryDetailsId)
        clone[index] = data
        setOrders(clone)
    }

    const onModalClose = (hasSaved) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasSaved) {
            return setConfirmModal(true)
        }
        setDCModal(false)
        setBtnDisabled(false)
        setFormData({})
        setFormErrors({})
        setLabel("Create")
    }

    const dataSource = useMemo(() => orders.map((order) => {
        const { deliveryDetailsId: key, contactPerson, location, routeName, driverName, products } = order
        return {
            key,
            id: `${key}`,
            address: location,
            route: routeName,
            contactPerson,
            driverName: driverName || "Not Assigned",
            orderDetails: renderOrderDetails(getProductsForUI(products)),
            action: <Actions options={getActions(driverName)} onSelect={({ key }) => handleMenuSelect(key, order)} />
        }
    }), [orders])

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false);
        resetTrackForm()
        onModalClose()
    }, [])

    const handleDCModalCancel = useCallback(() => onModalClose(), [])
    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <div className='stock-delivery-container'>
            <div className='header'>
                <div></div>
                <div className='right'>
                    <SearchInput
                        placeholder='Search Delivery Challan'
                        className='delivery-search'
                        width='50%'
                    />
                </div>
            </div>
            <div className='app-table delivery-table'>
                <Table
                    loading={{ spinning: loading, indicator: <Spinner /> }}
                    dataSource={dataSource.slice(sliceFrom, sliceTo)}
                    columns={orderColumns}
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
                className={`app-form-modal ${shake ? 'app-shake' : ''}`}
                visible={DCModal}
                btnDisabled={btnDisabled}
                onOk={handleSubmit}
                onCancel={handleDCModalCancel}
                title={`${label} Delivery`}
                okTxt={label}
            >
                <DeliveryForm
                    data={formData}
                    errors={formErrors}
                    driverOptions={driverOptions}
                    routeOptions={routeOptions}
                    vehicleOptions={vehicleOptions}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
            </CustomModal>
            <QuitModal
                visible={confirmModal}
                onOk={handleConfirmModalOk}
                onCancel={handleConfirmModalCancel}
                title='Are you sure to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </QuitModal>
        </div>
    )
}

const renderOrderDetails = ({ product20L, product1L, product500ML, product250ML }) => {
    return `
    20 lts - ${product20L}, 1 ltr - ${product1L} boxes, 
    500 ml - ${product500ML} boxes, 250 ml - ${product250ML} boxes
    `
}
const getActions = (driverName) => {
    return [<Menu.Item key="view" icon={<EditIconGrey />}>View/Edit</Menu.Item>,
    <Menu.Item key="create-delivery" icon={<EditIconGrey />}>{`${driverName ? "Update Delivery" : "Create Delivery"}`}</Menu.Item>]
}
export default Orders