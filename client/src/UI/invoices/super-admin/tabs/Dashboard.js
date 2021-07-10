import axios from 'axios';
import dayjs from 'dayjs';
import { Menu, message, Table } from 'antd';
import { useHistory } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PaymentForm from '../forms/Payment';
import { http } from '../../../../modules/http'
import Actions from '../../../../components/Actions';
import Spinner from '../../../../components/Spinner';
import useUser from '../../../../utils/hooks/useUser';
import DateValue from '../../../../components/DateValue';
import InputValue from '../../../../components/InputValue';
import InputLabel from '../../../../components/InputLabel';
import SearchInput from '../../../../components/SearchInput';
import CustomModal from '../../../../components/CustomModal';
import ConfirmModal from '../../../../components/CustomModal';
import CustomButton from '../../../../components/CustomButton';
import RoutesFilter from '../../../../components/RoutesFilter';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import CustomDateInput from '../../../../components/CustomDateInput';
import CustomPagination from '../../../../components/CustomPagination';
import CustomRangeInput from '../../../../components/CustomRangeInput';
import ActivityLogContent from '../../../../components/ActivityLogContent';
import { getDropdownOptions, getInvoiceColumns } from '../../../../assets/fixtures';
import { MARKETINGMANAGER, TODAYDATE, TRACKFORM } from '../../../../utils/constants';
import { validateIntFloat, validatePaymentValues } from '../../../../utils/validations';
import { ListViewIconGrey, ScheduleIcon, SendIconGrey, TickIconGrey } from '../../../../components/SVG_Icons';
import { computeTotalAmount, deepClone, disableFutureDates, doubleKeyComplexSearch, getStatusColor, isEmpty, resetTrackForm, showToast } from '../../../../utils/Functions';
const DATEFORMAT = 'DD/MM/YYYY'
const APIDATEFORMAT = 'YYYY-MM-DD'

