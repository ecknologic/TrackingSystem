import React, { useState } from 'react';
import { Menu, Dropdown } from 'antd';
import { DDownIcon } from './SVG_Icons';
import '../sass/panelDropdown.scss'

const PanelDropdown = ({ label = 'Label', onSelect = () => { } }) => {
    const [value, setValue] = useState('Today')

    const handleSelect = ({ key }) => {
        setValue(key)
        onSelect(key)
    }

    const menu = (
        <Menu onClick={handleSelect}>
            <Menu.Item key="Today" >
                Today
          </Menu.Item>
            <Menu.Item key="This Week">
                This Week
          </Menu.Item>
            <Menu.Item key="This Month" >
                This Month
          </Menu.Item>
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