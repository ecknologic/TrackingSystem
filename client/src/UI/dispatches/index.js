import { Tabs } from 'antd';
import React, { Fragment, useState, useRef, useCallback, useEffect } from 'react';
import Header from './header';
import Dispatches from './tabs/Dispatches';
import CreateDispatch from './tabs/CreateDispatch';
import CreateExternalDispatch from './tabs/CreateExternalDispatch';
import ConfirmModal from '../../components/CustomModal';
import ConfirmMessage from '../../components/ConfirmMessage';
import ReportsDropdown from '../../components/ReportsDropdown';
import { TRACKFORM } from '../../utils/constants';
import { resetTrackForm } from '../../utils/Functions';

const Dispatch = () => {

    const [activeTab, setActiveTab] = useState('1')
    const [confirm, setConfirm] = useState(false)
    const clickRef = useRef('')

    useEffect(() => {
        resetTrackForm()
    }, [])

    const handleTabClick = (key) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged) {
            clickRef.current = key
            setConfirm(true)
        }
        else setActiveTab(key)
    }

    const handleGoToTab = (key) => {
        setActiveTab(key)
    }

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
                        : activeTab === '2' ? <CreateDispatch goToTab={handleGoToTab} />
                            : activeTab === '3' ? <CreateExternalDispatch goToTab={handleGoToTab} />
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