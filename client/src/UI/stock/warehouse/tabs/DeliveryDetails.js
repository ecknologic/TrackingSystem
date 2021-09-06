import axios from 'axios';
import { Menu, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DCView from '../views/DCView';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import Actions from '../../../../components/Actions';
import { DDColumns } from '../../../../assets/fixtures';
import SearchInput from '../../../../components/SearchInput';
import CustomModal from '../../../../components/CustomModal';
import RoutesFilter from '../../../../components/RoutesFilter';
import { EyeIconGrey } from '../../../../components/SVG_Icons';
import CustomPagination from '../../../../components/CustomPagination';
import { isEmpty, doubleKeyComplexSearch, renderProductDetails } from '../../../../utils/Functions';

const DeliveryDetails = ({ date, driverList }) => {
    const [loading, setLoading] = useState(true)
    const [deliveriesClone, setDeliveriesClone] = useState([])
    const [filteredClone, setFilteredClone] = useState([])
    const [deliveries, setDeliveries] = useState([])
    const [formData, setFormData] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [resetSearch, setResetSearch] = useState(false)
    const [filterInfo, setFilterInfo] = useState([])
    const [filterON, setFilterON] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [DCModal, setDCModal] = useState(false)
    const [title, setTitle] = useState('')

    const source = useMemo(() => axios.CancelToken.source(), [date]);
    const config = { cancelToken: source.token }

    useEffect(() => {
        setLoading(true)
        getDeliveries()

    }, [date])

    useEffect(() => {

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getDeliveries = async () => {
        const url = `warehouse/deliveryDetailsByDriver/${date}`
        try {
            const data = await http.GET(axios, url, config)
            setPageNumber(1)
            setDeliveriesClone(data)
            setLoading(false)
            if (!isEmpty(filterInfo)) {
                generateFiltered(data, filterInfo)
            }
            else {
                setTotalCount(data.length)
                setDeliveries(data)
            }
        } catch (error) { }
    }

    const onFilterChange = (data) => {
        setPageNumber(1)
        setFilterInfo(data)
        if (isEmpty(data)) {
            setDeliveries(deliveriesClone)
            setTotalCount(deliveriesClone.length)
            setFilterON(false)
        }
        else generateFiltered(deliveriesClone, data)
    }

    const generateFiltered = (original, filterInfo) => {
        const filtered = original.filter((item) => filterInfo.includes(item.driverId))
        setDeliveries(filtered)
        setFilteredClone(filtered)
        setTotalCount(filtered.length)
        setFilterON(true)
        searchON && setResetSearch(!resetSearch)
    }

    const handleMenuSelect = async (key, data) => {
        if (key === 'view') {
            const title = `${data.driverName} - Delivery Details`
            setTitle(title)
            setFormData(data)
            setDCModal(true)
        }
    }

    const handlePageChange = (number) => {
        setPageNumber(number)
    }

    const handleSizeChange = (number, size) => {
        setPageSize(size)
        setPageNumber(number)
    }

    const onModalClose = () => {
        setDCModal(false)
        setFormData({})
    }

    const handleSearch = (value) => {
        setPageNumber(1)
        if (value === "") {
            setTotalCount(deliveriesClone.length)
            setDeliveries(deliveriesClone)
            setSeachON(false)
            return
        }
        const data = filterON ? filteredClone : deliveriesClone
        const result = doubleKeyComplexSearch(data, value, 'driverName', 'routeName')
        setTotalCount(result.length)
        setDeliveries(result)
        setSeachON(true)
    }

    const dataSource = useMemo(() => deliveries.map((dc, index, thisArray) => {
        const { driverId, routeName, driverName, stockDetails, deliveredDetails, pendingDetails } = dc

        const options = [
            <Menu.Item key="view" icon={<EyeIconGrey />}>View</Menu.Item>
        ]

        return {
            key: driverId,
            sNo: thisArray.length - index,
            driverName,
            routeName: routeName || 'Not Assigned',
            stockDetails: renderProductDetails(stockDetails),
            deliveredDetails: renderProductDetails(deliveredDetails),
            pendingDetails: renderProductDetails(pendingDetails),
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, dc)} />
        }
    }), [deliveries])

    const handleModalCancel = useCallback(() => onModalClose(), [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <div className='stock-delivery-container'>
            <div className='header'>
                <div className='left'>
                    <RoutesFilter
                        data={driverList}
                        keyValue='driverId'
                        keyLabel='driverName'
                        title='Select Drivers'
                        onChange={onFilterChange}
                    />
                </div>
                <div className='right'>
                    <SearchInput
                        placeholder='Search Driver'
                        className='delivery-search'
                        reset={resetSearch}
                        onChange={handleSearch}
                        width='50%'
                    />
                </div>
            </div>
            <div className='app-table delivery-table'>
                <Table
                    loading={{ spinning: loading, indicator: <Spinner /> }}
                    dataSource={dataSource.slice(sliceFrom, sliceTo)}
                    columns={DDColumns}
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
                visible={DCModal}
                onOk={handleModalCancel}
                onCancel={handleModalCancel}
                title={title}
                okTxt='Close'
                hideCancel
            >
                <DCView data={formData} />
            </CustomModal>
        </div>
    )
}

export default DeliveryDetails