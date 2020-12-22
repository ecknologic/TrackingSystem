import React, { useCallback, useEffect, useState } from 'react';
import CASPanel from '../../../../components/CASPanel';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import CustomModal from '../../../../components/CustomModal';
import ConfirmModal from '../../../../components/CustomModal';
import DCPanel from '../../../../components/DCPanel';
import DSPanel from '../../../../components/DSPanel';
import ECPanel from '../../../../components/ECPanel';
import ERCPanel from '../../../../components/ERCPanel';
import OFDPanel from '../../../../components/OFDPanel';
import { http } from '../../../../modules/http';
import { getWarehoseId, TODAYDATE, TRACKFORM } from '../../../../utils/constants';
import { resetTrackForm } from '../../../../utils/Functions';
import ArrivedStockForm from '../forms/ArrivedStock';

const StockDetails = ({ date }) => {
    const warehouseId = getWarehoseId()
    const [CAS, setCAS] = useState({})
    const [OFD, setOFC] = useState({})
    const [EC, setEC] = useState({})
    const [newStock, setNewStock] = useState({})
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [confirmModal, setConfirmModal] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [modal, setModal] = useState(false)
    const [shake, setShake] = useState(false)

    useEffect(() => {
        getCAS()
    }, [])

    useEffect(() => {
        const isToday = (date === TODAYDATE)
        getOFD()
        getEC()

        if (isToday) getNewStock()
        else setNewStock({})

    }, [date])

    const getCAS = async () => {
        const url = `warehouse/currentActiveStockDetails?warehouseId=${warehouseId}`
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
        setNewStock(data)
    }

    const handleChange = () => {

    }

    const onArrivedStockConfirm = () => {
        setFormData(newStock)
        setModal(true)
    }

    const handleArrivedStockConfirm = () => {

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

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false);
        resetTrackForm()
        onModalClose()
    }, [])

    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])
    const handleModalCancel = useCallback(() => onModalClose(), [])

    return (
        <div className='stock-details-container'>
            <CASPanel data={CAS} newStock={newStock} onConfirm={onArrivedStockConfirm} />
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
                className={`app-form-modal stock-details-modal ${shake ? 'app-shake' : ''}`}
                visible={modal}
                btnDisabled={btnDisabled}
                onOk={handleArrivedStockConfirm}
                onCancel={handleModalCancel}
                title='Stock Details'
                okTxt='Confirm Stock Received'
                track
            >
                <ArrivedStockForm
                    track
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