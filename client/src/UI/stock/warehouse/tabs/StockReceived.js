import axios from 'axios';
import { Menu, message, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import Actions from '../../../../components/Actions';
import ArrivedStockView from '../forms/ArrivedStock';
import SearchInput from '../../../../components/SearchInput';
import CustomModal from '../../../../components/CustomModal';
import { EyeIconGrey } from '../../../../components/SVG_Icons';
import { receivedStockColumns } from '../../../../assets/fixtures';
import CustomPagination from '../../../../components/CustomPagination';
import { getStatusColor, showToast } from '../../../../utils/Functions';

const StockReceived = () => {
    const [loading, setLoading] = useState(true)
    const [stock, setStock] = useState([])
    const [viewData, setViewData] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [viewModal, setViewModal] = useState(false)

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getReceivedStock()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getReceivedStock = async () => {
        const url = '/warehouse/getReceivedStock'

        try {
            const data = await http.GET(axios, url, config)
            setLoading(false)
            setTotalCount(data.length)
            setStock(data)
        } catch (error) { }
    }

    const getStockById = async (id) => {
        const url = `/warehouse/getReceivedStockById/${id}`

        try {
            showToast({ v1Ing: 'Fetching', action: 'loading' })
            const [data] = await http.GET(axios, url, config)
            message.destroy()
            setViewData(data)
            setViewModal(true)
        } catch (error) { }
    }

    const handleMenuSelect = (key, id) => {
        if (key === 'view') {
            getStockById(id)
        }
    }

    const handlePageChange = (number) => {
        setPageNumber(number)
    }

    const handleSizeChange = (number, size) => {
        setPageSize(size)
        setPageNumber(number)
    }

    const dataSource = useMemo(() => stock.map((order) => {
        const { id, dcNo, departmentName, driverName, mobileNumber, product20L, product1L,
            product2L, product300ML, product500ML, isConfirmed } = order
        return {
            key: id,
            dcNo,
            departmentName,
            driverName,
            mobileNumber,
            status: renderStatus(isConfirmed),
            stockDetails: renderStockDetails({ product20L, product1L, product2L, product300ML, product500ML }),
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, id)} />
        }
    }), [stock])

    const handleModalCancel = useCallback(() => setViewModal(false), [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <div className='stock-delivery-container'>
            <div className='header'>
                <div></div>
                <div className='right'>
                    <SearchInput
                        placeholder='Search Delivery Challan'
                        className='delivery-search'
                        width='50%'
                    />
                </div>
            </div>
            <div className='app-table delivery-table'>
                <Table
                    loading={{ spinning: loading, indicator: <Spinner /> }}
                    dataSource={dataSource.slice(sliceFrom, sliceTo)}
                    columns={receivedStockColumns}
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
                className={`app-form-modal app-view-modal stock-details-modal`}
                visible={viewModal}
                onOk={handleModalCancel}
                onCancel={handleModalCancel}
                title='Received Stock Details'
                okTxt='Close'
                hideCancel
            >
                <ArrivedStockView viewOnly data={viewData} />
            </CustomModal>
        </div>
    )
}
const renderStatus = (status) => {
    const text = status ? 'Confirmed' : 'Pending'
    const color = getStatusColor(text)
    return (
        <div className='status'>
            <span className='app-dot' style={{ background: color }}></span>
            <span className='status-text'>{text}</span>
        </div>
    )
}
const renderStockDetails = ({ product20L, product1L, product2L, product500ML, product300ML }) => {
    return `
    20 ltrs - ${product20L}, 2 ltrs - ${product2L} boxes, 1 ltr - ${product1L} boxes,
    500 ml - ${product500ML} boxes, 300 ml - ${product300ML} boxes
    `
}
const options = [<Menu.Item key="view" icon={<EyeIconGrey />}>View</Menu.Item>]
export default StockReceived