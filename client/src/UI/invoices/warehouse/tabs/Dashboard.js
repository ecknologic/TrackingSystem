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
import InputLabel from '../../../../components/InputLabel';
import InputValue from '../../../../components/InputValue';
import SearchInput from '../../../../components/SearchInput';
import { getInvoiceColumns } from '../../../../assets/fixtures';
import CustomDateInput from '../../../../components/CustomDateInput';
import CustomPagination from '../../../../components/CustomPagination';
import { computeTotalAmount, deepClone, disableFutureDates, doubleKeyComplexSearch, getStatusColor, showToast } from '../../../../utils/Functions';
import { ListViewIconGrey, ScheduleIcon, SendIconGrey, TickIconGrey } from '../../../../components/SVG_Icons';
const DATEFORMAT = 'DD/MM/YYYY'
const APIDATEFORMAT = 'YYYY-MM-DD'

const Dashboard = ({ reFetch }) => {
    const history = useHistory()
    const [invoices, setInvoices] = useState([])
    const [invoicesClone, setInvoicesClone] = useState([])
    const [filteredClone, setFilteredClone] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(1)
    const [totalCount, setTotalCount] = useState(null)
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const [resetSearch, setResetSearch] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [filterON, setFilterON] = useState(false)
    const [open, setOpen] = useState(false)

    const totalAmount = useMemo(() => computeTotalAmount(invoices), [invoices])
    const invoiceColumns = useMemo(() => getInvoiceColumns('dcNo'), [])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {

        return () => {
            http.ABORT(source)
        }
    }, [])

    useEffect(async () => {
        setLoading(true)
        getInvoices()
    }, [reFetch])

    const getInvoices = async () => {
        const url = 'invoice/getDepartmentInvoices'

        try {
            const data = await http.GET(axios, url, config)
            setInvoices(data)
            setInvoicesClone(data)
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

    const handleMenuSelect = (key, data) => {
        if (key === 'resend') {
        }
        else if (key === 'dcList') {
            history.push(`/manage-invoices/dc-list/${data.invoiceId}`, data)
        }
        else handleStatusUpdate(data.invoiceId)
    }

    const handleViewInvoice = (invoice) => history.push('/manage-invoices/manage', { invoice })

    const datePickerStatus = (status) => {
        !status && setOpen(false)
    }

    const handleDateSelect = (value) => {
        setOpen(false)
        setSelectedDate(dayjs(value).format(APIDATEFORMAT))
        const filtered = invoicesClone.filter(item => dayjs(value).format(DATEFORMAT) == dayjs(item.invoiceDate).format(DATEFORMAT))
        setInvoices(filtered)
        setFilteredClone(filtered)
        setTotalCount(filtered.length)
        setPageNumber(1)
        setFilterON(true)
        searchON && setResetSearch(!resetSearch)
    }

    const optimisticUpdate = (id, status) => {
        let clone = deepClone(invoices);
        const index = clone.findIndex(item => item.invoiceId === id)
        clone[index].departmentStatus = status;
        setInvoices(clone)
    }

    const handleStatusUpdate = async (invoiceId) => {
        const departmentStatus = 'Paid'
        const options = { item: 'Invoice status', v1Ing: 'Updating', v2: 'updated' }
        const url = `invoice/updateDepartmentInvoiceStatus`
        const body = { departmentStatus, invoiceId, status: 'Inprogress' }
        try {
            showToast({ ...options, action: 'loading' })
            await http.PUT(axios, url, body, config)
            optimisticUpdate(invoiceId, departmentStatus)
            showToast(options)
        } catch (error) {
            message.destroy()
        }
    }

    const handleSearch = (value) => {
        setPageNumber(1)
        if (value === "") {
            setTotalCount(invoicesClone.length)
            setInvoices(invoicesClone)
            setSeachON(false)
            return
        }
        const data = filterON ? filteredClone : invoicesClone
        const result = doubleKeyComplexSearch(data, value, 'invoiceId', 'customerName')
        setTotalCount(result.length)
        setInvoices(result)
        setSeachON(true)
    }

    const dataSource = useMemo(() => invoices.map((invoice) => {
        const { invoiceId, invoiceDate, totalAmount, customerName, dueDate, departmentStatus, dcNo } = invoice

        const options = [
            <Menu.Item key="resend" icon={<SendIconGrey />}>Resend</Menu.Item>,
            <Menu.Item key="dcList" icon={<ListViewIconGrey />}>DC List</Menu.Item>,
            <Menu.Item key="paid" className={departmentStatus === 'Paid' ? 'disabled' : ''} icon={<TickIconGrey />}>Paid</Menu.Item>,
        ]

        return {
            key: invoiceId,
            dcNo,
            customerName,
            totalAmount,
            status: renderStatus(departmentStatus),
            dueDate: dayjs(dueDate).format(DATEFORMAT),
            date: dayjs(invoiceDate).format(DATEFORMAT),
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
                            className='app-date-panel-picker'
                            onChange={handleDateSelect}
                            onOpenChange={datePickerStatus}
                            disabledDate={disableFutureDates}
                        />
                    </div>
                </div>
                <div className='right'>
                    <div className='field'>
                        <InputLabel name='Total Amount' />
                        <InputValue size='larger' value={totalAmount} />
                    </div>
                    <SearchInput
                        placeholder='Search Invoice'
                        className='delivery-search'
                        reset={resetSearch}
                        width='40%'
                        onChange={handleSearch}
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
