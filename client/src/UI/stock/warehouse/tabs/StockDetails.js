import axios from 'axios';
import dayjs from 'dayjs';
import { message } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import ArrivedStockForm from '../forms/ArrivedStock';
import DCPanel from '../../../../components/DCPanel';
import DSPanel from '../../../../components/DSPanel';
import ECPanel from '../../../../components/ECPanel';
import useUser from '../../../../utils/hooks/useUser';
import ERCPanel from '../../../../components/ERCPanel';
import OFDPanel from '../../../../components/OFDPanel';
import CASPanel from '../../../../components/CASPanel';
import CustomModal from '../../../../components/CustomModal';
import ConfirmModal from '../../../../components/CustomModal';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import { TODAYDATE, TRACKFORM } from '../../../../utils/constants';
import EmptyCansForm from '../../../empty-cans/warehouse/forms/EmptyCans';
import { getASValuesForDB, isEmpty, resetTrackForm, showToast } from '../../../../utils/Functions';
import { validateNumber, validateASValues, validateRECValues } from '../../../../utils/validations';
import { getDriverOptions, getWarehouseOptions, getVehicleOptions } from '../../../../assets/fixtures';

const StockDetails = ({ date, driverList, vehicleList, motherplantList }) => {
    const { WAREHOUSEID } = useUser()
    const [CAS, setCAS] = useState({})
    const [OFD, setOFC] = useState({})
    const [EC, setEC] = useState({})
    const [REC, setREC] = useState({})
    const [TRC, setTRC] = useState({})
    const [newStock, setNewStock] = useState({})
    const [arrivedStock, setArrivedStock] = useState([])
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [confirmModal, setConfirmModal] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmBtnDisabled, setConfirmBtnDisabled] = useState(false)
    const [modal, setModal] = useState(false)
    const [addModal, setAddModal] = useState(false)
    const [shake, setShake] = useState(false)

    const motherplantOptions = useMemo(() => getWarehouseOptions(motherplantList), [motherplantList])
    const driverOptions = useMemo(() => getDriverOptions(driverList), [driverList])
    const vehicleOptions = useMemo(() => getVehicleOptions(vehicleList), [vehicleList])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        return () => {
            http.ABORT(source)
        }
    }, [])

    useEffect(() => {
        getOFD()
        getEC()
        getCAS()
        getREC()
        getTRC()
        getNewStock()
    }, [date])

    const getCAS = async () => {
        const url = `warehouse/currentActiveStockDetails/${date}?warehouseId=${WAREHOUSEID}`

        try {
            const data = await http.GET(axios, url, config)
            setCAS(data)
        } catch (error) { }
    }

    const getOFD = async () => {
        const url = `warehouse/outForDeliveryDetails/${date}?warehouseId=${WAREHOUSEID}`

        try {
            const data = await http.GET(axios, url, config)
            setOFC(data)
        } catch (error) { }
    }

    const getEC = async () => {
        const url = `warehouse/getConfirmedEmptyCans/${WAREHOUSEID}`

        try {
            const data = await http.GET(axios, url, config)
            setEC(data)
        } catch (error) { }
    }

    const getREC = async () => {
        const url = `warehouse/getReturnedEmptyCans/${date}`

        try {
            const data = await http.GET(axios, url, config)
            setREC(data)
        } catch (error) { }
    }

    const getTRC = async () => {
        const url = `warehouse/getTotalReturnCans/${date}`

        try {
            const data = await http.GET(axios, url, config)
            setTRC(data)
        } catch (error) { }
    }

    const getNewStock = async () => {
        const url = `warehouse/getNewStockDetails/${WAREHOUSEID}?date=${date}`

        try {
            const data = await http.GET(axios, url, config)
            const { DCDetails } = data || {}
            const arrivedStock = JSON.parse(DCDetails || "[]")
            setNewStock(data)
            setArrivedStock(arrivedStock)
        } catch (error) { }
    }

    const getStockDetailsByDC = async (dcNo) => {
        const url = `warehouse/getDispatchDetailsByDC/${dcNo}`

        try {
            showToast({ v1Ing: 'Fetching', action: 'loading' })
            const data = await http.GET(axios, url, config)
            setConfirmBtnDisabled(false)
            message.destroy()
            setFormData(data)
            setModal(true)
        } catch (error) { }
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
                let damaged20LCans, damaged2LBoxes, damaged1LBoxes, damaged500MLBoxes, damaged300MLBoxes, damagedDesc;
                setFormData(data => ({
                    ...data, damaged20LCans, damaged2LBoxes, damaged1LBoxes, damaged500MLBoxes, damaged300MLBoxes, damagedDesc
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

        let url = 'warehouse/returnEmptyCans'
        const body = {
            ...formData, warehouseId: WAREHOUSEID
        }
        const options = { item: 'Empty Cans', v1Ing: 'Returning', v2: 'returned' }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(axios, url, body, config)
            showToast(options)
            onModalClose(true)
            getREC()
            getEC()
        } catch (error) {
            message.destroy()
            if (!axios.isCancel(error)) {
                setBtnDisabled(false)
            }
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

        let url = 'warehouse/confirmStockRecieved'
        const body = {
            ...dcValues, motherplantId
        }
        const options = { item: 'Stock Particulars', v1Ing: 'Confirming', v2: 'confirmed' }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(axios, url, body, config)
            showToast(options)
            onModalClose(true)
            getNewStock()
            getCAS()
        } catch (error) {
            message.destroy()
            if (!axios.isCancel(error)) {
                setBtnDisabled(false)
            }
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
            <ECPanel confirmed={EC} mpReturned={REC} whReturned={TRC} onAdd={onAddEmptyCans} />
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
                okTxt='Add Empty Cans'
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