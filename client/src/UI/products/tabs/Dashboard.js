import { Menu, message, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ProductForm from '../forms/Product';
import { http } from '../../../modules/http'
import Actions from '../../../components/Actions';
import Spinner from '../../../components/Spinner';
import CustomModal from '../../../components/CustomModal';
import { productColumns } from '../../../assets/fixtures';
import { EditIconGrey } from '../../../components/SVG_Icons';
import ConfirmModal from '../../../components/CustomModal';
import CustomPagination from '../../../components/CustomPagination';
import { deepClone, isAlphaNum, isEmpty, resetTrackForm, showToast } from '../../../utils/Functions';
import { validateNumber } from '../../../utils/validations';
import ConfirmMessage from '../../../components/ConfirmMessage';
import { TRACKFORM } from '../../../utils/constants';

const Dashboard = ({ reFetch }) => {
    const [products, setProducts] = useState([])
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(1)
    const [totalCount, setTotalCount] = useState(null)
    const [editModal, setEditModal] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [shake, setShake] = useState(false)

    useEffect(() => {
        setLoading(true)
        getProducts()
    }, [reFetch])

    const getProducts = async () => {
        const url = '/products/getProducts'

        const data = await http.GET(url)
        setProducts(data)
        setTotalCount(data.length)
        setLoading(false)
    }

    const handlePageChange = (number) => {
        setPageNumber(number)
    }

    const handleSizeChange = (number, size) => {
        setPageSize(size)
        setPageNumber(number)
    }

    const handleMenuSelect = (key, data) => {
        if (key === 'edit') {
            setFormData(data)
            setEditModal(true)
        }
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
        if (key === 'productName') {
            const isValid = isAlphaNum(value)
            if (!isValid) setFormErrors(errors => ({ ...errors, [key]: 'Enter aphanumeric only' }))
        }
        else if (key === 'price') {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleSubmit = async () => {
        const formErrors = {}
        const { productName, price } = formData
        if (!price) formErrors.price = 'Required'
        else {
            const error = validateNumber(price)
            if (error) formErrors.price = error
        }
        if (!productName) formErrors.productName = 'Required'
        else {
            const isValid = isAlphaNum(productName)
            if (!isValid) formErrors.productName = 'Enter aphanumeric only'
        }

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        let body = { ...formData }
        const url = '/products/updateProduct'
        const options = { item: 'Product', v1Ing: 'Updating', v2: 'updated' }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(url, body)
            showToast(options)
            optimisticUpdate(formData)
            onModalClose(true)
        } catch (error) {
            message.destroy()
            setBtnDisabled(false)
        }
    }

    const onModalClose = (hasUpdated) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasUpdated) {
            return setConfirmModal(true)
        }
        setEditModal(false)
        setFormData({})
        setFormErrors({})
        resetTrackForm()
        setBtnDisabled(false)
    }

    const optimisticUpdate = (data) => {
        let clone = deepClone(products);
        const index = clone.findIndex(item => item.productId === data.productId)
        const { price, tax } = data
        const totalAmount = (price * tax) / 100 + Number(price)
        data.totalAmount = totalAmount
        clone[index] = data;
        setProducts(clone)
    }

    const dataSource = useMemo(() => products.map((product) => {
        const { productId: key, productName, price, tax, totalAmount } = product

        return {
            key,
            productName,
            price,
            tax,
            totalAmount,
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, product)} />
        }
    }), [products])

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false)
        resetTrackForm()
        onModalClose()
    }, [])
    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])
    const handleModalCancel = useCallback(() => onModalClose(), [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <div className='product-container'>
            <div className='app-table dispatch-table'>
                <Table
                    loading={{ spinning: loading, indicator: <Spinner /> }}
                    dataSource={dataSource.slice(sliceFrom, sliceTo)}
                    columns={productColumns}
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
                okTxt='Update'
                title='Product Details'
                visible={editModal}
                btnDisabled={btnDisabled}
                onOk={handleSubmit}
                onCancel={handleModalCancel}
                className={`app-form-modal ${shake ? 'app-shake' : ''}`}
            >
                <ProductForm
                    data={formData}
                    errors={formErrors}
                    onChange={handleChange}
                />
            </CustomModal>
            <ConfirmModal
                visible={confirmModal}
                onOk={handleConfirmModalOk}
                onCancel={handleConfirmModalCancel}
                title='Are you sure to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </ConfirmModal>
        </div>
    )
}

const options = [<Menu.Item key="edit" icon={<EditIconGrey />}>Edit</Menu.Item>]
export default Dashboard