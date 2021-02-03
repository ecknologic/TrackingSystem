import React, { useState } from 'react';
import PanelDropdown from './PanelDropdown';
import ReportsDropdown from './ReportsDropdown';

const PanelHeader = ({ title, hideShow, hideShift }) => {
    const [show, setShow] = useState('Today')

    return (
        <div className='panel-header'>
            <div className='primary'>
                <div className='head-container'>
                    <div className='title'>
                        {title} {!hideShow && show}
                    </div>
                    <div className='select-options'>
                        {
                            hideShow ? null
                                : (
                                    <div className='option'>
                                        <PanelDropdown label='Show' />
                                    </div>
                                )
                        }
                        {
                            hideShift ? null
                                : (
                                    <div className='option'>
                                        <PanelDropdown label='Shift Type' />
                                    </div>
                                )
                        }
                    </div>
                </div>
                <div className='date-display'>
                    <span>21/01/2021 2:45 PM</span>
                </div>
            </div>
            <div className='secondary'>
                <ReportsDropdown inverse />
            </div>
        </div>
    )
}

export default PanelHeader