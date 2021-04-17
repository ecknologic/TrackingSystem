import axios from 'axios';
import dayjs from 'dayjs';
import { Menu, message, Table } from 'antd';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http'
import Actions from '../../../../components/Actions';
import Spinner from '../../../../components/Spinner';
import useUser from '../../../../utils/hooks/useUser';
import SearchInput from '../../../../components/SearchInput';
import { getInvoiceColumns } from '../../../../assets/fixtures';
import CustomPagination from '../../../../components/CustomPagination';
import { MARKETINGADMIN, MARKETINGMANAGER } from '../../../../utils/constants';
import { deepClone, getStatusColor, showToast } from '../../../../utils/Functions';
import { DocIconGrey, ListViewIconGrey, SendIconGrey, TickIconGrey } from '../../../../components/SVG_Icons';
const DATEFORMAT = 'DD/MM/YYYY'

const Invoice = ({ reFetch, accountId }) => {
    const { ROLE } = useUser()
    const history = useHistory()
    const [invoices, setInvoices] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(1)
    const [totalCount, setTotalCount] = useState(null)

    const isMarketingRole = useMemo(() => ROLE === MARKETINGADMIN || ROLE === MARKETINGMANAGER, [])
    const invoiceColumns = useMemo(() => getInvoiceColumns('single'), [])
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
        const url = `invoice/getCustomerInvoices/${accountId}`

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

    const handleMenuSelect = (key, data) => {
        if (key === 'resend') {
        }
        else if (key === 'dcList') {
            history.push(`/invoices/delivery-challan/${data.invoiceId}`, data)
        }
        else handleStatusUpdate(key, data.invoiceId)
    }

    const handleViewInvoice = (invoice, id) => history.push('/invoices/manage', { invoice, FOR: 'CUSTOMER', id })

    const optimisticUpdate = (id, status) => {
        let clone = deepClone(invoices);
        const index = clone.findIndex(item => item.invoiceId === id)
        clone[index].status = status;
        setInvoices(clone)
    }

    const handleStatusUpdate = async (action, invoiceId) => {
        const status = action === 'paid' ? 'Paid' : 'Pending'
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

    const dataSource = useMemo(() => invoices.map((invoice) => {
        const { invoiceId, createdDateTime, totalAmount, customerName, dueDate, status, customerId } = invoice

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
            status: renderStatus(status),
            dueDate: dayjs(dueDate).format(DATEFORMAT),
            date: dayjs(createdDateTime).format(DATEFORMAT),
            invoiceId: <span className='app-link' onClick={() => handleViewInvoice(invoice, customerId)}>{invoiceId}</span>,
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, invoice)} />
        }
    }), [invoices])

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
