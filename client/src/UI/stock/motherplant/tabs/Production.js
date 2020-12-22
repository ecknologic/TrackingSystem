import dayjs from 'dayjs';
import { Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BatchForm from '../forms/BatchForm';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import QuitModal from '../../../../components/CustomModal';
import TableAction from '../../../../components/TableAction';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import { TRACKFORM } from '../../../../utils/constants';
import CustomPagination from '../../../../components/CustomPagination';
import { deepClone, getStatusColor, isEmpty, resetTrackForm, showToast } from '../../../../utils/Functions';
import CustomModal from '../../../../components/CustomModal';
import { shiftOptions, productionColumns } from '../../../../assets/fixtures';
import { validateBatchValues, validateIntFloat, validateNames, validateNumber } from '../../../../utils/validations';

const Production = () => {
    const [loading, setLoading] = useState(true)
    const [productsClone, setProductsClone] = useState([])
    const [products, setProducts] = useState([])
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [confirmModal, setConfirmModal] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [modal, setModal] = useState(false)
    const [filterInfo, setFilterInfo] = useState([])
    const [shake, setShake] = useState(false)

    const productionIdRef = useRef()
    const formTitleRef = useRef()

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

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
        if (key === 'managerName') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'phLevel' || key === 'ozoneLevel' || key === 'TDS') {
            const error = validateIntFloat(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key.includes('product')) {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, products: error }))
        }
    }

    const handleBlur = (value, key) => {
        // Validations
        if (key === 'phLevel' || key === 'ozoneLevel' || key === 'TDS') {
            const error = validateIntFloat(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const generateFiltered = (original, filterInfo) => {
        const filtered = original.filter((item) => filterInfo.includes(item.RouteId))
        setProducts(filtered)
        setTotalCount(filtered.length)
    }

    const handleMenuSelect = (key, data) => {
        if (key === 'view') {
            productionIdRef.current = data.productionid
            formTitleRef.current = `Batch - ${data.batchId}`
            setFormData(data)
            setModal(true)
        }
    }

    const handlePageChange = (number) => {
        setPageNumber(number)
    }

    const handleSizeChange = (number, size) => {
        setPageSize(size)
        setPageNumber(number)
    }

    const optimisticUpdate = (data) => {
        let clone = deepClone(products);
        const index = clone.findIndex(item => item.productionid === data.productionid)
        clone[index] = data;
        setProducts(clone)
    }

    const handleUpdate = async () => {
        const formErrors = validateBatchValues(formData)

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        const url = '/motherPlant/updateProductionDetails'
        const body = {
            ...formData
        }

        try {
            setBtnDisabled(true)
            showToast('Batch', 'loading', 'PUT')
            const data = await http.POST(url, body)
            showToast('Batch', 'success', 'PUT')
            optimisticUpdate(data)
            onModalClose(true)
            setBtnDisabled(false)
        } catch (error) {
            setBtnDisabled(false)
        }
    }

    const onModalClose = (hasSaved) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasSaved) {
            return setConfirmModal(true)
        }
        setModal(false)
        setBtnDisabled(false)
        setFormData({})
        setFormErrors({})
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
    const handleModalCancel = useCallback(() => onModalClose(), [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <div className='stock-delivery-container'>
            <div className='app-table prod-table'>
                <Table
                    loading={{ spinning: loading, indicator: <Spinner /> }}
                    dataSource={dataSource.slice(sliceFrom, sliceTo)}
                    columns={productionColumns}
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
                className={`app-form-modal ${shake ? 'app-shake' : ''}`}
                visible={modal}
                btnDisabled={btnDisabled}
                onOk={handleModalCancel}
                onCancel={handleModalCancel}
                title={formTitleRef.current}
                okTxt='Close'
                track
            >
                <BatchForm
                    track
                    disabled
                    data={formData}
                    errors={formErrors}
                    shiftOptions={shiftOptions}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
            </CustomModal>
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

const renderStatus = (status) => {
    const color = getStatusColor(status)
    const text = status === 'Inprogress' ? 'Pending' : 'Delivered'
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