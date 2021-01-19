import { Tabs } from 'antd';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import Dashboard from './tabs/Routes';
import { http } from '../../modules/http';
import CreateRoute from './tabs/CreateRoute';
import Header from '../../components/SimpleHeader';
import { getDepartmentOptions } from '../../assets/fixtures';
import '../../sass/products.scss';

const Transport = () => {

    const [activeTab, setActiveTab] = useState('1')
    const [reFetch, setreFetch] = useState(false)
    const [departmentList, setDepartmentList] = useState([])
    const departmentOptions = useMemo(() => getDepartmentOptions(departmentList), [departmentList])

    useEffect(() => {
        getDepartmentList()
    }, [])

    const getDepartmentList = async () => {
        const url = '/motherplant/getAllDepartmentsList'

        const data = await http.GET(url)
        setDepartmentList(data)
    }

    const handleGoToTab = useCallback((key) => {
        setreFetch(!reFetch)
        setActiveTab(key)
    }, [reFetch])

    const handleTabClick = (key) => {
        setActiveTab(key)
    }

    return (
        <Fragment>
            <Header title='Routes' />
            <div className='employee-content'>
                <div className='app-tabs-container'>
                    <Tabs
                        onChange={handleTabClick}
                        activeKey={activeTab}
                    >
                        <TabPane tab="Routes" key="1">
                            <Dashboard departmentOptions={departmentOptions} reFetch={reFetch} />
                        </TabPane>
                        <TabPane tab="Create New Route" key="2">
                            <CreateRoute departmentOptions={departmentOptions} goToTab={handleGoToTab} />
                        </TabPane>
                    </Tabs>
                </div>
            </div >
        </Fragment >
    )
}
const { TabPane } = Tabs;
export default Transport