import axios from 'axios';
import dayjs from 'dayjs';
import { Menu, message, Table } from 'antd';
import { useHistory } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http'
import Actions from '../../../../components/Actions';
import Spinner from '../../../../components/Spinner';
import useUser from '../../../../utils/hooks/useUser';
import SearchInput from '../../../../components/SearchInput';
import CustomModal from '../../../../components/CustomModal';
import ConfirmModal from '../../../../components/CustomModal';
import { validateIntFloat } from '../../../../utils/validations';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import PaymentForm from '../../../invoices/super-admin/forms/Payment';
import CustomPagination from '../../../../components/CustomPagination';
import { getDropdownOptions, getInvoiceColumns } from '../../../../assets/fixtures';
import { MARKETINGADMIN, MARKETINGMANAGER, TRACKFORM } from '../../../../utils/constants';
import { deepClone, getStatusColor, showToast, resetTrackForm } from '../../../../utils/Functions';
import { DocIconGrey, ListViewIconGrey, SendIconGrey, TickIconGrey } from '../../../../components/SVG_Icons';
const DATEFORMAT = 'DD/MM/YYYY'

const Invoice = ({ accountId }) => {
    const { ROLE } = useUser()
    const history = useHistory()
    const [invoices, setInvoices] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(1)
    const [totalCount, setTotalCount] = useState(null)
    const [paymentList, setPaymentList] = useState([])
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [payModal, setPayModal] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)

    const paymentOptions = useMemo(() => getDropdownOptions(paymentList), [paymentList])
    const isMarketingRole = useMemo(() => ROLE === MARKETINGADMIN || ROLE === MARKETINGMANAGER, [ROLE])
    const invoiceColumns = useMemo(() => getInvoiceColumns('single'), [])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getInvoices()
        getPaymentList()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getInvoices = async () => {
        const url = `invoice/getCustomerInvoices/${accountId}`

        try {
            const data = await http.GET(axios, url, config)
            setInvoices(data)
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
            history.push(`/invoices/dc-list/${data.invoiceId}`, data)
        }
        else if (key === 'paid') {
            setFormData({ ...data, noOfPayments: noOfPayments + 1, amountPaid })
            setPayModal(true)
        }
    }

    const handleViewInvoice = (invoice, id) => history.push('/invoices/manage', { invoice, FOR: 'CUSTOMER', id })

    const optimisticUpdate = (id, status) => {
        let clone = deepClone(invoices);
        const index = clone.findIndex(item => item.invoiceId === id)
        clone[index].status = status;
        setInvoices(clone)
    }

    const handlePayment = async () => {
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
        const { invoiceId, createdDateTime, totalAmount, customerName, dueDate, status, pendingAmount, customerId } = invoice

        const options = [
            <Menu.Item key="resend" icon={<SendIconGrey />}>Resend</Menu.Item>,
            <Menu.Item key="dcList" icon={<ListViewIconGrey />}>DC List</Menu.Item>,
            <Menu.Item key="paid" className={status === 'Paid' || isMarketingRole ? 'disabled' : ''} icon={<TickIconGrey />}>Paid</Menu.Item>,
            <Menu.Item key="due" className={status === 'Pending' ? 'disabled' : ''} icon={<DocIconGrey />}>Due</Menu.Item>
        ]

        return {
            key: invoiceId,
            customerName,
            totalAmount,
            pendingAmount,
            status: renderStatus(status),
            dueDate: dayjs(dueDate).format(DATEFORMAT),
            date: dayjs(createdDateTime).format(DATEFORMAT),
            invoiceId: <span className='app-link' onClick={() => handleViewInvoice(invoice, customerId)}>{invoiceId}</span>,
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
                <div className='left'></div>
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
            <CustomModal
                hideCancel
                okTxt='Add'
                visible={payModal}
                title='Payment'
                onOk={handlePayment}
                onCancel={handleModalCancel}
                className='app-form-modal'
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
export default Invoice
