import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import PanelHeader from '../../../../components/PanelHeader';
import { TODAYDATE as d } from '../../../../utils/constants';
import TotalRevenueCard from '../../../../components/TotalRevenueCard';
const options = { startDate: d, endDate: d, fromStart: true, departmentId: 'All', type: 'Till Now' }

const TotalBusiness = ({ warehouseList, depMenu }) => {
    const [business, setBusiness] = useState([])
    const [opData, setOpData] = useState(() => options)

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getTotalBusiness(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getTotalBusiness = async ({ startDate, endDate, fromStart, departmentId, type }) => {
        const url = `motherPlant/getTotalRevenue?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}&departmentId=${departmentId}&type=${type}`

        try {
            const data = await http.GET(axios, url, config)
            setBusiness(data)
        } catch (error) { }
    }

    const handleOperation = useCallback((data) => {
        let newData = {}
        newData = { ...opData, ...data }
        if (data.departmentId) {
            const departmentId = warehouseList.find(item => item.departmentName === data.departmentId).departmentId
            newData = { ...opData, departmentId }
        }
        getTotalBusiness(newData)
        setOpData(newData)
    }, [opData, warehouseList])


    return (
        <div className='total-business-panel'>
            <div className='header'>
                <PanelHeader title='Total Business' depMenu={depMenu} onSelect={handleOperation} showShow showDep depName='Warehouse' />
            </div>
            <TotalRevenueCard data={business} />
        </div>
    )
}

export default TotalBusiness