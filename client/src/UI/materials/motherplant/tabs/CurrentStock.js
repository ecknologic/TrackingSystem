import axios from 'axios';
import { Menu, message, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import DamagedStock from '../forms/DamagedStock';
import Spinner from '../../../../components/Spinner';
import Actions from '../../../../components/Actions';
import SearchInput from '../../../../components/SearchInput';
import CustomModal from '../../../../components/CustomModal';
import ConfirmModal from '../../../../components/CustomModal';
import { validateNumber } from '../../../../utils/validations';
import { currentStockColumns } from '../../../../assets/fixtures';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import CustomPagination from '../../../../components/CustomPagination';
import { TODAYDATE as d, TRACKFORM } from '../../../../utils/constants';
import ActivityLogContent from '../../../../components/ActivityLogContent';
import { PlusIconGrey, TrashIconGrey, ListViewIconGrey } from '../../../../components/SVG_Icons';
import { deepClone, doubleKeyComplexSearch, isEmpty, resetTrackForm, showToast } from '../../../../utils/Functions';

const CurrentStock = ({ isSuperAdmin = false }) => {
    const [RM, setRM] = useState([])
    const [shake, setShake] = useState(false)
    const [stock, setStock] = useState({})
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [logModal, setLogModal] = useState(false)
    const [pageNumber, setPageNumber] = useState(1)
    const [addModal, setAddModal] = useState(false)
    const [formErrors, setFormErrors] = useState({})
    const [formData, setFormData] = useState({})
    const [RMClone, setRMClone] = useState([])
    const [confirmModal, setConfirmModal] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)

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
        const url = `logs/getDepartmentLogs?type=order&id=${id}` // TODO : update API Url

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
            let error = ''
            error = validateNumber(value)
            if (value === null || !String(value)) error = 'Required'
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleBlur = (value, key) => {
        // Validations
        if (key === 'damagedCount') {
            let error = ''
            error = validateNumber(value, true)
            if (value === null || !Number(value)) error = 'Required'
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleAdd = async () => {
        const { id, damagedCount = 0 } = formData
        let errors = {}
        let error = ''
        error = validateNumber(damagedCount, true)
        if (damagedCount === null || !Number(damagedCount)) error = 'Required'
        error && (errors.damagedCount = error)

        if (!isEmpty(errors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(errors)
            return
        }

        const body = { id, damagedCount }
        const url = 'motherPlant/updateRMDamageCount'
        const options = { item: 'Damaged Stock', v1Ing: 'Adding', v2: 'added' }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.PUT(axios, url, body, config)
            showToast(options)
            optimisticUpdate(id, damagedCount)
            onModalClose(true)
        } catch (error) {
            message.destroy()
            if (!axios.isCancel(error)) {
                setBtnDisabled(false)
            }
        }
    }

    const optimisticUpdate = (id, damagedCount) => {
        let clone = deepClone(RM);
        const index = clone.findIndex(item => item.id === id)
        clone[index].damagedCount = damagedCount;
        setRM(clone)
    }

    const onModalClose = (hasUpdated) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasUpdated) {
            return setConfirmModal(true)
        }
        setAddModal(false)
        setFormData({})
        setFormErrors({})
        resetTrackForm()
        setBtnDisabled(false)
    }

    const handleMenuSelect = async (key, data) => {
        if (key === 'Add') {
            setFormData(data)
            setAddModal(true)
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
            reorderLevel,
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
    const handleModalCancel = useCallback(() => setAddModal(false), [])
    const handleLogModalCancel = useCallback(() => setLogModal(false), [])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <div className='stock-delivery-container current-stock-container'>
            <div className='header'>
                <div className='left'>
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
                btnDisabled={btnDisabled}
                title='Add Damaged Stock'
                onOk={handleAdd}
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
    // <Menu.Item key="view" icon={<EditIconGrey />}>View/Edit</Menu.Item>,
    <Menu.Item key="Delete" icon={<TrashIconGrey />} >Delete</Menu.Item>,
    <Menu.Item key="logs" icon={<ListViewIconGrey />}>Acvitity Logs</Menu.Item>,
    <Menu.Item key="Add" icon={<PlusIconGrey />} >Add Damaged Stock</Menu.Item>
]
export default CurrentStock