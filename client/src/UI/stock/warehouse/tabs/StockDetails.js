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
import { resetTrackForm, showToast } from '../../../../utils/Functions';
import { validateNumber } from '../../../../utils/validations';
import ArrivedStockForm from '../forms/ArrivedStock';

const StockDetails = ({ date }) => {
    const warehouseId = getWarehoseId()
    const [CAS, setCAS] = useState({})
    const [OFD, setOFC] = useState({})
    const [EC, setEC] = useState({})
    const [newStock, setNewStock] = useState({})
    const [dcDetails, setdCDetails] = useState([])
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
        const { DCDetails } = data || {}
        const dcDetails = JSON.parse(JSON.stringify(DCDetails)) || []
        setNewStock(data)
        setdCDetails(dcDetails)
    }

    const getStockDetailsByDC = async (dcNo) => {
        const url = `/warehouse/getDispatchDetailsByDC/${dcNo}`
        const data = await http.GET(url)
        setFormData(data)
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
        if (key.includes('Box') || key.includes('can')) {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, stockDetails: error }))
        }
    }

    const onArrivedStockConfirm = () => {
        const dcItem = dcDetails.find(item => item.isConfirmed === 0)
        if (dcItem) {
            getStockDetailsByDC(dcItem.dcNo)
            setModal(true)
        }
        // getStockDetailsByDC('DC-188')
    }

    const handleArrivedStockConfirm = async () => {
        // const formErrors = validateASValues(formData)

        // if (!isEmpty(formErrors)) {
        //     setShake(true)
        //     setTimeout(() => setShake(false), 820)
        //     setFormErrors(formErrors)
        //     return
        // }

        // const dcValues = getASValuesForDB(formData)
        // const customerOrderId = customerOrderIdRef.current

        const { dcNo, isDamaged = false, total1LBoxes, total20LCans, total250MLBoxes, total500MLBoxes,
            damaged20Lcans = 0, damaged1LBoxes = 0, damaged500MLBoxes = 0, damaged250MLBoxes = 0 } = formData

        let url = '/warehouse/confirmStockRecieved'
        const body = {
            dcNo, damaged20Lcans, isDamaged, damaged1LBoxes, damaged500MLBoxes, damaged250MLBoxes,
            total1LBoxes, total20LCans, total250MLBoxes, total500MLBoxes
        }

        try {
            setBtnDisabled(true)
            showToast('DC', 'loading')
            await http.POST(url, body)
            showToast('DC', 'success')
            onModalClose(true)
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