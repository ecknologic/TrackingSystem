import dayjs from 'dayjs';
import { Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import QuitModal from '../../../../components/CustomModal';
import TableAction from '../../../../components/TableAction';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import { getWarehoseId, TRACKFORM } from '../../../../utils/constants';
import CustomPagination from '../../../../components/CustomPagination';
import { productionColumns } from '../../../../assets/fixtures';
import { resetTrackForm } from '../../../../utils/Functions';

const Production = () => {
    const warehouseId = getWarehoseId()
    const [routes, setRoutes] = useState([])
    const [drivers, setDrivers] = useState([])
    const [loading, setLoading] = useState(true)
    const [productsClone, setProductsClone] = useState([])
    const [products, setProducts] = useState([])
    const [formData, setFormData] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [confirmModal, setConfirmModal] = useState(false)
    const [filterInfo, setFilterInfo] = useState([])
    const [shake, setShake] = useState(false)

    const customerOrderIdRef = useRef()
    const DCFormTitleRef = useRef()
    const DCFormBtnRef = useRef()

    useEffect(() => {
        getProducts()
    }, [])

    const getProducts = async () => {
        setLoading(true)
        const url = `/motherPlant/getProductionDetails`
        const data = await http.GET(url)
        setPageNumber(1)
        setProductsClone(data)
        setLoading(false)
        if (filterInfo.length) {
            generateFiltered(data, filterInfo)
        }
        else {
            setTotalCount(data.length)
            setProducts(data)
        }
    }

    const generateFiltered = (original, filterInfo) => {
        const filtered = original.filter((item) => filterInfo.includes(item.RouteId))
        setProducts(filtered)
        setTotalCount(filtered.length)
    }

    const handleMenuSelect = (key, data) => {
        if (key === 'view') {
            customerOrderIdRef.current = data.customerOrderId
            DCFormTitleRef.current = `DC - ${data.customerName}`
            DCFormBtnRef.current = 'Update'
            setFormData(data)
        }
    }

    const handlePageChange = (number) => {
        setPageNumber(number)
    }

    const handleSizeChange = (number, size) => {
        setPageSize(size)
        setPageNumber(number)
    }

    const onModalClose = (hasSaved) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasSaved) {
            return setConfirmModal(true)
        }
        customerOrderIdRef.current = undefined
        setFormData({})
    }

    const dataSource = useMemo(() => products.map((product) => {
        const { batchId, phLevel, TDS, ozoneLevel, managerName, productionDate,
            shiftType = 'morning', isDelivered, ...rest } = product
        return {
            key: batchId,
            TDS, batchId, phLevel, ozoneLevel, managerName, shiftType,
            status: renderStatus(isDelivered),
            productionDetails: renderProductionDetails(rest),
            dateAndTime: dayjs(productionDate).format('DD/MM/YYYY HH:mm'),
            action: <TableAction onSelect={({ key }) => handleMenuSelect(key, product)} />
        }
    }), [products])

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false);
        resetTrackForm()
        onModalClose()
    }, [])

    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <div className='stock-delivery-container'>
            <div className='app-table-container prod-table'>
                <Table
                    loading={{ spinning: loading, indicator: <Spinner /> }}
                    dataSource={dataSource.slice(sliceFrom, sliceTo)}
                    columns={productionColumns}
                    pagination={false}
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
            <QuitModal
                visible={confirmModal}
                onOk={handleConfirmModalOk}
                onCancel={handleConfirmModalCancel}
                title='Are you sure to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </QuitModal>
        </div>
    )
}

const renderStatus = (delivered) => {
    const color = delivered === 'Inprogress' ? '#A10101' : '#0EDD4D'
    const text = delivered === 'Inprogress' ? 'Pending' : 'Delivered'
    return (
        <div className='status'>
            <span className='dot' style={{ background: color }}></span>
            <span className='status-text'>{text}</span>
        </div>
    )
}

const renderProductionDetails = ({ product20L, product1L, product500ML, product250ML }) => {
    return `
    20 lts - ${product20L}, 1 ltr - ${product1L}, 
    500 ml - ${product500ML}, 250 ml - ${product250ML}
    `
}
export default Production