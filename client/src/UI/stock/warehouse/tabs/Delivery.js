import { Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DCForm from '../forms/DCForm';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import QuitModal from '../../../../components/CustomModal';
import { PlusIcon } from '../../../../components/SVG_Icons';
import TableAction from '../../../../components/TableAction';
import SearchInput from '../../../../components/SearchInput';
import CustomModal from '../../../../components/CustomModal';
import CustomButton from '../../../../components/CustomButton';
import RoutesFilter from '../../../../components/RoutesFilter';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import { getWarehoseId, TRACKFORM } from '../../../../utils/constants';
import CustomPagination from '../../../../components/CustomPagination';
import { deliveryColumns, getRouteOptions, getDriverOptions } from '../../../../assets/fixtures';
import { validateMobileNumber, validateNames, validateNumber, validateDCValues } from '../../../../utils/validations';
import { isEmpty, resetTrackForm, getDCValuesForDB, showToast, deepClone, getStatusColor } from '../../../../utils/Functions';

const Delivery = ({ date }) => {
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

    const routeOptions = useMemo(() => getRouteOptions(routes), [routes])
    const driverOptions = useMemo(() => getDriverOptions(drivers), [drivers])

    const customerOrderIdRef = useRef()
    const DCFormTitleRef = useRef()
    const DCFormBtnRef = useRef()

    useEffect(() => {
        getRoutes()
        getDrivers()
    }, [])

    useEffect(() => {
        getDeliveries()
    }, [date])

    const getRoutes = async () => {
        const data = await http.GET('/warehouse/getroutes')
        setRoutes(data)
    }

    const getDrivers = async () => {
        const url = `/warehouse/getdriverDetails/${warehouseId}`
        const data = await http.GET(url)
        setDrivers(data)
    }

    const getDeliveries = async () => {
        setLoading(true)
        const url = `/warehouse/deliveryDetails/${date}`
        const data = await http.GET(url)
        setPageNumber(1)
        setDeliveriesClone(data)
        setLoading(false)
        if (filterInfo.length) {
            generateFiltered(data, filterInfo)
        }
        else {
            setTotalCount(data.length)
            setDeliveries(data)
        }
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
            setFormErrors(errors => ({ ...errors, stockDetails: error }))
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
        if (!data.length) {
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
            customerOrderIdRef.current = data.customerOrderId
            DCFormTitleRef.current = `DC - ${data.customerName}`
            DCFormBtnRef.current = 'Update'
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
        const customerOrderId = customerOrderIdRef.current

        let url = '/warehouse/createDC'
        let method = 'POST'
        if (customerOrderId) {
            url = '/warehouse/updateDC'
            method = 'PUT'
        }

        const body = {
            ...dcValues, warehouseId, customerOrderId
        }

        try {
            setBtnDisabled(true)
            showToast('DC', 'loading', method)
            let { data: [data = {}] } = await http[method](url, body)
            showToast('DC', 'success', method)
            optimisticUpdate(data, method)
            onModalClose(true)
        } catch (error) {
            setBtnDisabled(false)
        }
    }

    const optimisticUpdate = (data, method) => {
        if (method === 'PUT') {
            const clone = deepClone(deliveries)
            const index = clone.findIndex(dc => dc.dcNo === data.dcNo)
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
        customerOrderIdRef.current = undefined
        setDCModal(false)
        setBtnDisabled(false)
        setFormData({})
        setFormErrors({})
    }

    const dataSource = useMemo(() => deliveries.map((delivery) => {
        const { dcNo, address, RouteName, driverName, isDelivered } = delivery
        return {
            key: dcNo,
            dcnumber: dcNo,
            shopAddress: address,
            route: RouteName,
            driverName: driverName,
            orderDetails: renderOrderDetails(delivery),
            status: renderStatus(isDelivered),
            action: <TableAction onSelect={({ key }) => handleMenuSelect(key, delivery)} />
        }
    }), [deliveries])

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false);
        resetTrackForm()
        onModalClose()
    }, [])

    const onCreateDC = useCallback(() => {
        DCFormTitleRef.current = 'Add New DC'
        DCFormBtnRef.current = 'Save'
        setDCModal(true)
    }, [])

    const handleDCModalCancel = useCallback(() => onModalClose(), [])
    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

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
                        onSearch={() => { }}
                        onChange={() => { }}
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
                onOk={handleSubmit}
                onCancel={handleDCModalCancel}
                title={DCFormTitleRef.current}
                okTxt={DCFormBtnRef.current}
                track
            >
                <DCForm
                    track
                    data={formData}
                    errors={formErrors}
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
                title='Are you sure to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </QuitModal>
        </div>
    )
}

const renderStatus = (status) => {
    const color = getStatusColor(status)
    const text = status === 'Inprogress' ? 'Pending' : 'Delivered'
    return (
        <div className='status'>
            <span className='dot' style={{ background: color }}></span>
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
export default Delivery