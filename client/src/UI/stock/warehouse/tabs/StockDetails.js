import dayjs from 'dayjs';
import { message } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import ArrivedStockForm from '../forms/ArrivedStock';
import DCPanel from '../../../../components/DCPanel';
import DSPanel from '../../../../components/DSPanel';
import ECPanel from '../../../../components/ECPanel';
import ERCPanel from '../../../../components/ERCPanel';
import OFDPanel from '../../../../components/OFDPanel';
import CASPanel from '../../../../components/CASPanel';
import CustomModal from '../../../../components/CustomModal';
import ConfirmModal from '../../../../components/CustomModal';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import EmptyCansForm from '../../../empty-cans/warehouse/forms/EmptyCans';
import { validateNumber, validateASValues, validateRECValues } from '../../../../utils/validations';
import { getWarehoseId, TODAYDATE, TRACKFORM } from '../../../../utils/constants';
import { getASValuesForDB, isEmpty, resetTrackForm, showToast } from '../../../../utils/Functions';
import { getDriverOptions, getWarehouseOptions, getVehicleOptions } from '../../../../assets/fixtures';

const StockDetails = ({ date }) => {
    const warehouseId = getWarehoseId()
    const [CAS, setCAS] = useState({})
    const [OFD, setOFC] = useState({})
    const [EC, setEC] = useState({})
    const [REC, setREC] = useState({})
    const [motherplantList, setMotherplantList] = useState([])
    const [driverList, setDriverList] = useState([])
    const [vehicleList, setVehicleList] = useState([])
    const [newStock, setNewStock] = useState({})
    const [arrivedStock, setArrivedStock] = useState([])
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [confirmModal, setConfirmModal] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmBtnDisabled, setConfirmBtnDisabled] = useState(false)
    const [modal, setModal] = useState(false)
    const [addModal, setAddModal] = useState(false)
    const [fetchList, setFetchList] = useState(false)
    const [shake, setShake] = useState(false)

    const motherplantOptions = useMemo(() => getWarehouseOptions(motherplantList), [motherplantList])
    const driverOptions = useMemo(() => getDriverOptions(driverList), [driverList])
    const vehicleOptions = useMemo(() => getVehicleOptions(vehicleList), [vehicleList])

    useEffect(() => {
        const isToday = dayjs(date).isSame(dayjs(TODAYDATE))
        getOFD()
        getEC()
        getCAS()
        getREC()

        if (isToday) getNewStock()
        else {
            setNewStock({})
            setArrivedStock([])
        }
    }, [date])

    useEffect(() => {
        if (fetchList) {
            getMotherplantList()
            getDriverList()
            getVehicleList()
        }
    }, [fetchList])

    const getMotherplantList = async () => {
        const data = await http.GET('/bibo/getDepartmentsList?departmentType=MotherPlant')
        setMotherplantList(data)
    }

    const getDriverList = async () => {
        const url = `/bibo/getdriverDetails/${warehouseId}`
        const data = await http.GET(url)
        setDriverList(data)
    }

    const getVehicleList = async () => {
        const url = `/bibo/getVehicleDetails`
        const data = await http.GET(url)
        setVehicleList(data)
    }

    const getCAS = async () => {
        const url = `warehouse/currentActiveStockDetails/${date}?warehouseId=${warehouseId}`
        const { data: [data = {}] } = await http.GET(url)
        setCAS(data)
    }

    const getOFD = async () => {
        const url = `warehouse/outForDeliveryDetails/${date}?warehouseId=${warehouseId}`
        const { data: [data = {}] } = await http.GET(url)
        setOFC(data)
    }

    const getEC = async () => {
        const url = `/warehouse/getConfirmedEmptyCans/${warehouseId}`
        const [data] = await http.GET(url)
        setEC(data)
    }

    const getREC = async () => {
        const url = `/warehouse/getReturnedEmptyCans/${warehouseId}`
        const [data] = await http.GET(url)
        setREC(data)
    }

    const getNewStock = async () => {
        const url = `/warehouse/getNewStockDetails/${warehouseId}`
        const data = await http.GET(url)
        const { DCDetails } = data || {}
        const arrivedStock = JSON.parse(DCDetails || "[]")
        setNewStock(data)
        setArrivedStock(arrivedStock)
    }

    const getStockDetailsByDC = async (dcNo) => {
        showToast({ v1Ing: 'Fetching', action: 'loading' })
        const url = `/warehouse/getDispatchDetailsByDC/${dcNo}`
        const data = await http.GET(url)
        setConfirmBtnDisabled(false)
        message.destroy()
        setFormData(data)
        setModal(true)
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'driverId') {
            let selectedDriver = driverList.find(driver => driver.driverId === Number(value))
            let { mobileNumber = null } = selectedDriver || {}
            setFormData(data => ({ ...data, mobileNumber }))
            setFormErrors(errors => ({ ...errors, mobileNumber: '' }))
        }
        else if (key === 'isDamaged') {
            if (!value) {
                let damaged20LCans, damaged1LBoxes, damaged500MLBoxes, damaged250MLBoxes, damagedDesc;
                setFormData(data => ({
                    ...data, damaged20LCans, damaged1LBoxes, damaged500MLBoxes, damaged250MLBoxes, damagedDesc
                }))
                setFormErrors(errors => ({ ...errors, damagedDesc: '', damaged: '' }))
            }
        }

        // Validations
        if (key.includes('Box') || key.includes('Can')) {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, damaged: error }))
        }
        else if (key === 'emptycans_count') {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, emptycans_count: error }))
        }
    }

    const onArrivedStockConfirm = () => {
        const dcItem = arrivedStock.find(item => item.isConfirmed === 0)
        if (dcItem) {
            setConfirmBtnDisabled(true)
            getStockDetailsByDC(dcItem.dcNo)
        }
    }

    const onAddEmptyCans = () => {
        setFetchList(true)
        setAddModal(true)
    }

    const handleCansReturn = async () => {
        const formErrors = validateRECValues(formData)

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        let url = '/warehouse/returnEmptyCans'
        const body = {
            ...formData, warehouseId
        }
        const options = { item: 'Empty Cans', v1Ing: 'Returning', v2: 'returned' }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(url, body)
            showToast(options)
            onModalClose(true)
            getREC()
        } catch (error) {
            setBtnDisabled(false)
        }
    }

    const handleArrivedStockConfirm = async () => {
        const formErrors = validateASValues(formData)
        const { motherplantId } = formData

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        const dcValues = getASValuesForDB(formData)

        let url = '/warehouse/confirmStockRecieved'
        const body = {
            ...dcValues, motherplantId
        }
        const options = { item: 'Stock Particulars', v1Ing: 'Confirming', v2: 'confirmed' }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(url, body)
            showToast(options)
            onModalClose(true)
            getNewStock()
            getCAS()
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
        setAddModal(false)
        setBtnDisabled(false)
        setFormData({})
        setFormErrors({})
        resetTrackForm()
    }

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false);
        resetTrackForm()
        onModalClose()
    }, [])

    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])
    const handleModalCancel = useCallback(() => onModalClose(), [])

    return (
        <div className='stock-details-container'>
            <CASPanel data={CAS}
                newStock={newStock}
                btnDisabled={confirmBtnDisabled}
                arrivedStock={arrivedStock}
                onConfirm={onArrivedStockConfirm}
            />
            <OFDPanel data={OFD} />
            <DSPanel />
            <div className='empty-cans-header'>
                <span className='title'>Empty Cans details</span>
                <span className='msg'>Empty and damaged cans are not included in correct stock details</span>
            </div>
            <ECPanel confirmed={EC} returned={REC} onAdd={onAddEmptyCans} />
            <ERCPanel />
            <DCPanel />
            <CustomModal
                className={`app-form-modal app-view-modal stock-details-modal ${shake ? 'app-shake' : ''}`}
                visible={modal}
                btnDisabled={btnDisabled}
                onOk={handleArrivedStockConfirm}
                onCancel={handleModalCancel}
                title='Arrived Stock Details'
                okTxt='Confirm Stock Received'
                track
            >
                <ArrivedStockForm
                    data={formData}
                    errors={formErrors}
                    onChange={handleChange}
                />
            </CustomModal>
            <CustomModal
                className={`app-form-modal app-view-modal stock-details-modal ${shake ? 'app-shake' : ''}`}
                visible={addModal}
                btnDisabled={btnDisabled}
                onOk={handleCansReturn}
                onCancel={handleModalCancel}
                title='Empty Cans Return to Mother Plant'
                okTxt='Return Empty Cans'
            >
                <EmptyCansForm
                    data={formData}
                    errors={formErrors}
                    driverOptions={driverOptions}
                    vehicleOptions={vehicleOptions}
                    motherplantOptions={motherplantOptions}
                    onChange={handleChange}
                />
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

export default StockDetails