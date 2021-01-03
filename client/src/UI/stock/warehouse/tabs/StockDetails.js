import React, { useCallback, useEffect, useState } from 'react';
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
import { getWarehoseId, TODAYDATE, TRACKFORM } from '../../../../utils/constants';
import { getASValuesForDB, isEmpty, resetTrackForm, showToast } from '../../../../utils/Functions';
import { validateNumber, validateASValues } from '../../../../utils/validations';

const StockDetails = ({ date }) => {
    const warehouseId = getWarehoseId()
    const [CAS, setCAS] = useState({})
    const [OFD, setOFC] = useState({})
    const [EC, setEC] = useState({})
    const [newStock, setNewStock] = useState({})
    const [arrivedStock, setArrivedStock] = useState([])
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [confirmModal, setConfirmModal] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [modal, setModal] = useState(false)
    const [shake, setShake] = useState(false)

    useEffect(() => {
        const isToday = (date === TODAYDATE)
        getOFD()
        getEC()
        getCAS()

        if (isToday) getNewStock()
        else {
            setNewStock({})
            setArrivedStock([])
        }
    }, [date])

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
        const url = `/warehouse/getEmptyCans/${warehouseId}`
        const { data } = await http.GET(url)
        setEC(data)
    }

    const getNewStock = async () => {
        const url = `/warehouse/getNewStockDetails/1`
        const data = await http.GET(url)
        const { DCDetails } = data || {}
        const arrivedStock = JSON.parse(DCDetails || "[]")
        setNewStock(data)
        setArrivedStock(arrivedStock)
    }

    const getStockDetailsByDC = async (dcNo) => {
        const url = `/warehouse/getDispatchDetailsByDC/${dcNo}`
        const data = await http.GET(url)
        setFormData(data)
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'isDamaged') {
            if (!value) {
                setFormErrors(errors => ({ ...errors, damagedDesc: '', damaged: '' }))
            }
        }

        // Validations
        if (key.includes('Box') || key.includes('can')) {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, stockDetails: error }))
        }
    }

    const onArrivedStockConfirm = () => {
        const dcItem = arrivedStock.find(item => item.isConfirmed === 0)
        if (dcItem) {
            getStockDetailsByDC(dcItem.dcNo)
            setModal(true)
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
                arrivedStock={arrivedStock}
                onConfirm={onArrivedStockConfirm}
            />
            <OFDPanel data={OFD} />
            <DSPanel />
            <div className='empty-cans-header'>
                <span className='title'>Empty Cans details</span>
                <span className='msg'>Empty and damaged cans are not included in correct stock details</span>
            </div>
            <ECPanel data={EC} />
            <ERCPanel />
            <DCPanel />
            <CustomModal
                className={`app-form-modal app-view-modal stock-details-modal ${shake ? 'app-shake' : ''}`}
                visible={modal}
                btnDisabled={btnDisabled}
                onOk={handleArrivedStockConfirm}
                onCancel={handleModalCancel}
                title='Stock Details'
                okTxt='Confirm Stock Received'
                track
            >
                <ArrivedStockForm
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

export default StockDetails