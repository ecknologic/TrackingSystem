import axios from 'axios';
import dayjs from 'dayjs';
import { Menu, message, Table } from 'antd';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import { http } from '../../../modules/http'
import Actions from '../../../components/Actions';
import Spinner from '../../../components/Spinner';
import { TODAYDATE } from '../../../utils/constants';
import DateValue from '../../../components/DateValue';
import { invoiceColumns } from '../../../assets/fixtures';
import SearchInput from '../../../components/SearchInput';
import CustomButton from '../../../components/CustomButton';
import CustomRangeInput from '../../../components/CustomRangeInput';
import CustomPagination from '../../../components/CustomPagination';
import { deepClone, getStatusColor, showToast } from '../../../utils/Functions';
import { DocIconGrey, EditIconGrey, ScheduleIcon, TickIconGrey } from '../../../components/SVG_Icons';
const DATEFORMAT = 'DD/MM/YYYY'
const APIDATEFORMAT = 'YYYY-MM-DD'

const Dashboard = ({ reFetch }) => {
    const history = useHistory()
    const [invoices, setInvoices] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(1)
    const [totalCount, setTotalCount] = useState(null)
    const [selectedRange, setSelectedRange] = useState([])
    const [startDate, setStartDate] = useState(TODAYDATE)
    const [generateDisabled, setGenerateDisabled] = useState(true)
    const [endDate, setEndDate] = useState(TODAYDATE)
    const [open, setOpen] = useState(false)

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        return () => {
            http.ABORT(source)
        }
    }, [])

    useEffect(async () => {
        getInvoices()
    }, [reFetch])

    const getInvoices = async () => {
        const url = '/invoice/getInvoices/Pending'

        try {
            const data = await http.GET(axios, url, config)
            setInvoices(data)
            setTotalCount(data.length)
            setLoading(false)
        } catch (error) { }
    }

    const generateInvoices = async () => {
        const url = '/invoice/generateMultipleInvoices'
        const body = { fromDate: startDate, toDate: endDate }

        try {
            await http.POST(axios, url, body, config)
        } catch (error) { }
    }

    const handlePageChange = (number) => {
        setPageNumber(number)
    }

    const handleSizeChange = (number, size) => {
        setPageSize(size)
        setPageNumber(number)
    }

    const handleMenuSelect = (key, data) => {
        if (key === 'edit') {
            history.push(`/invoices/edit/${data.invoiceId}`)
        }
        else if (key === 'view') {
            history.push('/invoices/manage')
        }
        else handleStatusUpdate(key, data.invoiceId)
    }

    const handleViewInvoice = (invoice) => history.push('/invoices/manage', { invoice })

    const handleGenerateInvoices = async () => {
        try {
            setLoading(true)
            setGenerateDisabled(true)
            await generateInvoices()
            await getInvoices()
        } catch (error) {
            setGenerateDisabled(false)
            setLoading(false)
        }

    }

    const datePickerStatus = (status) => {
        !status && setOpen(false)
    }

    const handleDateSelect = (selected) => {
        const [from, to] = selected
        setStartDate(from.format(APIDATEFORMAT))
        setEndDate(to.format(APIDATEFORMAT))
        setOpen(false)
        setSelectedRange(selected)
        setGenerateDisabled(false)
        setTimeout(() => setSelectedRange([]), 820)
        setPageNumber(1)
    }

    const optimisticUpdate = (id, status) => {
        let clone = deepClone(invoices);
        const index = clone.findIndex(item => item.invoiceId === id)
        clone[index].status = status;
        setInvoices(clone)
    }

    const handleStatusUpdate = async (action, invoiceId) => {
        const status = action === 'paid' ? 'Paid' : 'Pending'
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

    const dataSource = useMemo(() => invoices.map((invoice) => {
        const { invoiceId, createdDateTime, totalAmount, customerName, dueDate, status } = invoice

        const options = [
            <Menu.Item key="edit" icon={<EditIconGrey />}>Edit</Menu.Item>,
            <Menu.Item key="paid" className={status === 'Paid' ? 'disabled' : ''} icon={<TickIconGrey />}>Paid</Menu.Item>,
            <Menu.Item key="due" className={status === 'Pending' ? 'disabled' : ''} icon={<DocIconGrey />}>Due</Menu.Item>
        ]

        return {
            key: invoiceId,
            customerName,
            totalAmount,
            status: renderStatus(status),
            dueDate: dayjs(dueDate).format(DATEFORMAT),
            date: dayjs(createdDateTime).format(DATEFORMAT),
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
                    <DateValue date={startDate} to={endDate} />
                    <div className='app-date-picker-wrapper'>
                        <div className='date-picker' onClick={() => setOpen(true)}>
                            <ScheduleIcon />
                            <span>Select Date</span>
                        </div>
                        <CustomButton
                            style={{ marginLeft: '1em' }}
                            className={`${generateDisabled ? 'disabled' : ''}`}
                            text='Generate'
                            onClick={handleGenerateInvoices}
                        />
                        <CustomRangeInput // Hidden in the DOM
                            open={open}
                            value={selectedRange}
                            style={{ left: 0 }}
                            type='range'
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
                    columns={invoiceColumns}
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
export default Dashboard
