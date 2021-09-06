import dayjs from 'dayjs';
import axios from 'axios';
import { Menu, message, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import Actions from '../../../../components/Actions';
import CustomModal from '../../../../components/CustomModal';
import SearchInput from '../../../../components/SearchInput';
import { getStockColumns } from '../../../../assets/fixtures';
import { EyeIconGrey } from '../../../../components/SVG_Icons';
import RoutesFilter from '../../../../components/RoutesFilter';
import ArrivedStockView from '../../warehouse/forms/ArrivedStock';
import CustomPagination from '../../../../components/CustomPagination';
import { doubleKeyComplexSearch, getStatusColor, isEmpty, renderProductDetails, showToast } from '../../../../utils/Functions';
const DATEANDTIMEFORMAT = 'DD/MM/YYYY hh:mm A'

const DamagedStockWH = () => {
    const [loading, setLoading] = useState(true)
    const [stock, setStock] = useState([])
    const [stockClone, setStockClone] = useState([])
    const [viewData, setViewData] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [viewModal, setViewModal] = useState(false)
    const [filterON, setFilterON] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [warehouseList, setWarehouseList] = useState([])
    const [filteredClone, setFilteredClone] = useState([])
    const [resetSearch, setResetSearch] = useState(false)

    const damagedStockColumns = useMemo(() => getStockColumns(true, 'MPAdmin'), [])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getDamagedStock()
        getWarehouseList()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getDamagedStock = async () => {
        const url = 'warehouse/getDamagedStock'

        try {
            const data = await http.GET(axios, url, config)
            setLoading(false)
            setTotalCount(data.length)
            setStockClone(data)
            setStock(data)
        } catch (error) { }
    }

    const getStockById = async (id) => {
        const url = `warehouse/getReceivedStockById/${id}`

        try {
            showToast({ v1Ing: 'Fetching', action: 'loading' })
            const [data] = await http.GET(axios, url, config)
            message.destroy()
            setViewData(data)
            setViewModal(true)
        } catch (error) { }
    }

    const getWarehouseList = async () => {
        const url = 'bibo/getDepartmentsList?departmentType=warehouse'

        try {
            const data = await http.GET(axios, url, config)
            setWarehouseList(data)
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

    const onFilterChange = (data) => {
        setPageNumber(1)
        if (isEmpty(data)) {
            setStock(stockClone)
            setTotalCount(stockClone.length)
            setFilterON(false)
        }
        else generateFiltered(stockClone, data)
    }

    const generateFiltered = (original, filterInfo) => {
        const filtered = original.filter((item) => filterInfo.includes(item.departmentId))
        setStock(filtered)
        setFilteredClone(filtered)
        setTotalCount(filtered.length)
        setFilterON(true)
        searchON && setResetSearch(!resetSearch)
    }

    const handleSearch = (value) => {
        setPageNumber(1)
        if (value === "") {
            setTotalCount(stockClone.length)
            setStock(stockClone)
            setSeachON(false)
            return
        }
        const data = filterON ? filteredClone : stockClone
        const result = doubleKeyComplexSearch(stockClone, value, 'dcNo', 'departmentName')
        setTotalCount(result.length)
        setStock(result)
        setSeachON(true)
    }

    const dataSource = useMemo(() => stock.map((order) => {
        const { id, dcNo, departmentName, driverName, mobileNumber, product20L, product1L,
            product2L, product300ML, product500ML, isConfirmed, deliveryDate } = order
        return {
            key: id,
            dcNo,
            departmentName,
            driverName,
            mobileNumber,
            status: renderStatus(isConfirmed),
            dateAndTime: dayjs(deliveryDate).format(DATEANDTIMEFORMAT),
            stockDetails: renderProductDetails({ product20L, product1L, product2L, product300ML, product500ML }),
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, id)} />
        }
    }), [stock])

    const handleModalCancel = useCallback(() => setViewModal(false), [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <div className='stock-delivery-container'>
            <div className='header'>
                <div className='left'>
                    <RoutesFilter
                        data={warehouseList}
                        keyValue='departmentId'
                        keyLabel='departmentName'
                        title='Select Warehouse'
                        onChange={onFilterChange}
                    />
                </div>
                <div className='right'>
                    <SearchInput
                        placeholder='Search Delivery Challan'
                        className='delivery-search'
                        width='50%'
                        onChange={handleSearch}
                    />
                </div>
            </div>
            <div className='app-table delivery-table'>
                <Table
                    loading={{ spinning: loading, indicator: <Spinner /> }}
                    dataSource={dataSource.slice(sliceFrom, sliceTo)}
                    columns={damagedStockColumns}
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
const options = [<Menu.Item key="view" icon={<EyeIconGrey />}>View</Menu.Item>]
export default DamagedStockWH