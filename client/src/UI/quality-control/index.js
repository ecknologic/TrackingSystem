import { Tabs } from 'antd';
import { http } from '../../modules/http';
import React, { Fragment, useState, useRef, useCallback, useEffect, useMemo } from 'react';
import Header from '../../components/ContentHeader';
import InternalQC from './tabs/InternalQC';
import QualityCheck from './tabs/QualityCheck';
import TestedBatches from './tabs/TestedBatches';
import ConfirmModal from '../../components/CustomModal';
import ConfirmMessage from '../../components/ConfirmMessage';
import ReportsDropdown from '../../components/ReportsDropdown';
import { TRACKFORM } from '../../utils/constants';
import { resetTrackForm } from '../../utils/Functions';
import NoContent from '../../components/NoContent';
import { getBatchIdOptions } from '../../assets/fixtures';
import '../../sass/qualityControl.scss'

const QualityControl = () => {
    const [activeTab, setActiveTab] = useState('1')
    const [confirm, setConfirm] = useState(false)
    const [batchList, setBatchList] = useState([])
    const clickRef = useRef('')

    const batchIdOptions = useMemo(() => getBatchIdOptions(batchList), [batchList])
    const childProps = useMemo(() => ({ batchIdOptions }), [batchIdOptions])

    useEffect(() => {
        getBatchsList()
    }, [])

    const getBatchsList = async () => {
        const data = await http.GET('/motherPlant/getBatchNumbers')
        setBatchList(data)
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
                        <TabPane tab="Send Request" key="4" />
                        <TabPane tab="Quality Control (External)" key="5" />
                    </Tabs>
                </div>
                {
                    activeTab === '1' ? <InternalQC />
                        : activeTab === '2' ? <QualityCheck goToTab={handleGoToTab} {...childProps} />
                            : activeTab === '3' ? <TestedBatches goToTab={handleGoToTab} />
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