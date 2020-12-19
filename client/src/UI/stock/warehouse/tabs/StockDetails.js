import React, { useEffect, useState } from 'react';
import CASPanel from '../../../../components/CASPanel';
import DCPanel from '../../../../components/DCPanel';
import DSPanel from '../../../../components/DSPanel';
import ECPanel from '../../../../components/ECPanel';
import ERCPanel from '../../../../components/ERCPanel';
import OFDPanel from '../../../../components/OFDPanel';
import { http } from '../../../../modules/http';
import { getWarehoseId, TODAYDATE } from '../../../../utils/constants';

const StockDetails = ({ date }) => {
    const warehouseId = getWarehoseId()
    const [CAS, setCAS] = useState({})
    const [OFD, setOFC] = useState({})
    const [EC, setEC] = useState({})
    const [newStock, setNewStock] = useState({})

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

    return (
        <div className='stock-details-container'>
            <CASPanel data={CAS} newStock={newStock} />
            <OFDPanel data={OFD} />
            <DSPanel />
            <div className='empty-cans-header'>
                <span className='title'>Empty Cans details</span>
                <span className='msg'>Empty and damaged cans are not included in correct stock details</span>
            </div>
            <ECPanel data={EC} />
            <ERCPanel />
            <DCPanel />
        </div>
    )
}

export default StockDetails