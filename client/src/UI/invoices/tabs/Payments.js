import axios from 'axios';
import dayjs from 'dayjs';
import { Menu, message, Table } from 'antd';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import { http } from '../../../modules/http'
import Spinner from '../../../components/Spinner';
import { TODAYDATE } from '../../../utils/constants';
import DateValue from '../../../components/DateValue';
import { paymentColumns } from '../../../assets/fixtures';
import SearchInput from '../../../components/SearchInput';
import { deepClone, getStatusColor, showToast } from '../../../utils/Functions';
import { DocIconGrey, ListViewIconGrey, ScheduleIcon, SendIconGrey } from '../../../components/SVG_Icons';
import CustomDateInput from '../../../components/CustomDateInput';
import CustomPagination from '../../../components/CustomPagination';
import Actions from '../../../components/Actions';
const DATEFORMAT = 'DD/MM/YYYY'
const APIDATEFORMAT = 'YYYY-MM-DD'

const Payments = ({ reFetch, onUpdate }) => {
    const history = useHistory()
    const [invoices, setInvoices] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(1)
    const [totalCount, setTotalCount] = useState(null)
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const [open, setOpen] = useState(false)

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        return () => {
            http.ABORT(source)
        }
    }, [])

    useEffect(() => {
        setLoading(true)
        getInvoices()
    }, [reFetch])

    const getInvoices = async () => {
        const url = '/invoice/getInvoices/Paid'

        try {
            const data = await http.GET(axios, url, config)
            setInvoices(data)
            setTotalCount(data.length)
            setLoading(false)
        } catch (error) { }
    }

    const handlePageChange = (number) => {
        setPageNumber(number)
    }

    const handleSizeChange = (number, size) => {
        setPageSize(size)
        setPageNumber(number)
    }

    const datePickerStatus = (status) => {
        !status && setOpen(false)
    }

    const handleViewInvoice = (invoice) => history.push('/invoices/manage', { invoice })

    const handleDateSelect = (value) => {
        setOpen(false)
        setSelectedDate(dayjs(value).format(APIDATEFORMAT))
        const filtered = invoices.filter(item => dayjs(value).format(DATEFORMAT) === dayjs(item.createdDateTime).format(DATEFORMAT))
        setInvoices(filtered)
        setTotalCount(filtered.length)
        setPageNumber(1)
    }

    const handleMenuSelect = (key, data) => {
        if (key === 'resend') {
        }
        else if (key === 'dcList') {
            history.push(`/invoices/delivery-challan/${data.invoiceId}`, data)
        }
        else handleStatusUpdate(data.invoiceId)
    }

    const handleStatusUpdate = async (invoiceId) => {
        const status = 'Pending'
        const options = { item: 'Invoice status', v1Ing: 'Updating', v2: 'updated' }
        const url = `/invoice/updateInvoiceStatus`
        const body = { status, invoiceId }
        try {
            showToast({ ...options, action: 'loading' })
            await http.PUT(axios, url, body, config)
            optimisticUpdate(invoiceId, status)
            showToast(options)
        } catch (error) {
            message.destroy()
        }
    }

    const optimisticUpdate = (id, status) => {
        let clone = deepClone(invoices);
        const index = clone.findIndex(item => item.invoiceId === id)
        clone[index].status = status;
        setInvoices(clone)
        onUpdate()
    }

    const dataSource = useMemo(() => invoices.map((invoice) => {
        const { invoiceId, createdDateTime, totalAmount, organizationName, dueDate, status } = invoice

        const options = [
            <Menu.Item key="resend" icon={<SendIconGrey />}>Resend</Menu.Item>,
            <Menu.Item key="dcList" icon={<ListViewIconGrey />}>DC List</Menu.Item>,
            <Menu.Item key="due" icon={<DocIconGrey />}>Due</Menu.Item>
        ]

        return {
            key: invoiceId,
            organizationName,
            totalAmount,
            dueDate: dayjs(dueDate).format(DATEFORMAT),
            date: dayjs(createdDateTime).format(DATEFORMAT),
            status: renderStatus(status),
            invoiceId: <span className='app-link' onClick={() => handleViewInvoice(invoice)}>{invoiceId}</span>,
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, invoice)} />
        }
    }), [invoices])

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
                        />
                    </div>
                </div>
                <div className='right'>
                    <SearchInput
                        placeholder='Search Invoice'
                        className='delivery-search'
                        width='50%'
                    />
                </div>
            </div>
            <div className='app-table dispatch-table'>
                <Table
                    loading={{ spinning: loading, indicator: <Spinner /> }}
                    dataSource={dataSource.slice(sliceFrom, sliceTo)}
                    columns={paymentColumns}
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
export default Payments
