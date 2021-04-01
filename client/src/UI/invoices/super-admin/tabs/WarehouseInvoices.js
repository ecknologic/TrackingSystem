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
import { deepClone, disableFutureDates, doubleKeyComplexSearch, getStatusColor, isEmpty, showToast } from '../../../../utils/Functions';
import { ListViewIconGrey, ScheduleIcon, SendIconGrey, TickIconGrey } from '../../../../components/SVG_Icons';
import CustomDateInput from '../../../../components/CustomDateInput';
import InputLabel from '../../../../components/InputLabel';
import InputValue from '../../../../components/InputValue';
const DATEFORMAT = 'DD/MM/YYYY'
const APIDATEFORMAT = 'YYYY-MM-DD'

const WarehouseInvoices = ({ reFetch, onUpdate }) => {
    const history = useHistory()
    const [invoices, setInvoices] = useState([])
    const [invoicesClone, setInvoicesClone] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(1)
    const [totalCount, setTotalCount] = useState(null)
    const [warehouseList, setWarehouseList] = useState([])
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const [filteredClone, setFilteredClone] = useState([])
    const [filterON, setFilterON] = useState(false)
    const [resetSearch, setResetSearch] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [open, setOpen] = useState(false)

    const invoiceColumns = useMemo(() => getInvoiceColumns('warehouse'), [])
    const totalAmount = useMemo(() => computeTotalAmount(invoices), [invoices])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getWarehouseList()

        return () => {
            http.ABORT(source)
        }
    }, [])

    useEffect(async () => {
        setLoading(true)
        getInvoices()
    }, [reFetch])

    const getInvoices = async () => {
        const url = '/invoice/getDepartmentInvoices'

        try {
            const data = await http.GET(axios, url, config)
            setInvoices(data)
            setInvoicesClone(data)
            setTotalCount(data.length)
            setLoading(false)
        } catch (error) { }
    }

    const getWarehouseList = async () => {
        const url = '/bibo/getDepartmentsList?departmentType=warehouse'

        try {
            const data = await http.GET(axios, url, config)
            setWarehouseList(data)
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
        if (isEmpty(data)) {
            setInvoices(invoicesClone)
            setTotalCount(invoicesClone.length)
            setFilterON(false)
        }
        else generateFiltered(invoicesClone, data)
    }

    const generateFiltered = (original, filterInfo) => {
        const filtered = original.filter((item) => filterInfo.includes(item.departmentId))
        setInvoices(filtered)
        setFilteredClone(filtered)
        setTotalCount(filtered.length)
        setFilterON(true)
        searchON && setResetSearch(!resetSearch)
    }

    const handleMenuSelect = (key, data) => {
        if (key === 'resend') {
        }
        else if (key === 'dcList') {
            history.push(`/invoices/dc-list/${data.invoiceId}`, data)
        }
        else handleStatusUpdate(data.invoiceId)
    }

    const handleViewInvoice = (invoice) => history.push('/invoices/manage', { invoice })

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
        const { invoiceId, invoiceDate, totalAmount, customerName, departmentName, dueDate, status } = invoice

        const options = [
            <Menu.Item key="resend" icon={<SendIconGrey />}>Resend</Menu.Item>,
            <Menu.Item key="dcList" icon={<ListViewIconGrey />}>DC List</Menu.Item>,
            <Menu.Item key="paid" icon={<TickIconGrey />}>Paid</Menu.Item>,
        ]

        return {
            key: invoiceId,
            customerName,
            totalAmount,
            departmentName,
            status: renderStatus(status),
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
                    <RoutesFilter
                        data={warehouseList}
                        title='Select Warehouse'
                        keyValue='departmentId'
                        keyLabel='departmentName'
                        onChange={onFilterChange}
                    />
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
                        width='40%'
                        reset={resetSearch}
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

const computeTotalAmount = (data) => {
    let totalAmount = 0
    if (!isEmpty(data)) {
        totalAmount = data.filter(item => item.status === 'Pending')
            .map(item => item.totalAmount)
            .reduce((a, c) => a + c).toLocaleString('en-IN')
    }

    return `₹ ${totalAmount}`

}
export default WarehouseInvoices
