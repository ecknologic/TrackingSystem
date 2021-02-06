import axios from 'axios';
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
    const [isFetched, setIsFetched] = useState(false)
    const departmentOptions = useMemo(() => getDepartmentOptions(departmentList), [departmentList])

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        return () => {
            http.ABORT(source)
        }
    }, [])

    const getDepartmentList = async () => {
        const url = '/bibo/getAllDepartmentsList'

        try {
            const data = await http.GET(axios, url, config)
            setDepartmentList(data)
        } catch (error) { }
    }

    const handleGoToTab = useCallback((key) => {
        setreFetch(!reFetch)
        setActiveTab(key)
    }, [reFetch])

    const handleTabClick = (key) => {
        setActiveTab(key)
    }

    const fetchList = async () => {
        if (!isFetched) {
            const p1 = getDepartmentList()
            await Promise.all([p1])
            setIsFetched(true)
        }
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
                            <Dashboard departmentOptions={departmentOptions} isFetched={isFetched} fetchList={fetchList} reFetch={reFetch} />
                        </TabPane>
                        <TabPane tab="Create New Route" key="2">
                            <CreateRoute departmentOptions={departmentOptions} fetchList={fetchList} goToTab={handleGoToTab} />
                        </TabPane>
                    </Tabs>
                </div>
            </div >
        </Fragment>
    )
}
const { TabPane } = Tabs;
export default Transport