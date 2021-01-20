import { Menu, message, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CreateDelivery from '../forms/Delivery';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import Actions from '../../../../components/Actions';
import QuitModal from '../../../../components/CustomModal';
import { EditIconGrey } from '../../../../components/SVG_Icons';
import SearchInput from '../../../../components/SearchInput';
import CustomModal from '../../../../components/CustomModal';
import DeliveryForm from '../../../accounts/add/forms/Delivery';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import { getWarehoseId, TRACKFORM } from '../../../../utils/constants';
import CustomPagination from '../../../../components/CustomPagination';
import { orderColumns, getRouteOptions, getDriverOptions, getVehicleOptions, getWarehouseOptions } from '../../../../assets/fixtures';
import { isEmpty, resetTrackForm, showToast, deepClone, getProductsForUI, base64String, getDevDays } from '../../../../utils/Functions';

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
    const [viewModal, setViewModal] = useState(false)
    const [currentDepId, setCurrentDepId] = useState('')
    const [warehouseList, setWarehouseList] = useState([])
    const [confirmModal, setConfirmModal] = useState(false)
    const [fetchList, setFetchList] = useState(false)
    const [devDays, setDevDays] = useState([])
    const [shake, setShake] = useState(false)
    const [label, setLabel] = useState('Create')
    const [viewedArr, setViewedArr] = useState([])

    const routeOptions = useMemo(() => getRouteOptions(routes), [routes])
    const driverOptions = useMemo(() => getDriverOptions(drivers), [drivers])
    const vehicleOptions = useMemo(() => getVehicleOptions(vehicles), [vehicles])
    const warehouseOptions = useMemo(() => getWarehouseOptions(warehouseList), [warehouseList])

    useEffect(() => {
        getOrders()
    }, [])

    useEffect(() => {
        if (fetchList) {
            getRouteList(warehouseId)
            getDriverList()
            getVehicleList()
            getWarehouseList()
        }
    }, [fetchList])

    const getRouteList = async (depId) => {
        const data = await http.GET(`/customer/getRoutes/${depId}`)
        setRoutes(data)
        setCurrentDepId(depId)
    }

    const getDriverList = async () => {
        const url = `/warehouse/getdriverDetails/${warehouseId}`
        const data = await http.GET(url)
        setDrivers(data)
    }

    const getVehicleList = async () => {
        const url = `/motherPlant/getVehicleDetails`
        const data = await http.GET(url)
        setVehicles(data)
    }

    const getWarehouseList = async () => {
        try {
            const data = await http.GET('/motherPlant/getDepartmentsList?departmentType=warehouse')
            setWarehouseList(data)
        } catch (ex) { }
    }

    const fetchDelivery = async (id) => {
        const url = `/customer/getDeliveryDetails/${id}`
        const options = { item: 'Delivery details', v1Ing: 'Fetching', v2: 'fetched' }

        try {
            showToast({ ...options, action: 'loading' })
            let { data: [data] } = await http.GET(url)
            const { location, products, deliveryDays, gstProof, departmentId } = data
            const gst = base64String(gstProof?.data)
            const devDays = getDevDays(deliveryDays)
            const productsUI = getProductsForUI(products)
            const formData = { ...data, gstProof: gst, deliveryLocation: location, ...productsUI }
            setDevDays(devDays)
            handleGetNewRouteList(departmentId)
            setFormData(formData)
            setViewedArr([...viewedArr, formData])
            setViewModal(true)
            showToast(options)
        } catch (error) {
            message.destroy()
        }
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
            handleView(data.deliveryDetailsId)
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

    const handleGetNewRouteList = (depId) => {
        if (currentDepId !== depId) {
            getRouteList(depId)
        }
    }

    const handleSizeChange = (number, size) => {
        setPageSize(size)
        setPageNumber(number)
    }

    const handleView = async (id) => {
        const delivery = viewedArr.find(item => item.deliveryDetailsId === id)

        if (delivery) {
            const { departmentId } = delivery
            handleGetNewRouteList(departmentId)
            setFormData(delivery)
            setViewModal(true)
        }
        else fetchDelivery(id)
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
        setViewModal(false)
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
    }), [orders, viewModal])

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false);
        resetTrackForm()
        onModalClose()
    }, [])

    const handleDCModalCancel = useCallback(() => onModalClose(), [])
    const handleViewModalCancel = useCallback(() => onModalClose(), [])
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
                <CreateDelivery
                    data={formData}
                    errors={formErrors}
                    driverOptions={driverOptions}
                    routeOptions={routeOptions}
                    vehicleOptions={vehicleOptions}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
            </CustomModal>
            <CustomModal
                className={`app-form-modal ${shake ? 'app-shake' : ''}`}
                visible={viewModal}
                btnDisabled={btnDisabled}
                onOk={handleViewModalCancel}
                onCancel={handleViewModalCancel}
                title='Delivery Details'
                hideCancel
                okTxt='Close'
            >
                <DeliveryForm
                    disabled
                    data={formData}
                    errors={formErrors}
                    devDays={devDays}
                    routeOptions={routeOptions}
                    warehouseOptions={warehouseOptions}
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