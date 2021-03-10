import axios from 'axios';
import dayjs from 'dayjs';
import { Menu, message, Table } from 'antd';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http'
import Actions from '../../../../components/Actions';
import Spinner from '../../../../components/Spinner';
import { TODAYDATE } from '../../../../utils/constants';
import DateValue from '../../../../components/DateValue';
import SearchInput from '../../../../components/SearchInput';
import CustomButton from '../../../../components/CustomButton';
import RoutesFilter from '../../../../components/RoutesFilter';
import { getInvoiceColumns } from '../../../../assets/fixtures';
import CustomRangeInput from '../../../../components/CustomRangeInput';
import CustomPagination from '../../../../components/CustomPagination';
import { deepClone, getStatusColor, showToast } from '../../../../utils/Functions';
import { ListViewIconGrey, ScheduleIcon, SendIconGrey, TickIconGrey } from '../../../../components/SVG_Icons';
const DATEFORMAT = 'DD/MM/YYYY'
const APIDATEFORMAT = 'YYYY-MM-DD'

const Dashboard = ({ reFetch, onUpdate }) => {
    const history = useHistory()
    const [invoices, setInvoices] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(1)
    const [customerIds, setCustomerIds] = useState([])
    const [totalCount, setTotalCount] = useState(null)
    const [customerList, setCustomerList] = useState([])
    const [selectedRange, setSelectedRange] = useState([])
    const [startDate, setStartDate] = useState(TODAYDATE)
    const [generateDisabled, setGenerateDisabled] = useState(true)
    const [endDate, setEndDate] = useState(TODAYDATE)
    const [open, setOpen] = useState(false)

    const invoiceColumns = useMemo(() => getInvoiceColumns(), [])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getCustomerList()

        return () => {
            http.ABORT(source)
        }
    }, [])

    useEffect(async () => {
        setLoading(true)
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

    const getCustomerList = async () => {
        const url = `/customer/getCustomerNames`

        try {
            const data = await http.GET(axios, url, config)
            setCustomerList(data)
        } catch (error) { }
    }

    const generateInvoices = async () => {
        const url = '/invoice/generateMultipleInvoices'
        const body = { fromDate: startDate, toDate: endDate, customerIds }

        try {
            await http.POST(axios, url, body, config)
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

    const onFilterChange = (data) => {
        setPageNumber(1)
        setCustomerIds(data)
        setGenerateDisabled(false)
    }

    const handleFilter = () => {
        setGenerateDisabled(true)
        setLoading(true)
        generateInvoices()
    }

    const handleMenuSelect = (key, data) => {
        if (key === 'resend') {
        }
        else if (key === 'dcList') {
            history.push(`/invoices/delivery-challan/${data.invoiceId}`, data)
        }
        else handleStatusUpdate(data.invoiceId)
    }

    const handleViewInvoice = (invoice) => history.push('/invoices/manage', { invoice })

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
        setGenerateDisabled(false)
    }

    const optimisticUpdate = (id, status) => {
        let clone = deepClone(invoices);
        const index = clone.findIndex(item => item.invoiceId === id)
        clone[index].status = status;
        setInvoices(clone)
        onUpdate()
    }

    const handleStatusUpdate = async (invoiceId) => {
        const status = 'Paid'
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
            <Menu.Item key="resend" icon={<SendIconGrey />}>Resend</Menu.Item>,
            <Menu.Item key="dcList" icon={<ListViewIconGrey />}>DC List</Menu.Item>,
            <Menu.Item key="paid" icon={<TickIconGrey />}>Paid</Menu.Item>,
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
                    <RoutesFilter
                        data={customerList}
                        title='Select Customers'
                        keyValue='customerId'
                        keyLabel='customerName'
                        onChange={onFilterChange}
                    />
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
                            onClick={handleFilter}
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
