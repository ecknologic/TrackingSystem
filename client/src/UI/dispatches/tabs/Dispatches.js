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
const DATEFORMAT = 'DD-MM-YYYY'
const DATEANDTIMEFORMAT = 'DD/MM/YYYY hh:mm A'

const Dispatches = () => {
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [DCModal, setDCModal] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [shake, setShake] = useState(false)
    const [open, setOpen] = useState(false)
    const [dispatches, setDispatches] = useState([])
    const [dispatchesClone, setDispatchesClone] = useState([])

    const customerOrderIdRef = useRef()
    const DCFormTitleRef = useRef()
    const DCFormBtnRef = useRef()

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
        const filteredData = dispatchesClone.filter(item => dayjs(value).format(DATEFORMAT) === dayjs(item.dispatchedDate).format(DATEFORMAT))
        setDispatches(filteredData)
        setTotalCount(filteredData.length)
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
export default Dispatches