import dayjs from 'dayjs';
import { DatePicker, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { http } from '../../../modules/http';
import Spinner from '../../../components/Spinner';
import QuitModal from '../../../components/CustomModal';
import { ScheduleIcon } from '../../../components/SVG_Icons';
import TableAction from '../../../components/TableAction';
import SearchInput from '../../../components/SearchInput';
import ConfirmMessage from '../../../components/ConfirmMessage';
import { TRACKFORM } from '../../../utils/constants';
import CustomPagination from '../../../components/CustomPagination';
import { dispatchColumns } from '../../../assets/fixtures';
import { disableFutureDates } from '../../../utils/Functions';
import CustomModal from '../../../components/CustomModal';
import MaterialReceivedForm from '../forms/MaterialReceived';
const DATEFORMAT = 'DD-MM-YYYY'
const DATEANDTIMEFORMAT = 'DD/MM/YYYY hh:mm A'

const AddMaterials = () => {
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [viewModal, setViewModal] = useState(false)
    const [modal, setModal] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [shake, setShake] = useState(false)
    const [open, setOpen] = useState(false)
    const [dispatches, setDispatches] = useState([])
    const [dispatchesClone, setDispatchesClone] = useState([])

    const orderIdRef = useRef()
    const formTitleRef = useRef()
    const formBtnRef = useRef()

    useEffect(() => {
        getDispatches()
    }, [])

    const getDispatches = async () => {
        const data = await http.GET('/motherPlant/getDispatchDetails')
        setDispatches(data)
        setDispatchesClone(data)
        setTotalCount(data.length)
        setLoading(false)
    }

    const datePickerStatus = (status) => {
        !status && setOpen(false)
    }

    const handleDateSelect = (value) => {
        setOpen(false)
        let filteredData = dispatchesClone.filter(item => dayjs(value).format(DATEFORMAT) == dayjs(item.dispatchedDate).format(DATEFORMAT))
        setDispatches(filteredData)
    }

    const handleMenuSelect = (key, data) => {
        if (key === 'view') {
            orderIdRef.current = data.customerOrderId
            formTitleRef.current = `Received Material Details - Order ID - ${data.orderId}`
            formBtnRef.current = 'Confirm Details'
            setFormData(data)
            setModal(true)
        }
    }

    const handlePageChange = (number) => {
        setPageNumber(number)
    }

    const handleSizeChange = (number, size) => {
        setPageSize(size)
        setPageNumber(number)
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        // // Validations
        // if (key === 'gstNo') {
        //     const error = validateIDNumbers(key, value)
        //     setFormErrors(errors => ({ ...errors, [key]: error }))
        // }
        // if (key === 'deliveryLocation') {
        //     const error = validateNames(value)
        //     setFormErrors(errors => ({ ...errors, [key]: error }))
        // }
        // else if (key === 'phoneNumber') {
        //     const error = validateMobileNumber(value)
        //     setFormErrors(errors => ({ ...errors, [key]: error }))
        // }
        // else if (key === 'depositAmount') {
        //     const error = validateNumber(value)
        //     setFormErrors(errors => ({ ...errors, [key]: error }))
        // }
        // else if (key === 'contactPerson') {
        //     const error = validateNames(value)
        //     setFormErrors(errors => ({ ...errors, [key]: error }))
        // }
        // else if (key.includes('price') || key.includes('product')) {
        //     const error = validateNumber(value)
        //     setFormErrors(errors => ({ ...errors, productNPrice: error }))
        // }
    }

    const handleBlur = (value, key) => {
        // Validations
        // if (key === 'gstNo') {
        //     const error = validateIDNumbers(key, value, true)
        //     setFormErrors(errors => ({ ...errors, [key]: error }))
        // }
        // else if (key === 'phoneNumber') {
        //     const error = validateMobileNumber(value, true)
        //     setFormErrors(errors => ({ ...errors, [key]: error }))
        // }
    }

    const handleUpdate = async () => {
        // const deliveryErrors = validateDeliveryValues(formData)
        // const devDaysError = validateDevDays(devDays)

        // if (!isEmpty(deliveryErrors) || !isEmpty(devDaysError)) {
        //     setShake(true)
        //     setTimeout(() => setShake(false), 820)
        //     setFormErrors(deliveryErrors)
        //     setDevDaysError(devDaysError)
        //     return
        // }

        // const productsUI = extractProductsFromForm(formData)
        // const products = getProductsWithIdForDB(productsUI)
        // const deliveryDays = getDevDaysForDB(devDays)
        // const formValues = extractDeliveryDetails(formData)
        // const body = [{ ...formValues, isNew: false, delete: 0, isActive: 0, products, deliveryDays }]

        // const url = '/customer/updateDeliveryDetails'
        // try {
        //     setBtnDisabled(true)
        //     showToast('Delivery details', 'loading', 'PUT')
        //     const { data: [data] } = await http.POST(url, body)
        //     updateDeliveryDetails(data)
        //     showToast('Delivery details', 'success', 'PUT')
        //     onModalClose(true)
        //     setBtnDisabled(false)
        // } catch (error) {
        //     setBtnDisabled(false)
        // }
    }

    const onModalClose = (hasSaved) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasSaved) {
            return setConfirmModal(true)
        }
        orderIdRef.current = undefined
        setModal(false)
        setBtnDisabled(false)
        setFormData({})
        setFormErrors({})
    }

    const dataSource = useMemo(() => dispatches.map((dispatch) => {
        const { DCNO: dcnumber, batchId, dispatchedDate, departmentName, dispatchType, vehicleNo,
            dispatchAddress, vehicleType, driverName, status } = dispatch
        return {
            key: dcnumber,
            dcnumber,
            batchId,
            vehicleNo: vehicleNo + ' ' + vehicleType,
            driverName,
            dispatchTo: dispatchType === 'Internal' ? departmentName : dispatchAddress,
            dateAndTime: dayjs(dispatchedDate).format(DATEANDTIMEFORMAT),
            productionDetails: renderOrderDetails(dispatch),
            status: renderStatus(status),
            action: <TableAction onSelect={({ key }) => handleMenuSelect(key, dispatch)} />
        }
    }), [dispatches])

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false);
        onModalClose()
    }, [])

    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])
    const handleModalCancel = useCallback(() => onModalClose(), [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <div className='stock-delivery-container'>
            <div className='header'>
                <div className='left'>
                    <div className='app-date-picker-wrapper'>
                        <div className='date-picker' onClick={() => setOpen(true)}>
                            <ScheduleIcon />
                            <span>Select Date</span>
                        </div>
                        <DatePicker // Hidden in the DOM
                            open={open}
                            style={{ left: 0 }}
                            placeholder='Select Date'
                            className='date-panel-picker'
                            onChange={handleDateSelect}
                            onOpenChange={datePickerStatus}
                            disabledDate={disableFutureDates}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                        />
                    </div>
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
            <div className='app-table dispatch-table'>
                <Table
                    loading={{ spinning: loading, indicator: <Spinner /> }}
                    dataSource={dataSource.slice(sliceFrom, sliceTo)}
                    columns={dispatchColumns}
                    pagination={false}
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
                visible={modal}
                btnDisabled={btnDisabled}
                onOk={handleUpdate}
                onCancel={handleModalCancel}
                title={formTitleRef.current}
                okTxt={formBtnRef.current}
                track
            >
                <MaterialReceivedForm
                    track
                    data={formData}
                    errors={formErrors}
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
    const color = status ? '#0EDD4D' : '#A10101'
    const text = status ? status : 'Pending'
    return (
        <div className='status'>
            <span className='dot' style={{ background: color }}></span>
            <span className='status-text'>{text}</span>
        </div>
    )
}

const renderOrderDetails = ({ product20L, product1L, product500ML, product250ML }) => {
    return `
    20 lts - ${product20L ? product20L : 0}, 1 ltr - ${product1L ? product1L : 0} boxes, 
    500 ml - ${product500ML ? product500ML : 0} boxes, 250 ml - ${product250ML ? product250ML : 0} boxes
    `
}
export default AddMaterials