import dayjs from 'dayjs';
import axios from 'axios';
import { Menu, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DamagedStockView from '../view/Damaged';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import Actions from '../../../../components/Actions';
import CustomModal from '../../../../components/CustomModal';
import SearchInput from '../../../../components/SearchInput';
import { EyeIconGrey } from '../../../../components/SVG_Icons';
import { damagedStockColumns } from '../../../../assets/fixtures';
import { doubleKeyComplexSearch } from '../../../../utils/Functions';
import CustomPagination from '../../../../components/CustomPagination';
const DATEANDTIMEFORMAT = 'DD/MM/YYYY hh:mm A'

const DamagedStock = () => {
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
    const [filteredClone, setFilteredClone] = useState([])
    const [resetSearch, setResetSearch] = useState(false)

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getDamagedStock()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getDamagedStock = async () => {
        const url = 'motherPlant/getMPdamagedStock'

        try {
            const data = await http.GET(axios, url, config)
            setLoading(false)
            setTotalCount(data.length)
            setStockClone(data)
            setStock(data)
        } catch (error) { }
    }

    const handleMenuSelect = (key, data) => {
        if (key === 'view') {
            setViewData(data)
            setViewModal(true)
        }
    }

    const handlePageChange = (number) => {
        setPageNumber(number)
    }

    const handleSizeChange = (number, size) => {
        setPageSize(size)
        setPageNumber(number)
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
        const result = doubleKeyComplexSearch(stockClone, value, 'batchId', 'managerName')
        setTotalCount(result.length)
        setStock(result)
        setSeachON(true)
    }

    const dataSource = useMemo(() => stock.map((order) => {
        const { damageid, batchId, managerName, product20L, product1L,
            product2L, product300ML, product500ML, createdDateTime } = order
        return {
            key: damageid,
            batchId,
            managerName,
            dateAndTime: dayjs(createdDateTime).format(DATEANDTIMEFORMAT),
            stockDetails: renderStockDetails({ product20L, product1L, product2L, product300ML, product500ML }),
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, order)} />
        }
    }), [stock])

    const handleModalCancel = useCallback(() => setViewModal(false), [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <div className='stock-delivery-container'>
            <div className='header'>
                <div className='left'>
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
                title='Damaged Stock Details'
                okTxt='Close'
                hideCancel
            >
                <DamagedStockView viewOnly data={viewData} />
            </CustomModal>
        </div>
    )
}
const renderStockDetails = ({ product20L, product1L, product2L, product500ML, product300ML }) => {
    return `
    20 ltrs - ${Number(product20L)}, 2 ltrs - ${Number(product2L)} boxes, 1 ltr - ${Number(product1L)} boxes,
    500 ml - ${Number(product500ML)} boxes, 300 ml - ${Number(product300ML)} boxes
    `
}
const options = [<Menu.Item key="view" icon={<EyeIconGrey />}>View</Menu.Item>]
export default DamagedStock