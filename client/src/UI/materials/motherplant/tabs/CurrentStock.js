import axios from 'axios';
import { Menu, message, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Stock from '../forms/Stock';
import { http } from '../../../../modules/http';
import CurrentStockForm from '../forms/CurrentStock';
import DamagedStock from '../forms/DamagedStock';
import Spinner from '../../../../components/Spinner';
import Actions from '../../../../components/Actions';
import SearchInput from '../../../../components/SearchInput';
import CustomModal from '../../../../components/CustomModal';
import ConfirmModal from '../../../../components/CustomModal';
import CustomButton from '../../../../components/CustomButton';
import { currentStockColumns } from '../../../../assets/fixtures';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import CustomPagination from '../../../../components/CustomPagination';
import { TODAYDATE as d, TRACKFORM } from '../../../../utils/constants';
import ActivityLogContent from '../../../../components/ActivityLogContent';
import { compareMaxNumber, validateNumber } from '../../../../utils/validations';
import { PlusIconGrey, ListViewIconGrey, EditIconGrey } from '../../../../components/SVG_Icons';
import { deepClone, doubleKeyComplexSearch, isEmpty, resetTrackForm, showToast } from '../../../../utils/Functions';

const CurrentStock = ({ isSuperAdmin = false }) => {
    const [RM, setRM] = useState([])
    const [shake, setShake] = useState(false)
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({})
    const [RMClone, setRMClone] = useState([])
    const [pageSize, setPageSize] = useState(10)
    const [formErrors, setFormErrors] = useState({})
    const [logModal, setLogModal] = useState(false)
    const [pageNumber, setPageNumber] = useState(1)
    const [viewModal, setViewModal] = useState(false)
    const [viewTitle, setViewTitle] = useState(false)
    const [addDamagedModal, setAddDamagedModal] = useState(false)
    const [addStockModal, setAddStockModal] = useState(false)
    const [totalCount, setTotalCount] = useState(null)
    const [confirmModal, setConfirmModal] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getRM()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getRM = async () => {
        const url = `motherPlant/getCurrentRMDetails?isSuperAdmin=${isSuperAdmin}`

        try {
            const data = await http.GET(axios, url, config)
            setRM(data)
            setRMClone(data)
            setTotalCount(data.length)
            setLoading(false)
        } catch (error) { }
    }

    const getLogs = async (id) => {
        const url = `logs/getDepartmentLogs?type=currentstock&id=${id}`

        try {
            showToast({ v1Ing: 'Fetching', action: 'loading' })
            const data = await http.GET(axios, url, config)
            showToast({ v2: 'fetched' })
            setLogs(data)
        } catch (error) { }
    }


    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
        if (key === 'damagedCount') {
            const { totalQuantity } = formData
            const error = compareMaxNumber(value, totalQuantity, 'cans')
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'totalQuantity') {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'reorderLevel') {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleBlur = (value, key) => {
        // Validations
        if (key === 'damagedCount') {
            const { totalQuantity } = formData
            const error = compareMaxNumber(value, totalQuantity, 'cans')
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleSubmit = async () => {
        const { id, totalQuantity } = formData
        let errors = {}
        const error = validateNumber(totalQuantity, true)
        error && (errors.totalQuantity = error)

        if (!isEmpty(errors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(errors)
            return
        }

        const body = { id, totalQuantity }
        const url = 'motherPlant/TODO'
        const options = { item: 'Current Stock', v1Ing: 'Updating', v2: 'updated' }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.PUT(axios, url, body, config)
            showToast(options)
            optimisticUpdate(id, totalQuantity, 'totalQuantity')
            onModalClose(true)
        } catch (error) {
            message.destroy()
            if (!axios.isCancel(error)) {
                setBtnDisabled(false)
            }
        }
    }

    const handleAddDamaged = async () => {
        const { id, damagedCount = 0, itemCode, totalQuantity } = formData
        let errors = {}
        const error = compareMaxNumber(damagedCount, totalQuantity, 'cans')
        error && (errors.damagedCount = error)

        if (!isEmpty(errors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(errors)
            return
        }

        const body = { id, damagedCount, itemCode }
        const url = 'motherPlant/updateRMDamageCount'
        const options = { item: 'Damaged Stock', v1Ing: 'Adding', v2: 'added' }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.PUT(axios, url, body, config)
            showToast(options)
            optimisticUpdate(id, damagedCount, 'damagedCount')
            onModalClose(true)
        } catch (error) {
            message.destroy()
            if (!axios.isCancel(error)) {
                setBtnDisabled(false)
            }
        }
    }

    const handleAddStock = async () => {
        const { totalQuantity, itemCode } = formData
        let errors = {}
        if (!itemCode) errors.itemCode = 'Required'
        if (!Number(totalQuantity)) errors.totalQuantity = 'Required'
        else {
            const error = validateNumber(totalQuantity, true)
            error && (errors.totalQuantity = error)
        }

        if (!isEmpty(errors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(errors)
            return
        }

        const body = { itemCode, totalQuantity }
        const url = 'motherPlant/addOldEmptyCans'
        const options = { item: 'Stock', v1Ing: 'Adding', v2: 'added' }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            const [data] = await http.POST(axios, url, body, config)
            showToast(options)
            optimisticAdd(data)
            onModalClose(true)
        } catch (error) {
            message.destroy()
            if (!axios.isCancel(error)) {
                setBtnDisabled(false)
            }
        }
    }

    const optimisticAdd = (data) => {
        let clone = deepClone(RM);
        clone.unshift(data)
        setRM(clone)
    }
    const optimisticUpdate = (id, value, key) => {
        let clone = deepClone(RM);
        const index = clone.findIndex(item => item.id === id)
        clone[index][key] = value;
        setRM(clone)
    }

    const onModalClose = (hasUpdated) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasUpdated) {
            return setConfirmModal(true)
        }
        setAddStockModal(false)
        setViewModal(false)
        setAddDamagedModal(false)
        setFormData({})
        setFormErrors({})
        resetTrackForm()
        setBtnDisabled(false)
    }

    const onAddStock = () => {
        setAddStockModal(true)
    }

    const handleMenuSelect = async (key, data) => {
        if (key === 'view') {
            setFormData(data)
            setViewTitle(`Material Details - ${data.itemName}`)
            setViewModal(true)
        }
        else if (key === 'Add') {
            setFormData(data)
            setAddDamagedModal(true)
        }
        else if (key === 'logs') {
            await getLogs(data.id)
            setLogModal(true)
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
        const { id: key, itemName, itemCode, totalQuantity, damagedCount, reorderLevel } = item

        return {
            key,
            itemName,
            itemCode,
            totalQuantity,
            reorderLevel: reorderLevel || '-',
            damagedCount,
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, item)} />
        }
    }), [RM])

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false)
        resetTrackForm()
        onModalClose()
    }, [])
    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])
    const handleModalCancel = useCallback(() => onModalClose(), [])
    const handleLogModalCancel = useCallback(() => setLogModal(false), [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <div className='stock-delivery-container current-stock-container'>
            <div className='header'>
                <div className='left'>
                </div>
                <div className='right'>
                    <CustomButton
                        style={{ marginRight: '1em' }}
                        text='Add Stock'
                        onClick={onAddStock}
                    />
                    <SearchInput
                        placeholder='Search Material'
                        className='delivery-search'
                        onChange={handleSearch}
                        width='40%'
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
                okTxt='Update'
                visible={viewModal}
                btnDisabled={btnDisabled}
                title={viewTitle}
                onOk={handleSubmit}
                onCancel={handleModalCancel}
                className={`app-form-modal ${shake ? 'app-shake' : ''}`}
            >
                <CurrentStockForm
                    data={formData}
                    onBlur={handleBlur}
                    errors={formErrors}
                    onChange={handleChange}
                />
            </CustomModal>
            <CustomModal
                hideCancel
                okTxt='Add'
                visible={addDamagedModal}
                btnDisabled={btnDisabled}
                title='Add Damaged Stock'
                onOk={handleAddDamaged}
                onCancel={handleModalCancel}
                className={`app-form-modal ${shake ? 'app-shake' : ''}`}
            >
                <DamagedStock
                    data={formData}
                    onBlur={handleBlur}
                    errors={formErrors}
                    onChange={handleChange}
                />
            </CustomModal>
            <CustomModal
                hideCancel
                okTxt='Add'
                visible={addStockModal}
                btnDisabled={btnDisabled}
                title='Add Stock'
                onOk={handleAddStock}
                onCancel={handleModalCancel}
                className={`app-form-modal ${shake ? 'app-shake' : ''}`}
            >
                <Stock
                    data={formData}
                    errors={formErrors}
                    onChange={handleChange}
                />
            </CustomModal>
            <CustomModal
                className='app-form-modal'
                visible={logModal}
                onOk={handleLogModalCancel}
                onCancel={handleLogModalCancel}
                title='Activity Log Details'
                okTxt='Close'
                hideCancel
            >
                <ActivityLogContent data={logs} />
            </CustomModal>
            <ConfirmModal
                visible={confirmModal}
                onOk={handleConfirmModalOk}
                onCancel={handleConfirmModalCancel}
                title='Are you sure you want to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </ConfirmModal>
        </div>
    )
}

const opData = { startDate: d, endDate: d, shift: 'All', fromStart: true }
const options = [
    <Menu.Item key="view" icon={<EditIconGrey />}>View/Edit</Menu.Item>,
    <Menu.Item key="logs" icon={<ListViewIconGrey />}>Acvitity Logs</Menu.Item>,
    <Menu.Item key="Add" icon={<PlusIconGrey />} >Add Damaged Stock</Menu.Item>
]
export default CurrentStock