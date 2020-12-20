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
import { TODAYDATE, TRACKFORM } from '../../../utils/constants';
import CustomPagination from '../../../components/CustomPagination';
import { ReceivedMColumns } from '../../../assets/fixtures';
import { disableFutureDates } from '../../../utils/Functions';
import DateValue from '../../../components/DateValue';
const DATEFORMAT = 'DD-MM-YYYY'
const format = 'YYYY-MM-DD'

const ReceivedMaterials = () => {
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
    const [open, setOpen] = useState(false)
    const [RM, setRM] = useState([])
    const [RMClone, setRMClone] = useState([])

    const RMIdRef = useRef()
    const orderIdRef = useRef()
    const formTitleRef = useRef()

    useEffect(() => {
        getRM()
    }, [])

    const getRM = async () => {
        const data = await http.GET('/motherPlant/getRMDetails?status=Approved')
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
        const filtered = RMClone.filter(item => dayjs(value).format(DATEFORMAT) == dayjs(item.dispatchedDate).format(DATEFORMAT))
        setRM(filtered)
        setTotalCount(filtered.length)
    }

    const handleMenuSelect = (key, data) => {
        if (key === 'view') {
            RMIdRef.current = data.rawmaterialid
            formTitleRef.current = `Received Material Details - Order ID - ${data.orderId}`
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

    const dataSource = useMemo(() => RM.map((item) => {
        const { rawmaterialid: key, itemName, itemQty, invoiceNo, status, invoiceValue, invoiceDate, taxAmount } = item
        return {
            key,
            itemName,
            invoiceNo,
            itemQty,
            taxAmount,
            invoiceValue,
            dateAndTime: dayjs(invoiceDate).format('DD/MM/YYYY'),
            status: renderStatus(status),
            action: <TableAction onSelect={({ key }) => handleMenuSelect(key, item)} />
        }
    }), [RM])

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
                    columns={ReceivedMColumns}
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
                title='Are you sure to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </QuitModal>
        </div>
    )
}

const renderStatus = (status) => {
    const color = status === 'Confirmed' ? '#0EDD4D' : '#A10101'
    const text = status === 'Confirmed' ? 'Delivered' : status
    return (
        <div className='status'>
            <span className='dot' style={{ background: color }}></span>
            <span className='status-text'>{text}</span>
        </div>
    )
}

export default ReceivedMaterials