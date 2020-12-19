import { Tabs } from 'antd';
import { http } from '../../modules/http';
import React, { Fragment, useState, useRef, useCallback, useEffect, useMemo } from 'react';
import Header from './header';
import RequestMaterial from './tabs/RequestMaterial';
import ReceivedMaterials from './tabs/ReceivedMaterials';
import RequestedMaterialStatus from './tabs/RequestedMaterialStatus';
import AddMaterials from './tabs/AddReceivedMaterials';
import ConfirmModal from '../../components/CustomModal';
import ConfirmMessage from '../../components/ConfirmMessage';
import ReportsDropdown from '../../components/ReportsDropdown';
import { getWarehoseId, TRACKFORM } from '../../utils/constants';
import { resetTrackForm } from '../../utils/Functions';
import { getMaterialOpitons, getVendorOptions } from '../../assets/fixtures';
import NoContent from '../../components/NoContent';

const Dispatch = () => {
    const warehouseId = getWarehoseId()
    const [activeTab, setActiveTab] = useState('1')
    const [confirm, setConfirm] = useState(false)
    const [batchList, setBatchList] = useState([])
    const [driverList, setDrivers] = useState([])
    const [departmentList, setDepartmentsList] = useState([])
    const [vehiclesList, setVehiclesList] = useState([])
    const clickRef = useRef('')

    const materialOptions = useMemo(() => getMaterialOpitons(), [])
    const vendorOptions = useMemo(() => getVendorOptions(), [])
    // const driverOptions = useMemo(() => getDriverOptions(driverList), [driverList])
    // const vehicleOptions = useMemo(() => getVehicleOptions(vehiclesList), [vehiclesList])
    // const departmentOptions = useMemo(() => getDepartmentOptions(departmentList), [departmentList])
    const childProps = useMemo(() => ({ materialOptions, vendorOptions }), [materialOptions, vendorOptions])

    useEffect(() => {
        getBatchsList()
        getDriverList()
        getVehicleDetails()
        getDepartmentsList()
    }, [])

    const getBatchsList = async () => {
        const data = await http.GET('/motherPlant/getBatchNumbers')
        setBatchList(data)
    }

    const getDriverList = async () => {
        const data = await http.GET(`/warehouse/getdriverDetails/${warehouseId}`)
        setDrivers(data)
    }

    const getDepartmentsList = async () => {
        const data = await http.GET('/motherPlant/getDepartmentsList?departmentType=warehouse')
        setDepartmentsList(data)
    }

    const getVehicleDetails = async () => {
        const data = await http.GET('/motherPlant/getVehicleDetails')
        setVehiclesList(data)
    }

    const handleTabClick = (key) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged) {
            clickRef.current = key
            setConfirm(true)
        }
        else setActiveTab(key)
    }

    const handleGoToTab = useCallback((key) => setActiveTab(key), [])
    const handleConfirmCancel = useCallback(() => setConfirm(false), [])
    const handleConfirmOk = useCallback(() => {
        setConfirm(false)
        resetTrackForm()
        const value = clickRef.current
        setActiveTab(value)
    }, [])

    return (
        <Fragment>
            <Header />
            <div className='stock-manager-content dispatches-content'>
                <div className='tabs-container stock-manager-tabs'>
                    <Tabs
                        tabBarExtraContent={<ReportsDropdown />}
                        activeKey={activeTab}
                        onTabClick={handleTabClick}
                    >
                        <TabPane tab="Materials Request" key="1" />
                        <TabPane tab="Requested Material Status" key="2" />
                        <TabPane tab="Add Received Materials" key="3" />
                        <TabPane tab="Received Materials" key="4" />
                        <TabPane tab="Current Stock" key="5" />
                    </Tabs>
                </div>
                {
                    activeTab === '1' ? <RequestMaterial goToTab={handleGoToTab} {...childProps} />
                        : activeTab === '2' ? <RequestedMaterialStatus />
                            : activeTab === '3' ? <AddMaterials />
                                : activeTab === '4' ? <ReceivedMaterials />
                                    : <NoContent content='Design is in progress' />
                }
            </div>
            <ConfirmModal
                visible={confirm}
                onOk={handleConfirmOk}
                onCancel={handleConfirmCancel}
                title='Are you sure to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </ConfirmModal>
        </Fragment>
    )
}
const { TabPane } = Tabs;
export default Dispatch