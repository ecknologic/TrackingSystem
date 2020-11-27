import { Dropdown, Menu } from 'antd';
import React, { useRef, useState } from 'react';
import { LinesIconGrey } from './SVG_Icons';
import CheckboxOption from './CheckboxOption';
import '../sass/routesDropdown.scss'

const RoutesDropdown = ({ routes, onChange }) => {

    const dataRef = useRef([])
    const [visible, setVisible] = useState(false)

    const handleSelect = (option) => {
        dataRef.current.push(option)
        onChange(dataRef.current)
    }

    const handleDeselect = (option) => {
        const filtered = dataRef.current.filter((item) => item !== option)
        dataRef.current = filtered
        onChange(filtered)
    }

    const reportsMenu = (
        <Menu>
            <Menu.ItemGroup title='Select Routes'>
                {
                    routes.map((item) => {
                        return (
                            <Menu.Item key={item.RouteId}>
                                <CheckboxOption
                                    value={item.RouteId}
                                    option={item.RouteName}
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
            overlay={reportsMenu}
            trigger={['click']}
            getPopupContainer={triggerNode => triggerNode.parentNode}
            className='routes-filter-dropdown'
            visible={visible}
            onVisibleChange={(bool) => setVisible(bool)}
        >
            <div>
                <span className='text' >Select Routes</span>
                <LinesIconGrey />
            </div>
        </Dropdown>
    )
}

export default RoutesDropdown