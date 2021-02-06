import React, { useState } from 'react';
import { Menu, Dropdown } from 'antd';
import { DDownIcon } from './SVG_Icons';
import '../sass/panelDropdown.scss'
const fn = () => { }

const PanelDropdown = ({ label, initValue, onSelect = fn, options = [] }) => {
    const [value, setValue] = useState(() => initValue)

    const handleSelect = ({ key }) => {
        setValue(key)
        onSelect(key)
    }

    const menu = (
        <Menu onClick={handleSelect}>
            {options}
        </Menu>
    );

    return (
        <div>
            <Dropdown
                overlay={menu}
                trigger='click'
                className='panel-drop-down-select'
                getPopupContainer={node => node.parentNode}
            >
                <div>
                    <div className='text-container'>
                        <span className='label' onClick={(e) => e.stopPropagation()}>{label}:</span>
                        <span className='selected-item'>{value}</span>
                    </div>
                    <DDownIcon className='down' />
                </div>
            </Dropdown>
        </div>
    )
}

export default PanelDropdown