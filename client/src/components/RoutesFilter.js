import { Dropdown, Menu } from 'antd';
import React, { useMemo, useState } from 'react';
import { LinesIconGrey } from './SVG_Icons';
import CheckboxOption from './CheckboxOption';
import '../sass/routesDropdown.scss'

const RoutesDropdown = ({ routes, onChange }) => {

    const [data, _] = useState([])
    const [visible, setVisible] = useState(false)

    const handleSelect = (option) => {
        data.push(option)
        onChange(data)
    }

    const handleDeselect = (option) => {
        data.filter((item) => item !== option)
        onChange(data)
    }

    const reportsMenu = useMemo(() => (
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
    ), [routes])

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