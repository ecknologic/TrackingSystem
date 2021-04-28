import axios from 'axios';
import Slider from "react-slick";
import { Menu, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import DamagedStock from '../forms/DamagedStock';
import Spinner from '../../../../components/Spinner';
import Actions from '../../../../components/Actions';
import can1L from '../../../../assets/icons/ic_Can1L.svg'
import can2L from '../../../../assets/icons/ic_Can2L.svg'
import StockCard from '../../../../components/StockCard';
import FormHeader from '../../../../components/FormHeader';
import can20L from '../../../../assets/icons/ic_Can20L.svg'
import { TODAYDATE as d } from '../../../../utils/constants';
import SearchInput from '../../../../components/SearchInput';
import CustomModal from '../../../../components/CustomModal';
import can300ML from '../../../../assets/icons/ic_Can300ML.svg'
import can500ML from '../../../../assets/icons/ic_Can500ML.svg'
import { currentStockColumns } from '../../../../assets/fixtures';
import { doubleKeyComplexSearch } from '../../../../utils/Functions';
import CustomPagination from '../../../../components/CustomPagination';
import { EditIconGrey, PlusIconGrey, TrashIconGrey } from '../../../../components/SVG_Icons';
import { LeftChevronIconGrey, RightChevronIconGrey } from '../../../../components/SVG_Icons';

const CurrentStock = ({ isSuperAdmin = false }) => {
    const [stock, setStock] = useState({})
    const [loading, setLoading] = useState(true)
    const [viewData, setViewData] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [addModal, setAddModal] = useState(false)
    const [RM, setRM] = useState([])
    const [RMClone, setRMClone] = useState([])

    const { product20LCount, product2LCount, product1LCount, product500MLCount, product300MLCount } = stock
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getRM()
        getTotalStock(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getTotalStock = async ({ startDate, endDate, shift, fromStart }) => {
        const url = `motherPlant/getTotalProductionDetails?startDate=${startDate}&endDate=${endDate}&shiftType=${shift}&fromStart=${fromStart}`

        try {
            const data = await http.GET(axios, url, config)
            setStock(data)
        } catch (error) { }
    }

    const getRM = async () => {
        const url = `motherPlant/getRMDetails?isSuperAdmin=${isSuperAdmin}`

        try {
            const data = await http.GET(axios, url, config)
            setRM(data)
            setRMClone(data)
            setTotalCount(data.length)
            setLoading(false)
        } catch (error) { }
    }

    const handleMenuSelect = (key, data) => {
        if (key === 'Add') {
            setViewData(data)
            setAddModal(true)
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
            setTotalCount(RMClone.length)
            setRM(RMClone)
            return
        }
        const result = doubleKeyComplexSearch(RMClone, value, 'orderId', 'itemName')
        setTotalCount(result.length)
        setRM(result)
    }

    const dataSource = useMemo(() => RM.map((item) => {
        const { rawmaterialid: key, itemName, itemCode, itemQty, vendorName, reorderLevel } = item

        return {
            key,
            itemName,
            itemQty,
            itemCode,
            vendorName,
            reorderLevel,
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, item)} />
        }
    }), [RM])

    const handleModalCancel = useCallback(() => setAddModal(false), [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <div className='stock-delivery-container current-stock-container'>
            <FormHeader title='Total New Bottle Status Today' />
            <div className='panel-body'>
                <Slider className='dashboard-slider' {...props} >
                    <StockCard title='20 Ltrs' icon={can20L} total={product20LCount} />
                    <StockCard title='2 Ltrs' icon={can2L} total={product2LCount} />
                    <StockCard title='1 Ltrs' icon={can1L} total={product1LCount} />
                    <StockCard title='500 ml' icon={can500ML} total={product500MLCount} />
                    <StockCard title='300 ml' icon={can300ML} total={product300MLCount} />
                </Slider>
            </div>
            <div className='header'>
                <div className='left'>
                    <FormHeader title='Raw Material Stock Details' />
                </div>
                <div className='right'>
                    <SearchInput
                        placeholder='Search Material'
                        className='delivery-search'
                        onChange={handleSearch}
                        width='50%'
                    />
                </div>
            </div>
            <div className='app-table dispatch-table'>
                <Table
                    loading={{ spinning: loading, indicator: <Spinner /> }}
                    dataSource={dataSource.slice(sliceFrom, sliceTo)}
                    columns={currentStockColumns}
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
                visible={addModal}
                title='Add Damaged Stock'
                onOk={handleModalCancel}
                onCancel={handleModalCancel}
                className='app-form-modal'
            >
                <DamagedStock
                    data={viewData}
                    onBlur={() => { }}
                    errors={{}}
                    onChange={() => { }}
                />
            </CustomModal>
        </div>
    )
}

const props = {
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    prevArrow: <LeftChevronIconGrey />,
    nextArrow: <RightChevronIconGrey />,
}
const opData = { startDate: d, endDate: d, shift: 'All', fromStart: true }
const options = [
    <Menu.Item key="view" icon={<EditIconGrey />}>View/Edit</Menu.Item>,
    <Menu.Item key="Delete" icon={<TrashIconGrey />} >Delete</Menu.Item>,
    <Menu.Item key="Add" icon={<PlusIconGrey />} >Add Damaged Stock</Menu.Item>
]
export default CurrentStock