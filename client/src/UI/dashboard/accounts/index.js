import axios from 'axios';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { http } from '../../../modules/http';
import SalesResults from './panels/SalesResults';
import TotalBusiness from './panels/TotalBusiness';
import Header from '../../../components/ContentHeader';
import CustomersOverview from './panels/CustomersOverview';
import GeneratedInvoiceOverview from './panels/GeneratedInvoices';
import UnclearedInvoiceOverview from './panels/UnclearedInvoices';
import { getDepartmentOptions, getWarehouseOptions, getDepartmentMenu } from '../../../assets/fixtures';
import ProductionResults from '../super-admin/panels/ProductionResults';

const AccountsAdminDashboard = () => {
    const [warehouseList, setWarehouseList] = useState([])
    const [motherplantList, setMotherplantList] = useState([])

    const motherplantOptions = useMemo(() => getDepartmentOptions(motherplantList), [motherplantList])
    const warehouseMenu = useMemo(() => getDepartmentMenu(warehouseList), [warehouseList])
    const motherplantMenu = useMemo(() => getDepartmentMenu(motherplantList), [motherplantList])
    const warehouseOptions = useMemo(() => getWarehouseOptions(warehouseList), [warehouseList])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getMotherplantList()
        getWarehouseList()
    }, [])

    const getMotherplantList = async () => {
        const url = 'bibo/getDepartmentsList?departmentType=MotherPlant&hasAll=true'

        try {
            const data = await http.GET(axios, url, config)
            setMotherplantList(data)
        } catch (error) { }
    }

    const getWarehouseList = async () => {
        const url = 'bibo/getDepartmentsList?departmentType=warehouse&hasAll=true'

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
                    <SalesResults depOptions={warehouseOptions} />
                    <div className='dashboard-results-card'></div>
                </div>
                <div className='equal-panels-container'>
                    <TotalBusiness warehouseList={warehouseList} depMenu={warehouseMenu} />
                </div>
                <div className='equal-panels-container'>
                    <GeneratedInvoiceOverview />
                    <UnclearedInvoiceOverview />
                </div>
                <CustomersOverview />
            </div>
        </Fragment>
    )
}

export default AccountsAdminDashboard