import { Tabs } from 'antd';
import { http } from '../../modules/http';
import React, { Fragment, useState, useRef, useCallback, useEffect, useMemo } from 'react';
import Header from './header';
import Dispatches from './tabs/Dispatches';
import CreateDispatch from './tabs/CreateDispatch';
import CreateExternalDispatch from './tabs/CreateExternalDispatch';
import ConfirmModal from '../../components/CustomModal';
import ConfirmMessage from '../../components/ConfirmMessage';
import ReportsDropdown from '../../components/ReportsDropdown';
import { getWarehoseId, TRACKFORM } from '../../utils/constants';
import { resetTrackForm } from '../../utils/Functions';
import { getBatchIdOptions, getDepartmentOptions, getDriverOptions, getVehicleOptions } from '../../assets/fixtures';

const Dispatch = () => {
    const warehouseId = getWarehoseId()
    const [activeTab, setActiveTab] = useState('1')
    const [confirm, setConfirm] = useState(false)
    const [batchList, setBatchList] = useState([])
    const [driverList, setDrivers] = useState([])
    const [departmentList, setDepartmentsList] = useState([])
    const [vehiclesList, setVehiclesList] = useState([])
    const clickRef = useRef('')

    const batchIdOptions = useMemo(() => getBatchIdOptions(batchList), [batchList])
    const driverOptions = useMemo(() => getDriverOptions(driverList), [driverList])
    const vehicleOptions = useMemo(() => getVehicleOptions(vehiclesList), [vehiclesList])
    const departmentOptions = useMemo(() => getDepartmentOptions(departmentList), [departmentList])
    const childProps = useMemo(() => ({ driverList, batchIdOptions, departmentList, driverOptions, departmentOptions, vehicleOptions }),
        [batchIdOptions, driverOptions, departmentOptions, vehicleOptions])

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
                        <TabPane tab="Dispatches" key="1" />
                        <TabPane tab="Create Dispatch" key="2" />
                        <TabPane tab="Create Dispatch (Outside)" key="3" />
                    </Tabs>
                </div>
                {
                    activeTab === '1' ? <Dispatches />
                        : activeTab === '2' ? <CreateDispatch goToTab={handleGoToTab} {...childProps} />
                            : activeTab === '3' ? <CreateExternalDispatch goToTab={handleGoToTab} {...childProps} />
                                : null
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