import { Tabs } from 'antd';
import React, { Fragment, useState, useRef, useCallback } from 'react';
import Header from '../../components/ContentHeader';
import InternalQC from './tabs/InternalQC';
import QualityCheck from './tabs/QualityCheck';
import ProductionQC from './tabs/ProductionQC';
import TestedBatches from './tabs/TestedBatches';
import { TRACKFORM } from '../../utils/constants';
import ConfirmModal from '../../components/CustomModal';
import ConfirmMessage from '../../components/ConfirmMessage';
import ReportsDropdown from '../../components/ReportsDropdown';
import { resetTrackForm } from '../../utils/Functions';
import NoContent from '../../components/NoContent';
import '../../sass/qualityControl.scss'
import ProductionTB from './tabs/ProductionTB';

const QualityControl = () => {
    const [activeTab, setActiveTab] = useState('1')
    const [confirm, setConfirm] = useState(false)
    const clickRef = useRef('')

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
            <div className='stock-manager-content qc-content'>
                <div className='tabs-container stock-manager-tabs'>
                    <Tabs
                        tabBarExtraContent={<ReportsDropdown />}
                        activeKey={activeTab}
                        onTabClick={handleTabClick}
                    >
                        <TabPane tab="Quality Control (Internal)" key="1" />
                        <TabPane tab="Quality Check" key="2" />
                        <TabPane tab="Tested Batches" key="3" />
                        <TabPane tab="Quality Check (Production)" key="4" />
                        <TabPane tab="Tested Batches (Production)" key="5" />
                        <TabPane tab="Quality Control (External)" key="6" />
                    </Tabs>
                </div>
                {
                    activeTab === '1' ? <InternalQC />
                        : activeTab === '2' ? <QualityCheck goToTab={handleGoToTab} />
                            : activeTab === '3' ? <TestedBatches />
                                : activeTab === '4' ? <ProductionQC goToTab={handleGoToTab} />
                                    : activeTab === '5' ? <ProductionTB />
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
export default QualityControl