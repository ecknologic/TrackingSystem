import axios from 'axios';
import dayjs from 'dayjs';
import { Menu, message, Table } from 'antd';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { http } from '../../../../modules/http'
import Actions from '../../../../components/Actions';
import Spinner from '../../../../components/Spinner';
import useUser from '../../../../utils/hooks/useUser';
import DateValue from '../../../../components/DateValue';
import { paymentColumns } from '../../../../assets/fixtures';
import SearchInput from '../../../../components/SearchInput';
import CustomModal from '../../../../components/CustomModal';
import CustomDateInput from '../../../../components/CustomDateInput';
import CustomPagination from '../../../../components/CustomPagination';
import { TODAYDATE, WAREHOUSEADMIN } from '../../../../utils/constants';
import ActivityLogContent from '../../../../components/ActivityLogContent';
import { ListViewIconGrey, ScheduleIcon, SendIconGrey } from '../../../../components/SVG_Icons';
import { deepClone, doubleKeyComplexSearch, getStatusColor, showToast } from '../../../../utils/Functions';
const DATEFORMAT = 'DD/MM/YYYY'
const APIDATEFORMAT = 'YYYY-MM-DD'

const Payments = ({ reFetch, onUpdate }) => {
    const history = useHistory()
    const { ROLE } = useUser()
    const [invoices, setInvoices] = useState([])
    const [invoicesClone, setInvoicesClone] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [logs, setLogs] = useState([])
    const [logModal, setLogModal] = useState(false)
    const [pageNumber, setPageNumber] = useState(1)
    const [filteredClone, setFilteredClone] = useState([])
    const [totalCount, setTotalCount] = useState(null)
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const [open, setOpen] = useState(false)
    const [resetSearch, setResetSearch] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [filterON, setFilterON] = useState(false)

    const isWHAdmin = useMemo(() => ROLE === WAREHOUSEADMIN, [ROLE])
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
        let url = 'invoice/getInvoicePayments'
        if (isWHAdmin) url = 'invoice/getDepartmentInvoicePayments'

        try {
            const data = await http.GET(axios, url, config)
            setInvoices(data)
            setTotalCount(data.length)
            setInvoicesClone(data)
            setLoading(false)
        } catch (error) { }
    }

    const getLogs = async (id) => {
        const url = `logs/getDepartmentLogs?type=order&id=${id}` // TODO : update API Url

        try {
            showToast({ v1Ing: 'Fetching', action: 'loading' })
            const data = await http.GET(axios, url, config)
            showToast({ v2: 'fetched' })
            setLogs(data)
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

    const handleViewInvoice = (invoice) => {
        let url = '/invoices/manage'
        if (isWHAdmin) url = '/manage-invoices/manage'
        history.push(url, { invoice, FOR: ROLE })
    }

    const handleDateSelect = (value) => {
        setOpen(false)
        setSelectedDate(dayjs(value).format(APIDATEFORMAT))
        const filtered = invoices.filter(item => dayjs(value).format(DATEFORMAT) === dayjs(item.invoiceDate).format(DATEFORMAT))
        setInvoices(filtered)
        setFilteredClone(filtered)
        setTotalCount(filtered.length)
        setPageNumber(1)
        setFilterON(true)
        searchON && setResetSearch(!resetSearch)
    }

    const handleMenuSelect = async (key, data) => {
        if (key === 'resend') {
        }
        else if (key === 'dcList') {
            history.push(`/invoices/dc-list/${data.invoiceId}`, data)
        }
        else if (key === 'logs') {
            await getLogs(data.invoiceId)
            setLogModal(true)
        }
        else handleStatusUpdate(data.invoiceId)
    }

    const handleStatusUpdate = async (invoiceId) => {
        const status = 'Pending'
        const options = { item: 'Invoice status', v1Ing: 'Updating', v2: 'updated' }
        const url = `invoice/updateInvoiceStatus`
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
        const { invoiceId, paymentId, invoiceDate, amountPaid, customerName, dueDate, paymentMode, billingAddress } = invoice

        const options = [
            <Menu.Item key="resend" icon={<SendIconGrey />}>Resend</Menu.Item>,
            <Menu.Item key="dcList" icon={<ListViewIconGrey />}>DC List</Menu.Item>,
            <Menu.Item key="logs" icon={<ListViewIconGrey />}>Acvitity Logs</Menu.Item>,
        ]

        return {
            key: paymentId,
            customerName,
            billingAddress,
            paymentMode,
            totalAmount: amountPaid,
            dueDate: dayjs(dueDate).format(DATEFORMAT),
            date: dayjs(invoiceDate).format(DATEFORMAT),
            status: renderStatus('Paid'),
            invoiceId: <span className='app-link' onClick={() => handleViewInvoice(invoice)}>{invoiceId}</span>,
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, invoice)} />
        }
    }), [invoices])

    const handleLogModalCancel = useCallback(() => setLogModal(false), [])

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
                        />
                    </div>
                </div>
                <div className='right'>
                    <SearchInput
                        placeholder='Search Invoice'
                        className='delivery-search'
                        reset={resetSearch}
                        onChange={handleSearch}
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
            <CustomModal
                className='app-form-modal'
                visible={logModal}
                onOk={handleLogModalCancel}
                onCancel={handleLogModalCancel}
                title='Activity Log Details'
                okTxt='Close'
                hideCancel
            >
                <ActivityLogContent data={logs} />
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
export default Payments
