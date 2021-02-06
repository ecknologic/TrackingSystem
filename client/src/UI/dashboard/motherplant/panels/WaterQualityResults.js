import React from 'react';
import PanelHeader from '../../../../components/PanelHeader';
import QualityResultCard from '../../../../components/QualityResultCard';

const WaterQualityResults = () => {

    return (
        <>
            <PanelHeader title='Water Quality Testing Results' hideShow hideShift />
            <div className='panel-body quality-testing-panel'>
                <QualityResultCard batchNo='BI-1234-20' shift='Morning' />
                <QualityResultCard batchNo='BI-1234-20' shift='Evening' />
                <QualityResultCard batchNo='BI-1234-20' shift='Night' />
            </div>
        </>
    )
}

export default WaterQualityResults