import axios from 'axios';
import { Menu, message, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CreateDelivery from '../forms/Delivery';
import { http } from '../../../../modules/http';
import DriverAssign from '../forms/DriverAssign';
import Spinner from '../../../../components/Spinner';
import Actions from '../../../../components/Actions';
import useUser from '../../../../utils/hooks/useUser';
import { TRACKFORM } from '../../../../utils/constants';
import QuitModal from '../../../../components/CustomModal';
import CustomModal from '../../../../components/CustomModal';
import SearchInput from '../../../../components/SearchInput';
import CustomButton from '../../../../components/CustomButton';
import RoutesFilter from '../../../../components/RoutesFilter';
import DeliveryForm from '../../../accounts/add/forms/Delivery';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import CustomPagination from '../../../../components/CustomPagination';
import { EditIconGrey, ListViewIconGrey, PlusIcon } from '../../../../components/SVG_Icons';
import { orderColumns, getRouteOptions, getDriverOptions, getVehicleOptions, getWarehouseOptions, getDropdownOptions } from '../../../../assets/fixtures';
import { isEmpty, resetTrackForm, showToast, deepClone, getProductsForUI, base64String, getDevDays, doubleKeyComplexSearch, renderProductDetails } from '../../../../utils/Functions';
import ActivityLogContent from '../../../../components/ActivityLogContent';

const Orders = ({ driverList, vehicleList, locationList, warehouseList, routeList }) => {
    const { WAREHOUSEID } = useUser()
    const [routesList, setRoutesList] = useState([])
    const [loading, setLoading] = useState(true)
    const [orders, setOrders] = useState([])
    const [logs, setLogs] = useState([])
    const [ordersClone, setOrdersClone] = useState([])
    const [filteredClone, setFilteredClone] = useState([])
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [logModal, setLogModal] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [assignModal, setAssignModal] = useState(false)
    const [DCModal, setDCModal] = useState(false)
    const [viewModal, setViewModal] = useState(false)
    const [currentDepId, setCurrentDepId] = useState('')
    const [filterInfo, setFilterInfo] = useState([])
    const [resetSearch, setResetSearch] = useState(false)
    const [filterON, setFilterON] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [options, setOptions] = useState({})
    const [isFetched, setIsFetched] = useState(false)
    const [devDays, setDevDays] = useState([])
    const [shake, setShake] = useState(false)
    const [label, setLabel] = useState('Add')
    const [viewedArr, setViewedArr] = useState([])

    const routeOptions = useMemo(() => getRouteOptions(routeList), [routeList])
    const routesOptions = useMemo(() => getRouteOptions(routesList), [routesList])
    const driverOptions = useMemo(() => getDriverOptions(driverList), [driverList])
    const vehicleOptions = useMemo(() => getVehicleOptions(vehicleList), [vehicleList])
    const warehouseOptions = useMemo(() => getWarehouseOptions(warehouseList), [warehouseList])
    const locationOptions = useMemo(() => getDropdownOptions(locationList), [locationList])

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
            await getRoutesList(WAREHOUSEID)
            message.destroy()
        }
    }

    const getRoutesList = async (depId) => {
        const url = `customer/getRoutes/${depId}`

        try {
            const data = await http.GET(axios, url, config)
            setRoutesList(data)
            setCurrentDepId(depId)
        } catch (error) { }
    }

    const fetchDelivery = async (id) => {
        const url = `customer/getDeliveryDetails/${id}`

        try {
            showToast(toastLoading)
            let { data: [data] } = await http.GET(axios, url, config)
            const { location, products, deliveryDays, gstProof, departmentId } = data
            const gst = base64String(gstProof?.data)
            const devDays = getDevDays(deliveryDays)
            const productsUI = getProductsForUI(products)
            const formData = { ...data, gstProof: gst, deliveryLocation: location, ...productsUI }
            setDevDays(devDays)
            handleGetNewRoutesList(departmentId)
            setFormData(formData)
            setViewedArr([...viewedArr, formData])
            message.destroy()
            setViewModal(true)
        } catch (error) {
            message.destroy()
        }
    }

    const getOrders = async () => {
        const url = `warehouse/getOrders`

        try {
            const data = await http.GET(axios, url, config)
            setPageNumber(1)
            setOrdersClone(data)
            setLoading(false)
            if (!isEmpty(filterInfo)) {
                generateFiltered(data, filterInfo)
            }
            else {
                setTotalCount(data.length)
                setOrders(data)
            }
        } catch (error) { }
    }

    const getLogs = async (DDId) => {
        const url = `logs/getDepartmentLogs?type=order&id=${DDId}`

        try {
            showToast({ v1Ing: 'Fetching', action: 'loading' })
            const data = await http.GET(axios, url, config)
            showToast({ v2: 'fetched' })
            setLogs(data)
        } catch (error) { }
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'driverId' && !assignModal) {
            let selectedDriver = driverList.find(driver => driver.driverId === Number(value))
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
                setOptions({ item: 'Delivery', v1Ing: 'Adding', v2: 'added' })
                setLabel('Add')
            }

            setIsFetched(true)
            setDCModal(true)
        }
        else if (key === 'logs') {
            await getLogs(data.deliveryDetailsId)
            setLogModal(true)
        }
    }

    const handlePageChange = (number) => {
        setPageNumber(number)
    }

    const handleGetNewRoutesList = (depId) => {
        if (currentDepId !== depId) {
            getRoutesList(depId)
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
            handleGetNewRoutesList(departmentId)
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

        const { driverName } = driverList.find(item => item.driverId === driverId)
        const { RouteName: routeName } = routesList.find(item => item.RouteId === routeId)
        const { vehicleName } = vehicleList.find(item => item.vehicleId === vehicleId)

        let url = 'customer/createOrderDelivery'
        const body = { ...formData, driverName, routeName, vehicleName }

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

    const handleAssignDrivers = async () => {
        const formErrors = {}
        const { driverId, routeId } = formData
        if (!driverId) formErrors.driverId = 'Required'
        if (!routeId) formErrors.routeId = 'Required'

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        const { driverName } = driverList.find(item => item.driverId === driverId)

        let url = 'warehouse/assignDriverForDcs'
        const body = { ...formData, driverName }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.PUT(axios, url, body, config)
            showToast(options)
            onModalClose(true)
            setLoading(true)
            getOrders()
        } catch (error) {
            message.destroy()
            if (!axios.isCancel(error)) {
                setBtnDisabled(false)
                if (error.response.status === 400) {
                    message.error('DCs for selected route do not exist.')
                }
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
        setAssignModal(false)
        setBtnDisabled(false)
        setFormData({})
        setFormErrors({})
        setLabel("Add")
    }

    const onLogModalClose = () => {
        setLogModal(false)
    }

    const onFilterChange = (data) => {
        setPageNumber(1)
        setFilterInfo(data)
        if (isEmpty(data)) {
            setOrders(ordersClone)
            setTotalCount(ordersClone.length)
            setFilterON(false)
        }
        else generateFiltered(ordersClone, data)
    }

    const generateFiltered = (original, filterInfo) => {
        const filtered = original.filter((item) => filterInfo.includes(item.routeId))
        setOrders(filtered)
        setFilteredClone(filtered)
        setTotalCount(filtered.length)
        setFilterON(true)
        searchON && setResetSearch(!resetSearch)
    }

    const handleSearch = (value) => {
        setPageNumber(1)
        if (value === "") {
            setTotalCount(ordersClone.length)
            setOrders(ordersClone)
            setSeachON(false)
            return
        }
        const data = filterON ? filteredClone : ordersClone
        const result = doubleKeyComplexSearch(data, value, 'deliveryDetailsId', 'customerName')
        setTotalCount(result.length)
        setOrders(result)
        setSeachON(true)
    }

    const dataSource = useMemo(() => orders.map((order) => {
        const { deliveryDetailsId: key, customerName, address, routeName, driverName, products } = order
        return {
            key,
            id: `${key}`,
            address,
            route: routeName,
            customerName,
            driverName: driverName || "Not Assigned",
            orderDetails: renderProductDetails(getProductsForUI(products)),
            action: <Actions options={getActions(driverName)} onSelect={({ key }) => handleMenuSelect(key, order)} />
        }
    }), [orders, viewedArr, isFetched])

    const onAssignDrivers = () => {
        isEmpty(routesList) && getRoutesList(WAREHOUSEID)
        setOptions({ item: 'Driver', v1Ing: 'Assigning', v2: 'assigned' })
        setAssignModal(true)
    }

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false);
        resetTrackForm()
        onModalClose()
    }, [])

    const handleModalCancel = useCallback(() => onModalClose(), [])
    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])
    const handleLogModalCancel = useCallback(() => onLogModalClose(), [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <div className='stock-delivery-container'>
            <div className='header'>
                <div className='left'>
                    <RoutesFilter
                        data={routeList}
                        keyValue='RouteId'
                        keyLabel='RouteName'
                        title='Select Routes'
                        onChange={onFilterChange}
                    />
                    <CustomButton text='Assign Driver' onClick={onAssignDrivers} className='app-add-new-btn' icon={<PlusIcon />} />

                </div>
                <div className='right'>
                    <SearchInput
                        placeholder='Search Delivery Challan'
                        className='delivery-search'
                        onChange={handleSearch}
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
                onCancel={handleModalCancel}
                title={`${label} Delivery`}
                okTxt={label}
            >
                <CreateDelivery
                    data={formData}
                    errors={formErrors}
                    driverOptions={driverOptions}
                    routeOptions={routesOptions}
                    vehicleOptions={vehicleOptions}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
            </CustomModal>
            <CustomModal
                className={`app-form-modal ${shake ? 'app-shake' : ''}`}
                visible={viewModal}
                btnDisabled={btnDisabled}
                onOk={handleModalCancel}
                onCancel={handleModalCancel}
                title='Delivery Details'
                hideCancel
                okTxt='Close'
            >
                <DeliveryForm
                    disabled
                    data={formData}
                    errors={formErrors}
                    devDays={devDays}
                    routeOptions={routesOptions}
                    locationOptions={locationOptions}
                    warehouseOptions={warehouseOptions}
                />
            </CustomModal>
            <CustomModal
                className={`app-form-modal ${shake ? 'app-shake' : ''}`}
                visible={assignModal}
                btnDisabled={btnDisabled}
                onOk={handleAssignDrivers}
                onCancel={handleModalCancel}
                title='Assign Driver'
                okTxt='Assign'
            >
                <DriverAssign
                    data={formData}
                    errors={formErrors}
                    onChange={handleChange}
                    routeOptions={routeOptions}
                    driverOptions={driverOptions}
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
            <CustomModal
                className='app-form-modal'
                visible={logModal}
                onOk={handleLogModalCancel}
                onCancel={handleLogModalCancel}
                title='Activity Log Details'
                okTxt='Close'
                hideCancel
            >
                <ActivityLogContent data={logs} />
            </CustomModal>
        </div>
    )
}

const getActions = (driverName) => {
    return [<Menu.Item key="view" icon={<EditIconGrey />}>View/Edit</Menu.Item>,
    <Menu.Item key="delivery" icon={<EditIconGrey />}>{`${driverName ? "Update" : "Add"} Delivery`}</Menu.Item>,
    <Menu.Item key="logs" icon={<ListViewIconGrey />}>Acvitity Logs</Menu.Item>]
}
export default Orders