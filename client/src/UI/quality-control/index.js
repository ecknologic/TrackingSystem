import { Tabs } from 'antd';
import React, { Fragment, useState, useCallback } from 'react';
import Header from '../../components/ContentHeader';
import InternalQC from './tabs/InternalQC';
import QualityCheck from './tabs/QualityCheck';
import ProductionQC from './tabs/ProductionQC';
import TestedBatches from './tabs/TestedBatches';
import ReportsDropdown from '../../components/ReportsDropdown';
import NoContent from '../../components/NoContent';
import ProductionTB from './tabs/ProductionTB';
import '../../sass/qualityControl.scss'

const QualityControl = () => {
    const [activeTab, setActiveTab] = useState('1')

    const handleGoToTab = useCallback((key) => setActiveTab(key), [])

    return (
        <Fragment>
            <Header />
            <div className='quality-check-content'>
                <div className='app-tabs-container'>
                    <Tabs
                        tabBarExtraContent={<ReportsDropdown />}
                        activeKey={activeTab}
                        onChange={(key) => setActiveTab(key)}
                    >
                        <TabPane tab="Quality Control (Internal)" key="1">
                            <InternalQC />
                        </TabPane>
                        <TabPane tab="Quality Check" key="2">
                            <QualityCheck goToTab={handleGoToTab} />
                        </TabPane>
                        <TabPane tab="Tested Batches" key="3">
                            <TestedBatches />
                        </TabPane>
                        <TabPane tab="Quality Check (Production)" key="4">
                            <ProductionQC goToTab={handleGoToTab} />
                        </TabPane>
                        <TabPane tab="Tested Batches (Production)" key="5">
                            <ProductionTB />
                        </TabPane>
                        <TabPane tab="Quality Control (External)" key="6">
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