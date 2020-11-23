import { message, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { http } from '../../../modules/http';
import SelectInput from '../../../components/SelectInput';
import { deliveryColumns, getRouteOptions, getDriverOptions } from '../../../assets/fixtures';
import CustomButton from '../../../components/CustomButton';
import SearchInput from '../../../components/SearchInput';
import { PlusIcon, LinesIconGrey } from '../../../components/SVG_Icons';
import Spinner from '../../../components/Spinner';
import TableAction from '../../../components/TableAction';
import CustomModal from '../../../components/CustomModal';
import DCForm from '../forms/DCForm';
import QuitModal from '../../../components/CustomModal';
import ConfirmMessage from '../../../components/ConfirmMessage';
import { validateMobileNumber, validateNames, validateNumber, validateDCValues } from '../../../utils/validations';
import { isEmpty, resetTrackForm, getDCValuesForDB } from '../../../utils/Functions';
import { getWarehoseId, TRACKFORM } from '../../../utils/constants';

const Delivery = ({ date }) => {
    const warehouseId = getWarehoseId()
    const [routes, setRoutes] = useState([])
    const [drivers, setDrivers] = useState([])
    const [loading, setLoading] = useState(true)
    const [deliveries, setDeliveries] = useState([])
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [deliveriesClone, setDeliveriesClone] = useState([])
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [DCModal, setDCModal] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [shake, setShake] = useState(false)

    const routeOptions = useMemo(() => getRouteOptions(routes), [routes])
    const driverOptions = useMemo(() => getDriverOptions(drivers), [drivers])

    const customerIdRef = useRef()

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
        const url = `/warehouse/deliveryDetails/${date}`
        const data = await http.GET(url)
        setDeliveriesClone(data)
        setDeliveries(data)
        setLoading(false)
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
        if (key === 'personShopName') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'phoneNumber') {
            const error = validateMobileNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key.includes('Box') || key.includes('Can')) {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, stockDetails: error }))
        }
    }

    const handleBlur = (value, key) => {
        // Validations
        if (key === 'phoneNumber') {
            const error = validateMobileNumber(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleRouteSelect = () => {

    }
    const handleRouteDeselect = () => {

    }

    const handleMenuSelect = (key, data) => {
        if (key === 'view') {
            customerIdRef.current = data.customerOrderId
            setFormData(data)
            setDCModal(true)
        }
    }

    const handleSaveDC = async () => {
        const dcErrors = validateDCValues(formData)

        if (!isEmpty(dcErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(dcErrors)
            return
        }

        const dcValues = getDCValuesForDB(formData)
        const customerOrderId = customerIdRef.current

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
            message.loading('Adding DC...', 0)
            let { data: [data] } = await http[method](url, body)
            // setRecentDelivery(data)
            message.success('DC added successfully!')
            onModalClose(true)
        } catch (error) {
            setBtnDisabled(false)
        }
    }

    const onModalClose = (hasSaved) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasSaved) {
            return setConfirmModal(true)
        }
        customerIdRef.current = undefined
        setDCModal(false)
        setBtnDisabled(false)
        setFormData({})
        setFormErrors({})
    }

    const dataSource = useMemo(() => deliveries.map((delivery, index) => {
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

    const onCreateDC = useCallback(() => setDCModal(true), [])
    const handleDCModalCancel = useCallback(() => onModalClose(), [])
    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])

    return (
        <div className='stock-delivery-container'>
            <div className='header'>
                <div className='left'>
                    <SelectInput
                        mode='multiple'
                        placeholder='Select Routes'
                        className='filter-select'
                        suffixIcon={<LinesIconGrey />}
                        value={[]} options={routeOptions}
                        onSelect={handleRouteSelect}
                        onDeselect={handleRouteDeselect}
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
            <div className='stock-delivery-table'>
                <Table
                    loading={{ spinning: loading, indicator: <Spinner /> }}
                    dataSource={dataSource}
                    columns={deliveryColumns}
                />
            </div>
            <CustomModal
                className={`app-form-modal ${shake ? 'app-shake' : ''}`}
                visible={DCModal}
                btnDisabled={btnDisabled}
                onOk={handleSaveDC}
                onCancel={handleDCModalCancel}
                title='Create New DC'
                okTxt='Save'
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

const renderStatus = (delivered) => {
    const color = delivered === 'Inprogress' ? '#A10101' : '#0EDD4D'
    const text = delivered === 'Inprogress' ? 'Pending' : 'Delivered'
    return (
        <div className='status'>
            <span className='dot' style={{ background: color }}></span>
            <span className='status-text'>{text}</span>
        </div>
    )
}

const renderOrderDetails = (data) => {
    return `
    20 lts - ${data['20LCans']}, 1 ltr - ${data['1LBoxes']} boxes, 
    500 ml - ${data['500MLBoxes']} boxes, 250 ml - ${data['250MLBoxes']} boxes
    `
}

export default Delivery