import React, { useState } from 'react';
import PanelDropdown from './PanelDropdown';
import ReportsDropdown from './ReportsDropdown';

const DashboardPanelHeader = ({ title }) => {
    const [show, setShow] = useState('Today')

    return (
        <div className='dashboard-panel-header'>
            <div className='primary'>
                <div className='head-container'>
                    <div className='title'>
                        {title} {show}
                    </div>
                    <div className='select-options'>
                        <div className='option'>
                            <PanelDropdown label='Show' />
                        </div>
                        <div className='option'>
                            <PanelDropdown label='Shift Type' />
                        </div>
                    </div>
                </div>
                <div className='date-display'>
                    <span>21/01/2021 2:45 PM</span>
                </div>
            </div>
            <div className='secondary'>
                <ReportsDropdown />
            </div>
        </div>
    )
}

export default DashboardPanelHeader