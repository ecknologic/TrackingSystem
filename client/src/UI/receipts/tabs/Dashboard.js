import axios from 'axios';
import { Menu, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReceiptView from '../views/Receipt';
import { http } from '../../../modules/http';
import Actions from '../../../components/Actions';
import Spinner from '../../../components/Spinner';
import CustomModal from '../../../components/CustomModal';
import CustomPagination from '../../../components/CustomPagination';
import { receiptColumns } from '../../../assets/fixtures';
import { EyeIconGrey } from '../../../components/SVG_Icons';
import dayjs from 'dayjs';
const DATEFORMAT = 'DD/MM/YYYY'

const Dashboard = ({ reFetch }) => {
    const [receipts, setReceipts] = useState([])
    const [viewData, setViewData] = useState({})
    const [formTitle, setFormTitle] = useState('')
    const [loading, setLoading] = useState(true)
    const [totalCount, setTotalCount] = useState(null)
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1)
    const [viewModal, setViewModal] = useState(false)

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        return () => {
            http.ABORT(source)
        }
    }, [])

    useEffect(() => {
        getReceipts()
    }, [reFetch])

    const getReceipts = async (pageNumber = 1, _pageSize = pageSize) => {
        const offset = (pageNumber - 1) * _pageSize
        const url = `customer/getCustomerReceipts?offset=${offset}&limit=${_pageSize}`

        try {
            setLoading(true)
            const data = await http.GET(axios, url, config)
            setReceipts(data)
            setLoading(false)
            setTotalCount(12) // static
        } catch (error) { }
    }

    const handlePageChange = (number, size) => {
        setPageSize(size)
        setPageNumber(number)
        getReceipts(number, size)
    }

    const handleMenuSelect = (key, data) => {
        if (key === 'view') {
            setViewData(data)
            setFormTitle(`Receipt Details - ${data.receiptNumber}`)
            setViewModal(true)
        }
    }

    const dataSource = useMemo(() => receipts.map((receipt) => {
        const { receiptId: key, receiptNumber, customerId, customerName, depositAmount, noOfCans, paymentMode, createdDateTime } = receipt

        return {
            key,
            receiptNumber,
            customerId,
            customerName,
            depositAmount,
            noOfCans,
            paymentMode,
            receiptDate: dayjs(createdDateTime).format(DATEFORMAT),
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, receipt)} />
        }
    }), [receipts])

    const handleModalCancel = useCallback(() => setViewModal(false), [])

    return (
        <div className='product-container employee-manager-content'>
            <div className='app-table dispatch-table'>
                <Table
                    loading={{ spinning: loading, indicator: <Spinner /> }}
                    dataSource={dataSource}
                    columns={receiptColumns}
                    pagination={false}
                    scroll={{ x: true }}
                />
            </div>
            <CustomPagination
                total={totalCount}
                pageSize={pageSize}
                current={pageNumber}
                onChange={handlePageChange}
                pageSizeOptions={['10', '20', '30', '40', '50']}
            />
            <CustomModal
                hideCancel
                okTxt='Close'
                visible={viewModal}
                title={formTitle}
                onOk={handleModalCancel}
                onCancel={handleModalCancel}
                className='app-form-modal app-view-modal'
            >
                <ReceiptView
                    data={viewData}
                />
            </CustomModal>
        </div>
    )
}

const options = [<Menu.Item key="view" icon={<EyeIconGrey />}>View</Menu.Item>]
export default Dashboard
