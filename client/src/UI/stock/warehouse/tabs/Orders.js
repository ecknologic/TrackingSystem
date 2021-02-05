import axios from 'axios';
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
    const [options, setOptions] = useState({})
    const [isFetched, setIsFetched] = useState(false)
    const [devDays, setDevDays] = useState([])
    const [shake, setShake] = useState(false)
    const [label, setLabel] = useState('Create')
    const [viewedArr, setViewedArr] = useState([])

    const routeOptions = useMemo(() => getRouteOptions(routes), [routes])
    const driverOptions = useMemo(() => getDriverOptions(drivers), [drivers])
    const vehicleOptions = useMemo(() => getVehicleOptions(vehicles), [vehicles])
    const warehouseOptions = useMemo(() => getWarehouseOptions(warehouseList), [warehouseList])
    const toastLoading = { v1Ing: 'Fetching', action: 'loading' }
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getOrders()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const fetchData = async () => {
        if (!isFetched) {
            showToast(toastLoading)
            const p1 = getRouteList(warehouseId)
            const p2 = getDriverList()
            const p3 = getVehicleList()
            const p4 = getWarehouseList()
            await Promise.all([p1, p2, p3, p4])
            message.destroy()
        }
    }

    const getRouteList = async (depId) => {
        const url = `/customer/getRoutes/${depId}`

        try {
            const data = await http.GET(axios, url, config)
            setRoutes(data)
            setCurrentDepId(depId)
        } catch (error) { }
    }

    const getDriverList = async () => {
        const url = `/bibo/getdriverDetails/${warehouseId}`

        try {
            const data = await http.GET(axios, url, config)
            setDrivers(data)
        } catch (error) { }
    }

    const getVehicleList = async () => {
        const url = `/bibo/getVehicleDetails`

        try {
            const data = await http.GET(axios, url, config)
            setVehicles(data)
        } catch (error) { }
    }

    const getWarehouseList = async () => {
        const url = '/bibo/getDepartmentsList?departmentType=warehouse'

        try {
            const data = await http.GET(axios, url, config)
            setWarehouseList(data)
        } catch (ex) { }
    }

    const fetchDelivery = async (id) => {
        const url = `/customer/getDeliveryDetails/${id}`

        try {
            showToast(toastLoading)
            let { data: [data] } = await http.GET(axios, url, config)
            const { location, products, deliveryDays, gstProof, departmentId } = data
            const gst = base64String(gstProof?.data)
            const devDays = getDevDays(deliveryDays)
            const productsUI = getProductsForUI(products)
            const formData = { ...data, gstProof: gst, deliveryLocation: location, ...productsUI }
            setDevDays(devDays)
            handleGetNewRouteList(departmentId)
            setFormData(formData)
            setViewedArr([...viewedArr, formData])
            message.destroy()
            setViewModal(true)
        } catch (error) {
            message.destroy()
        }
    }

    const getOrders = async () => {
        const url = `/warehouse/getOrders`

        try {
            const data = await http.GET(axios, url, config)
            setPageNumber(1)
            setLoading(false)
            setTotalCount(data.length)
            setOrders(data)
        } catch (error) { }
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

    const handleMenuSelect = async (key, data) => {
        setIsFetched(true)
        if (key === 'view') {
            handleView(data.deliveryDetailsId)
        }
        else if (key === 'delivery') {
            setFormData(data)
            await fetchData()
            if (data.driverName) {
                setLabel('Update')
                setOptions({ item: 'Delivery', v1Ing: 'Updating', v2: 'updated' })
            }
            else {
                setOptions({ item: 'Delivery', v1Ing: 'Creating', v2: 'created' })
                setLabel('Create')
            }

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
        const { driverId, vehicleId, routeId } = formData
        if (!driverId) formErrors.driverId = 'Required'
        if (!routeId) formErrors.routeId = 'Required'
        if (!vehicleId) formErrors.vehicleId = 'Required'

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        let url = '/customer/createOrderDelivery'
        const body = { ...formData }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            const [data] = await http.POST(axios, url, body, config)
            showToast(options)
            optimisticUpdate(data)
            onModalClose(true)
        } catch (error) {
            message.destroy()
            if (!axios.isCancel(error)) {
                setBtnDisabled(false)
            }
        }
    }

    const optimisticUpdate = ({ driverName, deliveryDetailsId: id, routeName }) => {
        const clone = deepClone(orders)
        const index = clone.findIndex(dc => dc.deliveryDetailsId === id)
        clone[index].driverName = driverName
        clone[index].routeName = routeName
        setOrders(clone)

        //Remove order object from viewed Array if exists
        const filtered = viewedArr.filter(dc => dc.deliveryDetailsId !== id)
        setViewedArr(filtered)
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
        const { deliveryDetailsId: key, contactPerson, address, routeName, driverName, products } = order
        return {
            key,
            id: `${key}`,
            address,
            route: routeName,
            contactPerson,
            driverName: driverName || "Not Assigned",
            orderDetails: renderOrderDetails(getProductsForUI(products)),
            action: <Actions options={getActions(driverName)} onSelect={({ key }) => handleMenuSelect(key, order)} />
        }
    }), [orders, viewedArr, isFetched])

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
                title='Are you sure you want to leave?'
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
    <Menu.Item key="delivery" icon={<EditIconGrey />}>{`${driverName ? "Update" : "Create"} Delivery`}</Menu.Item>]
}
export default Orders