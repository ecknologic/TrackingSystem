import axios from 'axios';
import { Tabs } from 'antd';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import Dashboard from './tabs/Routes';
import { http } from '../../modules/http';
import CreateRoute from './tabs/CreateRoute';
import useUser from '../../utils/hooks/useUser';
import { SUPERADMIN } from '../../utils/constants';
import SimpleHeader from '../../components/SimpleHeader';
import ContentHeader from '../../components/ContentHeader';
import { getDepartmentOptions } from '../../assets/fixtures';
import '../../sass/products.scss';

const Transport = () => {
    const { ROLE } = useUser()
    const [activeTab, setActiveTab] = useState('1')
    const [reFetch, setreFetch] = useState(false)
    const [departmentList, setDepartmentList] = useState([])
    const [isFetched, setIsFetched] = useState(false)
    const departmentOptions = useMemo(() => getDepartmentOptions(departmentList), [departmentList])

    const isSuperAdmin = useMemo(() => ROLE === SUPERADMIN, [ROLE])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        return () => {
            http.ABORT(source)
        }
    }, [])

    const getDepartmentList = async () => {
        const url = 'bibo/getAllDepartmentsList'

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
            { isSuperAdmin ? <SimpleHeader title='Routes' /> : <ContentHeader title='Routes' />}
            <div className='employee-content'>
                <div className='app-tabs-container'>
                    <Tabs
                        onChange={handleTabClick}
                        activeKey={activeTab}
                    >
                        <TabPane tab="Routes" key="1">
                            <Dashboard departmentOptions={departmentOptions} isFetched={isFetched} fetchList={fetchList} reFetch={reFetch} />
                        </TabPane>
                        <TabPane tab="Add New Route" key="2">
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