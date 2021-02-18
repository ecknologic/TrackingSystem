import dayjs from 'dayjs';
import { Menu, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { http } from '../../../modules/http';
import Spinner from '../../../components/Spinner';
import QuitModal from '../../../components/CustomModal';
import { EditIconGrey, ScheduleIcon } from '../../../components/SVG_Icons';
import Actions from '../../../components/Actions';
import SearchInput from '../../../components/SearchInput';
import ConfirmMessage from '../../../components/ConfirmMessage';
import { TODAYDATE, TRACKFORM } from '../../../utils/constants';
import CustomPagination from '../../../components/CustomPagination';
import { getDispatchColumns } from '../../../assets/fixtures';
import { disableFutureDates, getStatusColor } from '../../../utils/Functions';
import DateValue from '../../../components/DateValue';
import CustomDateInput from '../../../components/CustomDateInput';
import axios from 'axios';
const DATEFORMAT = 'DD-MM-YYYY'
const DATEANDTIMEFORMAT = 'DD/MM/YYYY hh:mm A'
const format = 'YYYY-MM-DD'

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
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const [shake, setShake] = useState(false)
    const [open, setOpen] = useState(false)
    const [dispatches, setDispatches] = useState([])
    const [dispatchesClone, setDispatchesClone] = useState([])

    const dispatchColumns = useMemo(() => getDispatchColumns('external'), [])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }
    const customerOrderIdRef = useRef()
    const DCFormTitleRef = useRef()
    const DCFormBtnRef = useRef()

    useEffect(() => {
        getDispatches()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getDispatches = async () => {
        const url = '/motherPlant/getDispatchDetails'

        try {
            const data = await http.GET(axios, url, config)
            setDispatches(data)
            setDispatchesClone(data)
            setTotalCount(data.length)
            setLoading(false)
        } catch (error) { }
    }

    const datePickerStatus = (status) => {
        !status && setOpen(false)
    }

    const handleDateSelect = (value) => {
        setOpen(false)
        setSelectedDate(dayjs(value).format(format))
        const filtered = dispatchesClone.filter(item => dayjs(value).format(DATEFORMAT) === dayjs(item.dispatchedDate).format(DATEFORMAT))
        setDispatches(filtered)
        setTotalCount(filtered.length)
        setPageNumber(1)
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
        const { DCNO: dcnumber, batchId, dispatchedDate, vehicleNo,
            dispatchAddress, vehicleType, driverName, status } = dispatch
        return {
            key: dcnumber,
            dcnumber,
            batchId,
            vehicleNo: vehicleNo + ' ' + vehicleType,
            driverName,
            dispatchTo: dispatchAddress,
            dateAndTime: dayjs(dispatchedDate).format(DATEANDTIMEFORMAT),
            productionDetails: renderOrderDetails(dispatch),
            status: renderStatus(status),
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, dispatch)} />
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
                    />

                </div>
            </div>
            <div className='app-table dispatch-table'>
                <Table
                    loading={{ spinning: loading, indicator: <Spinner /> }}
                    dataSource={dataSource.slice(sliceFrom, sliceTo)}
                    columns={dispatchColumns}
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
    const text = status ? status : 'Pending'
    return (
        <div className='status'>
            <span className='app-dot' style={{ background: color }}></span>
            <span className='status-text'>{text}</span>
        </div>
    )
}

const renderOrderDetails = ({ product20L, product2L, product1L, product500ML, product300ML }) => {
    return `
    20 ltrs - ${product20L ? product20L : 0}, 2 ltrs - ${product2L ? product2L : 0} boxes, 1 ltr - ${product1L ? product1L : 0} boxes, 
    500 ml - ${product500ML ? product500ML : 0} boxes, 300 ml - ${product300ML ? product300ML : 0} boxes
    `
}
const options = [<Menu.Item key="view" icon={<EditIconGrey />}>View/Edit</Menu.Item>]
export default Dispatches