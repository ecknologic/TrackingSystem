import { Dropdown, Menu } from 'antd';
import React, { useState, useRef } from 'react';
import { FilterIconGrey } from './SVG_Icons';
import CheckboxOption from './CheckboxOption';

const StatusFilter = ({ onChange, filterList }) => {

    const dataRef = useRef({ status: [] })
    const [visible, setVisible] = useState(false)

    const handleSelect = (option, target) => {
        dataRef.current[target].push(option)
        onChange(dataRef.current)
    }

    const handleDeselect = (option, target) => {
        const filtered = dataRef.current[target].filter((item) => item !== option)
        dataRef.current[target] = filtered
        onChange(dataRef.current)
    }

    const menu = () => (
        <Menu className='app-accounts-filter'>
            <Menu.ItemGroup title='Select Status'>
                {
                    filterList.map((item) => {
                        return (
                            <Menu.Item key={item.value}>
                                <CheckboxOption
                                    value={item.value}
                                    option={item.name}
                                    onSelect={(value) => handleSelect(value, 'status')}
                                    onDeselect={(value) => handleDeselect(value, 'status')}
                                />
                            </Menu.Item>
                        )
                    })
                }
            </Menu.ItemGroup>
        </Menu>
    )

    return (
        <Dropdown
            overlay={menu}
            trigger={['click']}
            getPopupContainer={node => node.parentNode}
            visible={visible}
            onVisibleChange={(bool) => setVisible(bool)}
        >
            <div className='fiter-container'>
                <FilterIconGrey />
            </div>
        </Dropdown>
    )
}
export default StatusFilter