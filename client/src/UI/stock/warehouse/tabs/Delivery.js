import dayjs from 'dayjs';
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
import CustomDateInput from '../../../../components/CustomDateInput';
import CustomPagination from '../../../../components/CustomPagination';
import ActivityLogContent from '../../../../components/ActivityLogContent';
import { BlockIconGrey, EditIconGrey, EyeIconGrey, ListViewIconGrey, PlusIcon, ScheduleIcon, ScheduleIconGrey } from '../../../../components/SVG_Icons';
import { validateMobileNumber, validateNames, validateNumber, validateDCValues, validateEmailId, validateIntFloat } from '../../../../utils/validations';
import { getRouteOptions, getDriverOptions, getDeliveryColumns, getDistributorOptions, getCustomerOptions, getDropdownOptions } from '../../../../assets/fixtures';
import { isEmpty, resetTrackForm, getDCValuesForDB, showToast, deepClone, getStatusColor, doubleKeyComplexSearch, getProductsForUI, disablePastDates } from '../../../../utils/Functions';
const format = 'YYYY-MM-DD'

const Delivery = ({ date, routeList, locationList, driverList }) => {
    const defaultValue = { customerType: 'newCustomer', creationType: 'manual' }
    const { WAREHOUSEID: warehouseId } = useUser()
    const [logs, setLogs] = useState([])
    const [open, setOpen] = useState(false)
    const [rOpen, setROpen] = useState(false)
    const [currentDC, setCurrentDC] = useState('')
    const [selectedDate, setSelectedDate] = useState()
    const [loading, setLoading] = useState(true)
    const [deliveriesClone, setDeliveriesClone] = useState([])
    const [filteredClone, setFilteredClone] = useState([])
    const [deliveries, setDeliveries] = useState([])
    const [formData, setFormData] = useState(defaultValue)
    const [formErrors, setFormErrors] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [logModal, setLogModal] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [cancelModal, setCancelModal] = useState(false)
    const [rescheduleModal, setRescheduleModal] = useState(false)
    const [resetSearch, setResetSearch] = useState(false)
    const [customerList, setCustomerList] = useState([])
    const [distributorList, setDistributorList] = useState([])
    const [filterInfo, setFilterInfo] = useState([])
    const [filterON, setFilterON] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [DCModal, setDCModal] = useState(false)
    const [cancelMsg, setCancelMsg] = useState('')
    const [cancelTitle, setCancelTitle] = useState('')
    const [shake, setShake] = useState(false)
    const [okTxt, setOkTxt] = useState('')
    const [title, setTitle] = useState('')
    const [mode, setMode] = useState(false)

    const deliveryColumns = useMemo(() => getDeliveryColumns(), [])
    const routeOptions = useMemo(() => getRouteOptions(routeList), [routeList])
    const driverOptions = useMemo(() => getDriverOptions(driverList), [driverList])
    const locationOptions = useMemo(() => getDropdownOptions(locationList), [locationList])
    const distributorOptions = useMemo(() => getDistributorOptions(distributorList), [distributorList])
    const customerOptions = useMemo(() => getCustomerOptions(customerList), [customerList])
    const childProps = useMemo(() => ({ routeOptions, driverOptions, locationOptions, distributorOptions, customerOptions }),
        [routeOptions, driverOptions, locationOptions, distributorOptions, customerOptions])
    const source = useMemo(() => axios.CancelToken.source(), [date]);
    const config = { cancelToken: source.token }

    useEffect(() => {
        setLoading(true)
        getDeliveries()

    }, [date])

    useEffect(() => {
        return () => {
            http.ABORT(source)
        }
    }, [])

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
            const { mobileNumber: phoneNumber, address, products, mailId: EmailId, agencyName: customerName, deliveryLocation, contactPerson } = data
            const productsUI = getProductsForUI(products)
            setFormData(data => ({ ...data, phoneNumber, address, customerName, EmailId, deliveryLocation, contactPerson, ...productsUI }))
            showToast({ v2: 'fetched' })
        } catch (error) {
            message.destroy()
        }
    }

    const getCustomer = async (id) => {
        const url = `customer/getCustomerDetailsForDC/${id}`

        try {
            showToast({ v1Ing: 'Fetching', action: 'loading' })
            const { data: [data] } = await http.GET(axios, url, config)
            const { products, ...res } = data
            const productsUI = getProductsForUI(products)
            setFormData(data => ({ ...data, ...res, ...productsUI }))
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

    const getLogs = async (COId) => {
        const url = `logs/getDepartmentLogs?type=delivery&id=${COId}`

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

        if (key === 'customerType') {
            const productsUI = getProductsForUI([])
            setFormData(data => ({
                ...data, existingCustomerId: null, customerName: '', phoneNumber: null, contactPerson: '',
                distributorId: null, deliveryLocation: null, address: '', EmailId: '', ...productsUI
            }))
        }
        else if (key === 'distributorId') {
            getDistributor(value)
        }
        else if (key === 'existingCustomerId') {
            getCustomer(value)
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
        else if (key.includes('product')) {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, productNPrice: error }))
        }
        else if (key.includes('price')) {
            const error = validateIntFloat(value)
            setFormErrors(errors => ({ ...errors, productNPrice: error }))
        }
    }

    const handleBlur = (value, key) => {
        // Validations
        if (key === 'phoneNumber') {
            const error = validateMobileNumber(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'EmailId') {
            const error = validateEmailId(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key.includes('price')) {
            const error = validateIntFloat(value, true)
            setFormErrors(errors => ({ ...errors, productNPrice: error }))
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

    const datePickerStatus = (status) => {
        !status && setOpen(false)
    }

    const dateRowPickerStatus = (status) => {
        !status && setROpen(false)
    }

    const handleDateSelect = (value) => {
        setSelectedDate(dayjs(value).format(format))
        setOpen(false)
    }

    const handleRowDateSelect = (value) => {
        setSelectedDate(dayjs(value).format(format))
        setRescheduleModal(true)
        setROpen(false)
    }

    const handleMenuSelect = async (key, data) => {
        const { dcNo, isDelivered, customerType } = data
        if (key === 'view') {
            const title = `${dcNo} - ${customerType === 'newCustomer' ? 'New Customer'
                : customerType === 'internal' ? 'Existing Customer' : 'Distributor'}`
            setTitle(title)

            try {
                showToast({ v1Ing: 'Fetching', action: 'loading' })
                isEmpty(distributorList) && await getDistributorList()
                isEmpty(customerList) && await getCustomerList()
                message.destroy()
            } catch (error) { }

            const isDisabled = isDelivered === 'Completed' || isDelivered === 'Cancelled'
            setOkTxt(isDisabled ? 'Close' : 'Update')
            setMode(isDisabled ? 'view' : 'edit')
            setFormData(data)
            setDCModal(true)
        }
        else if (key === 'logs') {
            await getLogs(data.customerOrderId)
            setLogModal(true)
        }
        else if (key === 'reschedule') {
            setROpen(true)
            setCurrentDC(data)
        }
        else if (key === 'cancel') {
            setCancelMsg('This action cannot be undone.')
            setCancelTitle('Are you sure you want to cancel?')
            setCancelModal(true)
            setCurrentDC(data)
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
        const { customerOrderId, driverId, routeId } = formData

        let url = 'warehouse/createDC'
        let method = 'POST'
        let v1Ing = 'Adding'
        let v2 = 'added'

        const body = {
            ...dcValues, warehouseId, customerOrderId
        }

        if (customerOrderId) {
            url = 'customer/updateCustomerOrderDetails'
            method = 'PUT'
            v1Ing = 'Updating'
            v2 = 'updated'

            const { driverName } = driverList.find(item => item.driverId === driverId)
            const { RouteName } = routeList.find(item => item.RouteId === routeId)

            body.driverName = driverName
            body.routeName = RouteName
        }

        if (!driverId) { // Set status to delivered
            body.isDelivered = 'Completed'
            body.deliveredDate = new Date()
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
            message.destroy()
            if (!axios.isCancel(error)) {
                setBtnDisabled(false)
                if (error.response.status === 405) {
                    message.error('Email/phone already corresponds to an existing account.')
                }
            }
        }
    }

    const handleCancelDC = async ({ customerOrderId }) => {
        const options = { item: 'DC', v1Ing: 'Cancelling', v2: 'cancelled' }

        const url = 'warehouse/closeDc'
        const body = { customerOrderId }
        try {
            showToast({ ...options, action: 'loading' })
            let [data = {}] = await http.PUT(axios, url, body, config)
            showToast(options)
            optimisticUpdate(data, 'PUT')
        } catch (error) { }
    }

    const handleReschedule = async () => {
        const { customerOrderId, existingCustomerId } = currentDC
        const options = { item: 'DC', v1Ing: 'Rescheduling', v2: 'rescheduled' }

        const url = 'warehouse/rescheduleDc'
        const body = { customerOrderId, date: selectedDate, existingCustomerId }
        try {
            showToast({ ...options, action: 'loading' })
            await http.PUT(axios, url, body, config)
            showToast(options)
            optimisticRemove(customerOrderId)
        } catch (error) {
            message.destroy()
            if (!axios.isCancel(error)) {
                if (error.response.status === 405) {
                    setCancelMsg(`Do you want to cancel ${currentDC.dcNo}`)
                    setCancelTitle('DC already exists for the selected date')
                    setCancelModal(true)
                }
            }
        }
    }

    const optimisticRemove = (id) => {
        const data = deliveries.filter(dc => dc.customerOrderId !== id)
        setDeliveries(data)
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

    const onLogModalClose = () => {
        setLogModal(false)
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

        const isCancelled = isDelivered === 'Cancelled'
        const options = [
            <Menu.Item key="view" icon={isCancelled ? <EyeIconGrey /> : <EditIconGrey />}>View{isCancelled ? '' : '/Edit'}</Menu.Item>,
            <Menu.Item key="cancel" className={isCancelled ? 'disabled' : ''} icon={<BlockIconGrey />}>Cancel</Menu.Item>,
            <Menu.Item key="logs" icon={<ListViewIconGrey />}>Acvitity Logs</Menu.Item>,
            <Menu.Item key="reschedule" className={isCancelled ? 'disabled' : ''} icon={<ScheduleIconGrey />}>Reschedule</Menu.Item>
        ]

        return {
            key: customerOrderId || dcNo,
            dcnumber: dcNo,
            shopAddress: address,
            name: customerName,
            route: RouteName || 'Not Assigned',
            driverName: driverName || 'Not Assigned',
            orderDetails: renderOrderDetails(dc),
            status: renderStatus(isDelivered),
            action: <>
                <CustomDateInput // Hidden in the DOM
                    open={currentDC.dcNo === dcNo && rOpen}
                    value={selectedDate}
                    style={{ left: 0 }}
                    onChange={handleRowDateSelect}
                    onOpenChange={dateRowPickerStatus}
                    disabledDate={disablePastDates}
                    className='app-date-panel-picker'
                    getPopupContainer={node => node.parentNode.parentNode}
                />
                <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, dc)} />
            </>
        }
    }), [deliveries, distributorList, customerList, rOpen, currentDC])

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false);
        resetTrackForm()
        onModalClose()
    }, [])

    const handleRescheduleModalOk = () => {
        setRescheduleModal(false);
        setSelectedDate()
        handleReschedule()
    }

    const handleCancelModalOk = () => {
        setCancelModal(false);
        handleCancelDC(currentDC)
    }

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
    const handleRescheduleModalCancel = useCallback(() => { setRescheduleModal(false); setSelectedDate() }, [])
    const handleCancelModalCancel = useCallback(() => setCancelModal(false), [])
    const handleLogModalCancel = useCallback(() => onLogModalClose(), [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize
    const disabledItems = mode === 'view' ? 'ALL' : mode === 'create' ? 'NONE' : 'FEW'
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
                    <CustomButton text='Add New DC' onClick={onCreateDC} className='app-add-new-btn' icon={<PlusIcon />} />
                    <div className='app-date-picker-wrapper'>
                        <div className='date-picker' onClick={() => setOpen(true)}>
                            <ScheduleIcon />
                            <span>Bulk Reschedule</span>
                        </div>
                        <CustomDateInput // Hidden in the DOM
                            open={open}
                            style={{ left: 0 }}
                            value={selectedDate}
                            className='app-date-panel-picker'
                            onChange={handleDateSelect}
                            onOpenChange={datePickerStatus}
                            disabledDate={disablePastDates}
                        />
                    </div>
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    {...childProps}
                />
            </CustomModal>
            <QuitModal
                visible={rescheduleModal}
                onOk={handleRescheduleModalOk}
                onCancel={handleRescheduleModalCancel}
                title='Are you sure you want to reschedule?'
                okTxt='Yes'
            >
                <ConfirmMessage msg={`${currentDC.dcNo} will be rescheduled to ${dayjs(selectedDate).format('DD/MM/YYYY')}`} />
            </QuitModal>
            <QuitModal
                visible={cancelModal}
                onOk={handleCancelModalOk}
                onCancel={handleCancelModalCancel}
                title={cancelTitle}
                okTxt='Yes'
            >
                <ConfirmMessage msg={cancelMsg} />
            </QuitModal>
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

const renderStatus = (status) => {
    const color = getStatusColor(status)
    const text = status === 'Inprogress' ? 'Pending' : status === 'Completed' ? 'Delivered' : status
    return (
        <div className='status nowrap'>
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
export default Delivery