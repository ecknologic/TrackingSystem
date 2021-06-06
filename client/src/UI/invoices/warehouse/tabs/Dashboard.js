import axios from 'axios';
import dayjs from 'dayjs';
import { Menu, message, Table } from 'antd';
import { useHistory } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http'
import Actions from '../../../../components/Actions';
import Spinner from '../../../../components/Spinner';
import DateValue from '../../../../components/DateValue';
import PaymentForm from '../../super-admin/forms/Payment';
import InputLabel from '../../../../components/InputLabel';
import InputValue from '../../../../components/InputValue';
import SearchInput from '../../../../components/SearchInput';
import CustomModal from '../../../../components/CustomModal';
import ConfirmModal from '../../../../components/CustomModal';
import { validateIntFloat, validatePaymentValues } from '../../../../utils/validations';
import { TODAYDATE, TRACKFORM } from '../../../../utils/constants';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import CustomDateInput from '../../../../components/CustomDateInput';
import CustomPagination from '../../../../components/CustomPagination';
import { getDropdownOptions, getInvoiceColumns } from '../../../../assets/fixtures';
import { computeTotalAmount, deepClone, disableFutureDates, doubleKeyComplexSearch, getStatusColor, showToast, resetTrackForm, isEmpty } from '../../../../utils/Functions';
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
    const [paymentList, setPaymentList] = useState([])
    const [resetSearch, setResetSearch] = useState(false)
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [payModal, setPayModal] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [shake, setShake] = useState(false)
    const [filterON, setFilterON] = useState(false)
    const [open, setOpen] = useState(false)

    const paymentOptions = useMemo(() => getDropdownOptions(paymentList), [paymentList])
    const totalAmount = useMemo(() => computeTotalAmount(invoices), [invoices])
    const invoiceColumns = useMemo(() => getInvoiceColumns('dcNo'), [])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getPaymentList()

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

    const getPaymentList = async () => {
        const url = `bibo/getList/paymentMode`

        try {
            const data = await http.GET(axios, url, config)
            setPaymentList(data)
        } catch (error) { }
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

    const handleMenuSelect = (key, data) => {
        const { noOfPayments, pendingAmount: amountPaid } = data
        if (key === 'resend') {
        }
        else if (key === 'dcList') {
            history.push(`/manage-invoices/dc-list/${data.invoiceId}`, data)
        }
        else if (key === 'paid') {
            setFormData({ ...data, noOfPayments: noOfPayments + 1, amountPaid })
            setPayModal(true)
        }
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

    const optimisticUpdate = (data) => {
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
        const { invoiceId, invoiceDate, totalAmount, customerName, dueDate, departmentStatus, dcNo, pendingAmount, billingAddress } = invoice

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
            billingAddress,
            pendingAmount,
            status: renderStatus(departmentStatus),
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
