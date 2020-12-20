import dayjs from 'dayjs';
import { Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { http } from '../../../modules/http';
import Spinner from '../../../components/Spinner';
import ConfirmModal from '../../../components/CustomModal';
import { EyeIconGrey, ScheduleIcon } from '../../../components/SVG_Icons';
import SearchInput from '../../../components/SearchInput';
import ConfirmMessage from '../../../components/ConfirmMessage';
import { TODAYDATE, TRACKFORM } from '../../../utils/constants';
import CustomPagination from '../../../components/CustomPagination';
import { getRMColumns } from '../../../assets/fixtures';
import { deepClone, disableFutureDates, getBase64, isEmpty, resetTrackForm, showToast } from '../../../utils/Functions';
import CustomModal from '../../../components/CustomModal';
import MaterialReceivedForm from '../forms/MaterialReceived';
import { validateNames, validateNumber, validateReceivedMaterialValues } from '../../../utils/validations';
import DateValue from '../../../components/DateValue';
import CustomDateInput from '../../../components/CustomDateInput';
const DATEFORMAT = 'DD-MM-YYYY'
const format = 'YYYY-MM-DD'

const AddMaterials = () => {
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [modal, setModal] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const [shake, setShake] = useState(false)
    const [open, setOpen] = useState(false)
    const [RM, setRM] = useState([])
    const [RMClone, setRMClone] = useState([])

    const RMIdRef = useRef()
    const formTitleRef = useRef()
    const RMColumns = useMemo(() => getRMColumns('add'), [])

    useEffect(() => {
        getRM()
    }, [])

    const getRM = async () => {
        const data = await http.GET('/motherPlant/getRMDetails')
        setRM(data)
        setRMClone(data)
        setTotalCount(data.length)
        setLoading(false)
    }

    const datePickerStatus = (status) => {
        !status && setOpen(false)
    }

    const handleDateSelect = (value) => {
        setOpen(false)
        setSelectedDate(dayjs(value).format(format))
        let filteredData = RMClone.filter(item => dayjs(value).format(DATEFORMAT) == dayjs(item.dispatchedDate).format(DATEFORMAT))
        setRM(filteredData)
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

        // invoiceDate ?
        // Validations
        if (key === 'managerName') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'taxAmount' || key === 'receiptNo' ||
            key === 'invoiceAmount' || key === 'invoiceNo') {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleUpload = (file) => {
        getBase64(file, async (buffer) => {
            setFormData(data => ({ ...data, receiptImage: buffer }))
            setFormErrors(errors => ({ ...errors, receiptImage: '' }))
        })
    }

    const handleRemove = () => setFormData(data => ({ ...data, receiptImage: '' }))

    const handleUpdate = async () => {
        const formErrors = validateReceivedMaterialValues(formData)

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        const rawmaterialid = RMIdRef.current

        const body = { ...formData, rawmaterialid }
        const url = '/motherPlant/createRMReceipt'
        const otherUrl = '/motherPlant/updateRMStatus'
        const otherBody = { rawmaterialid, status: 'Approved' }

        try {
            setBtnDisabled(true)
            showToast('Received Materials', 'loading', 'PUT')
            await http.POST(url, body)
            await http.PUT(otherUrl, otherBody)
            optimisticUpdate(rawmaterialid)
            showToast('Received Materials', 'success', 'PUT')
            onModalClose(true)
            setBtnDisabled(false)
        } catch (error) {
            setBtnDisabled(false)
        }
    }

    const onModalClose = (hasSaved) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasSaved) {
            return setConfirmModal(true)
        }
        setModal(false)
        setBtnDisabled(false)
        setFormData({})
        setFormErrors({})
    }

    const optimisticUpdate = (id) => {
        let clone = deepClone(RM);
        const index = clone.findIndex(item => item.rawmaterialid === id)
        clone[index].status = 'Approved';
        setRM(clone)
    }

    const renderStatus = (status, item) => {
        let text = status === 'Approved' ? 'Confirm' : status

        const style = {
            color: status === 'Approved' ? '#007AFF' : '',
            fontFamily: status === 'Approved' ? 'PoppinsSemiBold600' : 'PoppinsMedium500'
        }

        return (
            <div className='eye-container'>
                <span style={style}>{text}</span>
                <EyeIconGrey className='eye' onClick={() => onConfirm(item)} />
            </div>
        )
    }

    const onConfirm = (data) => {
        RMIdRef.current = data.rawmaterialid
        formTitleRef.current = `Received Material Details - Order ID - ${data.orderId}`
        setFormData(data)
        setModal(true)
    }

    const dataSource = useMemo(() => RM.map((item) => {
        const { rawmaterialid: key, orderId, itemCode, itemName, approvedDate, reorderLevel,
            minOrderLevel, vendorName, itemQty, status } = item
        return {
            key,
            orderId,
            itemCode,
            itemQty,
            reorderLevel,
            vendorName,
            minOrderLevel,
            itemName,
            dateAndTime: dayjs(approvedDate).format('DD/MM/YYYY'),
            status: renderStatus(status, item)
        }
    }), [RM])

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false)
        resetTrackForm()
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
                    <DateValue date={selectedDate} />
                    <div className='app-date-picker-wrapper'>
                        <div className='date-picker' onClick={() => setOpen(true)}>
                            <ScheduleIcon />
                            <span>Select Date</span>
                        </div>
                        <CustomDateInput // Hidden in the DOM
                            open={open}
                            style={{ left: 0 }}
                            value={selectedDate}
                            placeholder='Select Date'
                            className='date-panel-picker'
                            onChange={handleDateSelect}
                            onOpenChange={datePickerStatus}
                            disabledDate={disableFutureDates}
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
                    columns={RMColumns}
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
                visible={modal}
                btnDisabled={btnDisabled}
                onOk={handleUpdate}
                onCancel={handleModalCancel}
                title={formTitleRef.current}
                okTxt='Confirm Details'
                track
            >
                <MaterialReceivedForm
                    track
                    data={formData}
                    errors={formErrors}
                    onChange={handleChange}
                    onUpload={handleUpload}
                    onRemove={handleRemove}
                />
            </CustomModal>
            <ConfirmModal
                visible={confirmModal}
                onOk={handleConfirmModalOk}
                onCancel={handleConfirmModalCancel}
                title='Are you sure to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </ConfirmModal>
        </div>
    )
}

export default AddMaterials