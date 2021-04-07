import axios from 'axios';
import { Menu, message, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DCForm from '../forms/DCForm';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import Actions from '../../../../components/Actions';
import useUser from '../../../../utils/hooks/useUser';
import { TRACKFORM } from '../../../../utils/constants';
import QuitModal from '../../../../components/CustomModal';
import SearchInput from '../../../../components/SearchInput';
import CustomModal from '../../../../components/CustomModal';
import CustomButton from '../../../../components/CustomButton';
import RoutesFilter from '../../../../components/RoutesFilter';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import CustomPagination from '../../../../components/CustomPagination';
import { EditIconGrey, PlusIcon } from '../../../../components/SVG_Icons';
import { getRouteOptions, getDriverOptions, getDeliveryColumns, getDistributorOptions, getCustomerOptions } from '../../../../assets/fixtures';
import { validateMobileNumber, validateNames, validateNumber, validateDCValues } from '../../../../utils/validations';
import { isEmpty, resetTrackForm, getDCValuesForDB, showToast, deepClone, getStatusColor, doubleKeyComplexSearch, getProductsForUI } from '../../../../utils/Functions';

const Delivery = ({ date, source }) => {
    const defaultValue = { customerType: 'newCustomer', creationType: 'manual' }
    const { WAREHOUSEID: warehouseId } = useUser()
    const [routes, setRoutes] = useState([])
    const [drivers, setDrivers] = useState([])
    const [loading, setLoading] = useState(true)
    const [deliveriesClone, setDeliveriesClone] = useState([])
    const [filteredClone, setFilteredClone] = useState([])
    const [deliveries, setDeliveries] = useState([])
    const [formData, setFormData] = useState(defaultValue)
    const [formErrors, setFormErrors] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [resetSearch, setResetSearch] = useState(false)
    const [customerList, setCustomerList] = useState([])
    const [distributorList, setDistributorList] = useState([])
    const [filterInfo, setFilterInfo] = useState([])
    const [filterON, setFilterON] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [DCModal, setDCModal] = useState(false)
    const [shake, setShake] = useState(false)
    const [okTxt, setOkTxt] = useState('')
    const [title, setTitle] = useState('')
    const [mode, setMode] = useState(false)

    const deliveryColumns = useMemo(() => getDeliveryColumns(), [])
    const routeOptions = useMemo(() => getRouteOptions(routes), [routes])
    const driverOptions = useMemo(() => getDriverOptions(drivers), [drivers])
    const distributorOptions = useMemo(() => getDistributorOptions(distributorList), [distributorList])
    const customerOptions = useMemo(() => getCustomerOptions(customerList), [customerList])
    const config = { cancelToken: source.token }

    useEffect(() => {
        setLoading(true)
        getDeliveries()
        isEmpty(routes) && getRoutes()
        isEmpty(drivers) && getDrivers()

        return () => {
            http.ABORT(source)
        }
    }, [date])

    const getRoutes = async () => {
        const url = `customer/getRoutes/${warehouseId}`

        try {
            const data = await http.GET(axios, url, config)
            setRoutes(data)
        } catch (error) { }
    }

    const getDrivers = async () => {
        const url = `bibo/getdriverDetails/${warehouseId}`

        try {
            const data = await http.GET(axios, url, config)
            setDrivers(data)
        } catch (error) { }
    }

    const getDistributorList = async () => {
        const url = 'distributor/getDistributorsList'

        try {
            const data = await http.GET(axios, url, config)
            setDistributorList(data)
        } catch (error) { }
    }

    const getCustomerList = async () => {
        const url = 'customer/getCustomerNames'

        try {
            const data = await http.GET(axios, url, config)
            setCustomerList(data)
        } catch (error) { }
    }

    const getDistributor = async (id) => {
        const url = `distributor/getDistributor/${id}`

        try {
            showToast({ v1Ing: 'Fetching', action: 'loading' })
            const [data] = await http.GET(axios, url, config)
            const { mobileNumber: phoneNumber, address, products, agencyName: customerName } = data
            const productsUI = getProductsForUI(products)
            setFormData(data => ({ ...data, phoneNumber, address, customerName, ...productsUI }))
            showToast({ v2: 'fetched' })
        } catch (error) {
            message.destroy()
        }
    }

    const getDeliveries = async () => {
        const url = `warehouse/deliveryDetails/${date}`

        try {
            const data = await http.GET(axios, url, config)
            setPageNumber(1)
            setDeliveriesClone(data)
            setLoading(false)
            if (!isEmpty(filterInfo)) {
                generateFiltered(data, filterInfo)
            }
            else {
                setTotalCount(data.length)
                setDeliveries(data)
            }
        } catch (error) { }
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'customerType') {
            const productsUI = getProductsForUI([])
            setFormData(data => ({
                ...data, existingCustomerId: null, customerName: '', phoneNumber: null,
                distributorId: null, address: '', ...productsUI
            }))
        }
        else if (key === 'distributorId') {
            getDistributor(value)
        }
        else if (key === 'existingCustomerId') {
            let customerName = customerList.find(item => item.customerId === value).customerName
            setFormData(data => ({ ...data, customerName }))
        }

        // Validations
        else if (key === 'customerName') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'phoneNumber') {
            const error = validateMobileNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key.includes('box') || key.includes('can')) {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, products: error }))
        }
    }

    const handleBlur = (value, key) => {
        // Validations
        if (key === 'phoneNumber') {
            const error = validateMobileNumber(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const onFilterChange = (data) => {
        setPageNumber(1)
        setFilterInfo(data)
        if (isEmpty(data)) {
            setDeliveries(deliveriesClone)
            setTotalCount(deliveriesClone.length)
            setFilterON(false)
        }
        else generateFiltered(deliveriesClone, data)
    }

    const generateFiltered = (original, filterInfo) => {
        const filtered = original.filter((item) => filterInfo.includes(item.RouteId))
        setDeliveries(filtered)
        setFilteredClone(filtered)
        setTotalCount(filtered.length)
        setFilterON(true)
        searchON && setResetSearch(!resetSearch)
    }

    const handleMenuSelect = async (key, data) => {
        if (key === 'view') {
            const { dcNo, isDelivered } = data
            setTitle(dcNo)

            try {
                showToast({ v1Ing: 'Fetching', action: 'loading' })
                isEmpty(distributorList) && await getDistributorList()
                isEmpty(customerList) && await getCustomerList()
                message.destroy()
            } catch (error) { }

            const isDisabled = isDelivered === 'Completed'
            setOkTxt(isDisabled ? 'Close' : 'Update')
            setMode(isDisabled ? 'view' : 'edit')
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
        const formErrors = validateDCValues(formData)

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        const dcValues = getDCValuesForDB(formData)
        const { customerOrderId, driverId } = formData

        let url = '/warehouse/createDC'
        let method = 'POST'
        let v1Ing = 'Adding'
        let v2 = 'added'

        if (customerOrderId) {
            url = '/customer/updateCustomerOrderDetails'
            method = 'PUT'
            v1Ing = 'Updating'
            v2 = 'updated'
        }

        const body = {
            ...dcValues, warehouseId, customerOrderId
        }

        if (!driverId) { // Set status to delivered
            body.isDelivered = 'Completed'
        }

        const options = { item: 'DC', v1Ing, v2 }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            let [data = {}] = await http[method](axios, url, body, config)
            showToast(options)
            optimisticUpdate(data, method)
            onModalClose(true)
        } catch (error) {
            setBtnDisabled(false)
        }
    }

    const optimisticUpdate = (data, method) => {
        if (method === 'PUT') {
            const clone = deepClone(deliveries)
            const index = clone.findIndex(dc => dc.customerOrderId === data.customerOrderId)
            clone[index] = data
            setDeliveries(clone)
        }
        else setDeliveries([data, ...deliveries])
    }

    const onModalClose = (hasSaved) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasSaved) {
            return setConfirmModal(true)
        }
        setDCModal(false)
        setBtnDisabled(false)
        setFormData(defaultValue)
        setFormErrors({})
    }

    const handleSearch = (value) => {
        setPageNumber(1)
        if (value === "") {
            setTotalCount(deliveriesClone.length)
            setDeliveries(deliveriesClone)
            setSeachON(false)
            return
        }
        const data = filterON ? filteredClone : deliveriesClone
        const result = doubleKeyComplexSearch(data, value, 'dcNo', 'customerName')
        setTotalCount(result.length)
        setDeliveries(result)
        setSeachON(true)
    }

    const dataSource = useMemo(() => deliveries.map((dc) => {
        const { dcNo, customerOrderId, address, RouteName, driverName, customerName, isDelivered } = dc
        return {
            key: customerOrderId || dcNo,
            dcnumber: dcNo,
            shopAddress: address,
            name: customerName,
            route: RouteName || 'Not Assigned',
            driverName: driverName || 'Not Assigned',
            orderDetails: renderOrderDetails(dc),
            status: renderStatus(isDelivered),
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, dc)} />
        }
    }), [deliveries, distributorList, customerList])

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false);
        resetTrackForm()
        onModalClose()
    }, [])

    const onCreateDC = () => {
        isEmpty(distributorList) && getDistributorList()
        isEmpty(customerList) && getCustomerList()
        setMode('create')
        setTitle('Add New DC')
        setOkTxt('Save')
        setDCModal(true)
    }

    const handleDCModalCancel = useCallback(() => onModalClose(), [])
    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize
    const disabledItems = mode === 'view' ? 'ALL' : mode === 'create' ? 'NONE' : 'FEW'
    return (
        <div className='stock-delivery-container'>
            <div className='header'>
                <div className='left'>
                    <RoutesFilter
                        data={routes}
                        keyValue='RouteId'
                        keyLabel='RouteName'
                        title='Select Routes'
                        onChange={onFilterChange}
                    />
                    <CustomButton text='Add New DC' onClick={onCreateDC} className='app-add-new-btn' icon={<PlusIcon />} />
                </div>
                <div className='right'>
                    <SearchInput
                        placeholder='Search Delivery Challan'
                        className='delivery-search'
                        reset={resetSearch}
                        onChange={handleSearch}
                        width='50%'
                    />
                </div>
            </div>
            <div className='app-table delivery-table'>
                <Table
                    loading={{ spinning: loading, indicator: <Spinner /> }}
                    dataSource={dataSource.slice(sliceFrom, sliceTo)}
                    columns={deliveryColumns}
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
                onOk={mode === 'view' ? handleDCModalCancel : handleSubmit}
                onCancel={handleDCModalCancel}
                title={title}
                okTxt={okTxt}
                hideCancel={mode === 'view'}
            >
                <DCForm
                    data={formData}
                    errors={formErrors}
                    disabledItems={disabledItems}
                    driverOptions={driverOptions}
                    routeOptions={routeOptions}
                    customerOptions={customerOptions}
                    distributorOptions={distributorOptions}
                    onChange={handleChange}
                    onBlur={handleBlur}
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

const renderStatus = (status) => {
    const color = getStatusColor(status)
    const text = status === 'Completed' ? 'Delivered' : status === 'Postponed' ? status : 'Pending'
    return (
        <div className='status'>
            <span className='app-dot' style={{ background: color }}></span>
            <span className='status-text'>{text}</span>
        </div>
    )
}

const renderOrderDetails = ({ product20L, product2L, product1L, product500ML, product300ML }) => {
    return `
    20 ltrs - ${Number(product20L)}, 2 ltrs - ${Number(product2L)} boxes, 1 ltr - ${Number(product1L)} boxes, 
    500 ml - ${Number(product500ML)} boxes, 300 ml - ${Number(product300ML)} boxes
    `
}
const options = [<Menu.Item key="view" icon={<EditIconGrey />}>View/Edit</Menu.Item>]
export default Delivery