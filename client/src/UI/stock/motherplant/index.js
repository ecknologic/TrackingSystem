import { Tabs } from 'antd';
import React, { Fragment, useMemo, useRef, useCallback, useState } from 'react';
import Header from './header';
import StockDetails from './tabs/StockDetails';
import Production from './tabs/Production';
import ReportsDropdown from '../../../components/ReportsDropdown';
import ConfirmModal from '../../../components/CustomModal';
import ConfirmMessage from '../../../components/ConfirmMessage';
import { TODAYDATE, TRACKFORM } from '../../../utils/constants';
import DatePickerPanel from '../../../components/DatePickerPanel';
import { resetTrackForm } from '../../../utils/Functions';

const MotherplantStock = () => {

    const [activeTab, setActiveTab] = useState('1')
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const [confirm, setConfirm] = useState(false)
    const clickRef = useRef('')

    const handleDateChange = (date) => {
        setSelectedDate(date)
    }

    const handleGoToTab = (key) => {
        setActiveTab(key)
    }

    const handleTabClick = (key) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged) {
            clickRef.current = key
            setConfirm(true)
        }
        else setActiveTab(key)
    }

    const showDatePicker = useMemo(() => {
        return activeTab === '1'
    }, [activeTab])

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
            <div className='stock-manager-content'>
                <div className='tabs-container stock-manager-tabs'>
                    <Tabs
                        tabBarExtraContent={<ReportsDropdown />}
                        onTabClick={handleTabClick}
                        activeKey={activeTab}
                    >
                        <TabPane tab="Stock Details" key="1" />
                        <TabPane tab="Damaged Stock" key="2" />
                        <TabPane tab="Production" key="3" />
                        <TabPane tab="Quality Control (Internal)" key="4" />
                    </Tabs>
                </div>
                {
                    showDatePicker && (
                        <div className='date-picker-panel'>
                            <DatePickerPanel onChange={handleDateChange} />
                        </div>
                    )
                }
                {
                    activeTab === '1' ? <StockDetails goToTab={handleGoToTab} date={selectedDate} />
                        : activeTab === '2' ? null
                            : activeTab === '3' ? <Production />
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
export default MotherplantStock