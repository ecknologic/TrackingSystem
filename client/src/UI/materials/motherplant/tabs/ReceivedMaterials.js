import axios from 'axios';
import dayjs from 'dayjs';
import { Menu, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import Actions from '../../../../components/Actions';
import { TODAYDATE } from '../../../../utils/constants';
import DateValue from '../../../../components/DateValue';
import SearchInput from '../../../../components/SearchInput';
import CustomModal from '../../../../components/CustomModal';
import ReceivedMaterialView from '../views/ReceivedMaterials';
import { getReceivedRMColumns } from '../../../../assets/fixtures';
import CustomDateInput from '../../../../components/CustomDateInput';
import CustomPagination from '../../../../components/CustomPagination';
import { EyeIconGrey, ScheduleIcon } from '../../../../components/SVG_Icons';
import { base64String, disableFutureDates, getStatusColor } from '../../../../utils/Functions';
const DATEFORMAT = 'DD-MM-YYYY'
const format = 'YYYY-MM-DD'

const ReceivedMaterials = ({ isSuperAdmin = false }) => {
    const [loading, setLoading] = useState(true)
    const [viewData, setViewData] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const [viewModal, setViewModal] = useState(false)
    const [formTitle, setFormTitle] = useState('')
    const [open, setOpen] = useState(false)
    const [RM, setRM] = useState([])
    const [RMClone, setRMClone] = useState([])

    const ReceivedMColumns = useMemo(() => getReceivedRMColumns(isSuperAdmin), [])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getRM()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getRM = async () => {
        const url = `/motherPlant/getRMReceiptDetails?isSuperAdmin=${isSuperAdmin}`

        try {
            const data = await http.GET(axios, url, config)
            setRM(data)
            setRMClone(data)
            setTotalCount(data.length)
            setLoading(false)
        } catch (error) { }
    }

    const getRMById = async (id) => {
        const url = `/motherPlant/getReceiptDetails/${id}`

        try {
            const [data] = await http.GET(axios, url, config)
            const receiptImage = base64String(data?.receiptImage?.data)
            setViewData(data => ({ ...data, receiptImage }))
        } catch (error) { }
    }

    const datePickerStatus = (status) => {
        !status && setOpen(false)
    }

    const handleDateSelect = (value) => {
        setOpen(false)
        setSelectedDate(dayjs(value).format(format))
        const filtered = RMClone.filter(item => dayjs(value).format(DATEFORMAT) == dayjs(item.invoiceDate).format(DATEFORMAT))
        setRM(filtered)
        setTotalCount(filtered.length)
        setPageNumber(1)
    }

    const handleMenuSelect = (key, data) => {
        if (key === 'view') {
            setFormTitle(`Received Material Details - ${data.orderId}`)
            setViewData(data)
            getRMById(data.rawmaterialId)
            setViewModal(true)
        }
    }

    const handlePageChange = (number) => {
        setPageNumber(number)
    }

    const handleSizeChange = (number, size) => {
        setPageSize(size)
        setPageNumber(number)
    }

    const dataSource = useMemo(() => RM.map((item) => {
        const { rawmaterialid: key, itemName, orderId, itemQty, invoiceNo, vendorName, invoiceAmount,
            invoiceDate, taxAmount, departmentName } = item

        return {
            key,
            itemName,
            invoiceNo,
            taxAmount,
            itemQty,
            orderId,
            vendorName,
            invoiceAmount,
            departmentName,
            dateAndTime: dayjs(invoiceDate).format('DD/MM/YYYY'),
            status: renderStatus('Delivered'),
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, item)} />
        }
    }), [RM])

    const handleModalCancel = useCallback(() => setViewModal(false), [])

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
            <CustomModal
                hideCancel
                okTxt='Close'
                visible={viewModal}
                title={formTitle}
                onOk={handleModalCancel}
                onCancel={handleModalCancel}
                className='app-form-modal app-view-modal'
            >
                <ReceivedMaterialView
                    data={viewData}
                />
            </CustomModal>
        </div>
    )
}

const renderStatus = (status) => {
    const color = getStatusColor(status)
    return (
        <div className='status'>
            <span className='app-dot' style={{ background: color }}></span>
            <span className='status-text'>{status}</span>
        </div>
    )
}
const options = [<Menu.Item key="view" icon={<EyeIconGrey />}>View</Menu.Item>]
export default ReceivedMaterials