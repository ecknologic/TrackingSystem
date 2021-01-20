import { Tabs } from 'antd';
import React, { Fragment, useState, useCallback } from 'react';
import InternalQC from './tabs/InternalQC';
import QualityCheck from './tabs/QualityCheck';
import ProductionQC from './tabs/ProductionQC';
import ProductionTB from './tabs/ProductionTB';
import TestedBatches from './tabs/TestedBatches';
import ScrollUp from '../../components/ScrollUp';
import NoContent from '../../components/NoContent';
import Header from '../../components/ContentHeader';
import ReportsDropdown from '../../components/ReportsDropdown';
import '../../sass/qualityControl.scss'

const QualityControl = () => {
    const [activeTab, setActiveTab] = useState('1')
    const [reFetch, setreFetch] = useState(false)

    const handleGoToTab = useCallback((key) => {
        setreFetch(!reFetch)
        setActiveTab(key)
    }, [reFetch])

    return (
        <Fragment>
            <ScrollUp dep={reFetch} />
            <Header />
            <div className='quality-check-content'>
                <div className='app-tabs-container'>
                    <Tabs
                        tabBarExtraContent={<ReportsDropdown />}
                        activeKey={activeTab}
                        onChange={(key) => setActiveTab(key)}
                    >
                        <TabPane tab="Quality Control (Internal)" key="1">
                            <InternalQC reFetch={reFetch} />
                        </TabPane>
                        <TabPane tab="Quality Check" key="2">
                            <QualityCheck goToTab={handleGoToTab} />
                        </TabPane>
                        <TabPane tab="Tested Batches" key="3">
                            <TestedBatches reFetch={reFetch} />
                        </TabPane>
                        <TabPane tab="Quality Check (Production)" key="4">
                            <ProductionQC goToTab={handleGoToTab} />
                        </TabPane>
                        <TabPane tab="Tested Batches (Production)" key="5">
                            <ProductionTB reFetch={reFetch} />
                        </TabPane>
                        <TabPane tab="Quality Control (External)" key="6" disabled>
                            <NoContent content='Design is in progress' />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </Fragment>
    )
}
const { TabPane } = Tabs;
export default QualityControl