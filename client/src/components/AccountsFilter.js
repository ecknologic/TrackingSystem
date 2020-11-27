import { Dropdown, Menu } from 'antd';
import React, { useState, useRef } from 'react';
import { FilterIconGrey } from './SVG_Icons';
import CheckboxOption from './CheckboxOption';
import { businessFilterOptions, statusFilterOptions } from '../assets/fixtures'

const AccountsFilter = ({ onChange }) => {

    const dataRef = useRef({ business: [], status: [] })
    const [visible, setVisible] = useState(false)

    const handleSelect = (option) => {
        if (typeof option === 'string') {
            dataRef.current.business.push(option)
        }
        else dataRef.current.status.push(option)
        onChange(dataRef.current)
    }

    const handleDeselect = (option) => {
        let filtered = []
        if (typeof option === 'string') {
            filtered = dataRef.current.business.filter((item) => item !== option)
            dataRef.current.business = filtered
        }
        else {
            filtered = dataRef.current.status.filter((item) => item !== option)
            dataRef.current.status = filtered
        }
        onChange(dataRef.current)
    }

    const menu = () => (
        <Menu className='app-accounts-filter'>
            <Menu.ItemGroup title='Select Business'>
                {
                    businessFilterOptions.map((item) => {
                        return (
                            <Menu.Item key={item.value}>
                                <CheckboxOption
                                    value={item.value}
                                    option={item.option}
                                    onSelect={handleSelect}
                                    onDeselect={handleDeselect}
                                />
                            </Menu.Item>
                        )
                    })
                }
            </Menu.ItemGroup>
            <Menu.ItemGroup title='Select Status'>
                {
                    statusFilterOptions.map((item) => {
                        return (
                            <Menu.Item key={item.value}>
                                <CheckboxOption
                                    value={item.value}
                                    option={item.option}
                                    onSelect={handleSelect}
                                    onDeselect={handleDeselect}
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
            getPopupContainer={triggerNode => triggerNode.parentNode}
            visible={visible}
            onVisibleChange={(bool) => setVisible(bool)}
        >
            <div className='fiter-container'>
                <FilterIconGrey />
            </div>
        </Dropdown>
    )
}
export default AccountsFilter