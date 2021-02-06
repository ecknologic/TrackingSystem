import axios from 'axios';
import { Menu, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DCForm from '../forms/DCForm';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import Actions from '../../../../components/Actions';
import QuitModal from '../../../../components/CustomModal';
import SearchInput from '../../../../components/SearchInput';
import CustomModal from '../../../../components/CustomModal';
import CustomButton from '../../../../components/CustomButton';
import RoutesFilter from '../../../../components/RoutesFilter';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import { getWarehoseId, TRACKFORM } from '../../../../utils/constants';
import CustomPagination from '../../../../components/CustomPagination';
import { EditIconGrey, PlusIcon } from '../../../../components/SVG_Icons';
import { deliveryColumns, getRouteOptions, getDriverOptions } from '../../../../assets/fixtures';
import { validateMobileNumber, validateNames, validateNumber, validateDCValues } from '../../../../utils/validations';
import { isEmpty, resetTrackForm, getDCValuesForDB, showToast, deepClone, getStatusColor } from '../../../../utils/Functions';

const Delivery = ({ date, source }) => {
    const warehouseId = getWarehoseId()
    const [routes, setRoutes] = useState([])
    const [drivers, setDrivers] = useState([])
    const [loading, setLoading] = useState(true)
    const [deliveriesClone, setDeliveriesClone] = useState([])
    const [deliveries, setDeliveries] = useState([])
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [DCModal, setDCModal] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [filterInfo, setFilterInfo] = useState([])
    const [shake, setShake] = useState(false)
    const [okTxt, setOkTxt] = useState('')
    const [title, setTitle] = useState('')
    const [mode, setMode] = useState(false)

    const routeOptions = useMemo(() => getRouteOptions(routes), [routes])
    const driverOptions = useMemo(() => getDriverOptions(drivers), [drivers])
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
        const url = `/customer/getRoutes/${warehouseId}`

        try {
            const data = await http.GET(axios, url, config)
            setRoutes(data)
        } catch (error) { }
    }

    const getDrivers = async () => {
        const url = `/bibo/getdriverDetails/${warehouseId}`

        try {
            const data = await http.GET(axios, url, config)
            setDrivers(data)
        } catch (error) { }
    }

    const getDeliveries = async () => {
        const url = `/warehouse/deliveryDetails/${date}`

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

        // Validations
        if (key === 'customerName') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'mobileNumber') {
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
        if (key === 'mobileNumber') {
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
        }
        else generateFiltered(deliveriesClone, data)
    }

    const generateFiltered = (original, filterInfo) => {
        const filtered = original.filter((item) => filterInfo.includes(item.RouteId))
        setDeliveries(filtered)
        setTotalCount(filtered.length)
    }

    const handleMenuSelect = (key, data) => {
        if (key === 'view') {
            const { dcNo, isDelivered } = data
            setTitle(dcNo)
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
        const { customerOrderId } = formData

        let url = '/warehouse/createDC'
        let method = 'POST'
        let v1Ing = 'Creating'
        let v2 = 'created'

        if (customerOrderId) {
            url = '/customer/updateCustomerOrderDetails'
            method = 'PUT'
            v1Ing = 'Updating'
            v2 = 'updated'
        }

        const body = {
            ...dcValues, warehouseId, customerOrderId
        }
        const options = { item: 'DC', v1Ing, v2 }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            let [data = {}] = await http[method](url, body)
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
        setFormData({})
        setFormErrors({})
    }

    const dataSource = useMemo(() => deliveries.map((dc) => {
        const { dcNo, customerOrderId, address, RouteName, driverName, customerName, isDelivered } = dc
        return {
            key: customerOrderId || dcNo,
            dcnumber: dcNo,
            shopAddress: address,
            route: RouteName,
            name: customerName,
            driverName: driverName || 'Not Assigned',
            orderDetails: renderOrderDetails(dc),
            status: renderStatus(isDelivered),
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, dc)} />
        }
    }), [deliveries])

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false);
        resetTrackForm()
        onModalClose()
    }, [])

    const onCreateDC = useCallback(() => {
        setMode('create')
        setTitle('Add New DC')
        setOkTxt('Save')
        setDCModal(true)
    }, [])

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
                        routes={routes}
                        onChange={onFilterChange}
                    />
                    <CustomButton text='Create New DC' onClick={onCreateDC} className='app-add-new-btn' icon={<PlusIcon />} />
                </div>
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

const renderOrderDetails = ({ cans20L, boxes1L, boxes500ML, boxes250ML }) => {
    return `
    20 lts - ${cans20L}, 1 ltr - ${boxes1L} boxes, 
    500 ml - ${boxes500ML} boxes, 250 ml - ${boxes250ML} boxes
    `
}
const options = [<Menu.Item key="view" icon={<EditIconGrey />}>View/Edit</Menu.Item>]
export default Delivery