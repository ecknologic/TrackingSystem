import axios from 'axios';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { http } from '../../../modules/http';
import SalesResults from './panels/SalesResults';
import TotalBusiness from './panels/TotalBusiness';
import Header from '../../../components/ContentHeader';
import InvoiceOverview from './panels/InvoiceOverview';
import CustomersOverview from './panels/CustomersOverview';
import ProductionResults from './panels/ProductionResults';
import WaterQualityResults from './panels/WaterQualityResults';
import { getDepartmentOptions, getWarehouseOptions, getDepartmentMenu } from '../../../assets/fixtures';

const SuperAdminDashboard = () => {
    const [warehouseList, setWarehouseList] = useState([])
    const [motherplantList, setMotherplantList] = useState([])

    const motherplantOptions = useMemo(() => getDepartmentOptions(motherplantList), [motherplantList])
    const motherplantMenu = useMemo(() => getDepartmentMenu(motherplantList), [motherplantList])
    const warehouseOptions = useMemo(() => getWarehouseOptions(warehouseList), [warehouseList])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getMotherplantList()
        getWarehouseList()
    }, [])

    const getMotherplantList = async () => {
        const url = '/bibo/getDepartmentsList?departmentType=MotherPlant&hasAll=true'

        try {
            const data = await http.GET(axios, url, config)
            setMotherplantList(data)
        } catch (error) { }
    }

    const getWarehouseList = async () => {
        const url = '/bibo/getDepartmentsList?departmentType=warehouse&hasAll=true'

        try {
            const data = await http.GET(axios, url, config)
            setWarehouseList(data)
        } catch (error) { }
    }

    return (
        <Fragment>
            <Header />
            <div className='dashboard-content'>
                <div className='equal-panels-container'>
                    <ProductionResults depOptions={motherplantOptions} />
                    <SalesResults depOptions={warehouseOptions} />
                </div>
                <CustomersOverview />
                <div className='equal-panels-container'>
                    <TotalBusiness />
                    <InvoiceOverview />
                </div>
                <WaterQualityResults depMenu={motherplantMenu} motherplantList={motherplantList} />
            </div>
        </Fragment>
    )
}

export default SuperAdminDashboard