const Dashboard = ({ reFetch, onUpdate }) => {
    const { ROLE } = useUser()
    const history = useHistory()
    const [invoices, setInvoices] = useState([])
    const [logs, setLogs] = useState([])
    const [logModal, setLogModal] = useState(false)
    const [invoicesClone, setInvoicesClone] = useState([])
    const [filteredClone, setFilteredClone] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(1)
    const [customerIds, setCustomerIds] = useState([])
    const [totalCount, setTotalCount] = useState(null)
    const [customerList, setCustomerList] = useState([])
    const [paymentList, setPaymentList] = useState([])
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [payModal, setPayModal] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [creatorList, setCreatorList] = useState([])
    const [selectedRange, setSelectedRange] = useState([])
    const [startDate, setStartDate] = useState(TODAYDATE)
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const [generateDisabled, setGenerateDisabled] = useState(true)
    const [endDate, setEndDate] = useState(TODAYDATE)
    const [resetSearch, setResetSearch] = useState(false)
    const [filterON, setFilterON] = useState(false)
    const [shake, setShake] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [open, setOpen] = useState(false)

    const paymentOptions = useMemo(() => getDropdownOptions(paymentList), [paymentList])
    const isSMManager = useMemo(() => ROLE === MARKETINGMANAGER, [ROLE])
    const invoiceColumns = useMemo(() => getInvoiceColumns(), [])
    const totalAmount = useMemo(() => computeTotalAmount(invoices, 'pendingAmount'), [invoices, payModal])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getCustomerList()
        getPaymentList()
        isSMManager && getCreatorList()

        return () => {
            http.ABORT(source)
        }
    }, [])

    useEffect(async () => {
        setLoading(true)
        getInvoices()
    }, [reFetch])

    const getInvoices = async () => {
        let url = 'invoice/getInvoices/Pending'

        if (isSMManager) {
            url = 'invoice/getInvoicesByRole/5' // 5 is Sales and Marketing Admin Role
        }

        try {
            const data = await http.GET(axios, url, config)
            setInvoices(data)
            setInvoicesClone(data)
            setTotalCount(data.length)
            setLoading(false)
        } catch (error) { }
    }

    const getCustomerList = async () => {
        const url = `customer/getCustomerNames`

        try {
            const data = await http.GET(axios, url, config)
            setCustomerList(data)
        } catch (error) { }
    }

    const getCreatorList = async () => {
        const url = 'users/getUsersByRole/SalesAndMarketing'

        try {
            const data = await http.GET(axios, url, config)
            setCreatorList(data)
        } catch (error) { }
    }

    const getPaymentList = async () => {
        const url = `bibo/getList/paymentMode`

        try {
            const data = await http.GET(axios, url, config)
            setPaymentList(data)
        } catch (error) { }
    }

    const getLogs = async (id) => {
        const url = `logs/getInvoiceLogs?type=customer&id=${id}`

        try {
            showToast({ v1Ing: 'Fetching', action: 'loading' })
            const data = await http.GET(axios, url, config)
            showToast({ v2: 'fetched' })
            setLogs(data)
        } catch (error) { }
    }

    const generateInvoices = async () => {
        const url = 'invoice/generateMultipleInvoices'
        const body = { fromDate: startDate, toDate: endDate, customerIds }
        const options = { item: 'Invoices', v1Ing: 'Generating', v2: 'generated' }

        try {
            showToast({ ...options, action: 'loading' })
            await http.POST(axios, url, body, config)
            await getInvoices()
            showToast(options)
            searchON && setResetSearch(!resetSearch)
        } catch (error) {
            message.destroy()
            setLoading(false)
            if (error.response.status === 400) {
                message.info('Oops! Already generated or DCs do not exist for the selection.')
            }
        }
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
        if (key === 'amountPaid') {
            const error = validateIntFloat(value)
            setFormErrors(errors => ({ ...errors, amountPaid: error }))
        }
    }

    const handleBlur = (value, key) => {

        // Validations
        if (key === 'amountPaid') {
            const error = validateIntFloat(value, true)
            setFormErrors(errors => ({ ...errors, amountPaid: error }))
        }
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

        if (isSMManager) {
            if (isEmpty(data)) {
                setInvoices(invoicesClone)
                setTotalCount(invoicesClone.length)
                setFilterON(false)
            }
            else generateFiltered(invoicesClone, data)
        }
        else {
            setCustomerIds(data)
            setGenerateDisabled(false)
        }
    }

    const generateFiltered = (original, filterInfo) => {
        const filtered = original.filter((item) => filterInfo.includes(item.salesPerson))
        setInvoices(filtered)
        setFilteredClone(filtered)
        setTotalCount(filtered.length)
        setFilterON(true)
        searchON && setResetSearch(!resetSearch)
    }

    const handleFilter = () => {
        setGenerateDisabled(true)
        setLoading(true)
        generateInvoices()
    }

    const handleMenuSelect = async (key, data) => {
        const { noOfPayments, pendingAmount: amountPaid } = data
        if (key === 'resend') {
        }
        else if (key === 'dcList') {
            history.push(`/invoices/dc-list/${data.invoiceId}`, data)
        }
        else if (key === 'paid') {
            setFormData({ ...data, noOfPayments: noOfPayments + 1, amountPaid })
            setPayModal(true)
        }
        else if (key === 'logs') {
            await getLogs(data.invoiceId)
            setLogModal(true)
        }
    }

    const handleViewInvoice = (invoice) => history.push('/invoices/manage', { invoice, FOR: ROLE })

    const datePickerStatus = (status) => {
        !status && setOpen(false)
    }

    const handleDateSelect = (selected) => {
        setPageNumber(1)

        if (isSMManager) {
            setOpen(false)
            setSelectedDate(dayjs(selected).format(APIDATEFORMAT))
            const filtered = invoicesClone.filter(item => dayjs(selected).format(DATEFORMAT) == dayjs(item.invoiceDate).format(DATEFORMAT))
            setInvoices(filtered)
            setFilteredClone(filtered)
            setTotalCount(filtered.length)
            setFilterON(true)
            searchON && setResetSearch(!resetSearch)
        }
        else {
            const [from, to] = selected
            setStartDate(from.format(APIDATEFORMAT))
            setEndDate(to.format(APIDATEFORMAT))
            setOpen(false)
            setSelectedRange(selected)
            setGenerateDisabled(false)
            setTimeout(() => setSelectedRange([]), 820)
            setGenerateDisabled(false)
        }
    }

    const optimisticUpdate = (data) => {
        const { pendingAmount } = data

        if (pendingAmount === 0) {
            const filtered = invoices.filter(item => item.invoiceId !== data.invoiceId)
            setInvoices(filtered)
            return
        }

        let clone = deepClone(invoices);
        const index = clone.findIndex(item => item.invoiceId === data.invoiceId)
        clone[index] = data;
        setInvoices(clone)
    }

    const handlePayment = async () => {
        const formErrors = validatePaymentValues(formData)

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        const { pendingAmount, amountPaid } = formData
        const options = { item: 'Invoice payment', v1Ing: 'Updating', v2: 'updated' }
        const url = `invoice/addInvoicePayment`
        const body = { ...formData, pendingAmount: pendingAmount - amountPaid }
        try {
            showToast({ ...options, action: 'loading' })
            const [data] = await http.POST(axios, url, body, config)
            optimisticUpdate(data)
            showToast(options)
            onModalClose(true)
            onUpdate()
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
        const data = (filterON && isSMManager) ? filteredClone : invoicesClone
        const result = doubleKeyComplexSearch(data, value, 'invoiceId', 'customerName')
        setTotalCount(result.length)
        setInvoices(result)
        setSeachON(true)
    }

    const onModalClose = (hasSaved) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasSaved) {
            return setConfirmModal(true)
        }
        setPayModal(false)
        setFormData({})
        setFormErrors({})
    }

    const dataSource = useMemo(() => invoices.map((invoice) => {
        const { invoiceId, invoiceDate, totalAmount, customerName, dueDate, status, billingAddress, pendingAmount } = invoice

        const options = [
            <Menu.Item key="resend" icon={<SendIconGrey />}>Resend</Menu.Item>,
            <Menu.Item key="dcList" icon={<ListViewIconGrey />}>DC List</Menu.Item>,
            <Menu.Item key="paid" className={status === 'Paid' ? 'disabled' : ''} icon={<TickIconGrey />}>Paid</Menu.Item>,
            <Menu.Item key="logs" icon={<ListViewIconGrey />}>Acvitity Logs</Menu.Item>
        ]

        return {
            key: invoiceId,
            customerName,
            totalAmount,
            billingAddress,
            pendingAmount,
            status: renderStatus(status),
            dueDate: dayjs(dueDate).format(DATEFORMAT),
            date: dayjs(invoiceDate).format(DATEFORMAT),
            invoiceId: <span className='app-link' onClick={() => handleViewInvoice(invoice)}>{invoiceId}</span>,
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, invoice)} />
        }
    }), [invoices])

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false);
        resetTrackForm()
        onModalClose()
    }, [])

    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])
    const handleModalCancel = useCallback(() => onModalClose(), [])
    const handleLogModalCancel = useCallback(() => setLogModal(false), [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <div className='stock-delivery-container'>
            <div className='header'>
                {
                    isSMManager ?
                        (
                            <div className='left'>
                                <RoutesFilter
                                    data={creatorList}
                                    title='Select Creators'
                                    keyValue='userId'
                                    keyLabel='userName'
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
                        ) : (
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
                                        className='app-date-panel-picker'
                                        onChange={handleDateSelect}
                                        disabledDate={disableFutureDates}
                                        onOpenChange={datePickerStatus}
                                    />
                                </div>
                            </div>
                        )
                }
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
            <CustomModal
                hideCancel
                okTxt='Add'
                visible={payModal}
                title='Payment'
                onOk={handlePayment}
                onCancel={handleModalCancel}
                className={`app-form-modal ${shake && 'app-shake'}`}
            >
                <PaymentForm
                    data={formData}
                    errors={formErrors}
                    paymentOptions={paymentOptions}
                    onBlur={handleBlur}
                    onChange={handleChange}
                />
            </CustomModal>
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
            <ConfirmModal
                visible={confirmModal}
                onOk={handleConfirmModalOk}
                onCancel={handleConfirmModalCancel}
                title='Are you sure you want to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </ConfirmModal>
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
