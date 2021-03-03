import { Dropdown, Menu } from 'antd';
import React, { useRef, useState } from 'react';
import { LinesIconGrey } from './SVG_Icons';
import CheckboxOption from './CheckboxOption';
import '../sass/routesDropdown.scss'

const RoutesDropdown = ({ data, onChange, title, keyValue, keyLabel }) => {

    const dataRef = useRef([])
    const [visible, setVisible] = useState(false)

    const handleSelect = (option) => {
        dataRef.current = [...dataRef.current, option]
        onChange(dataRef.current)
    }

    const handleDeselect = (option) => {
        const filtered = dataRef.current.filter((item) => item !== option)
        dataRef.current = filtered
        onChange(filtered)
    }

    const reportsMenu = (
        <Menu>
            <Menu.ItemGroup title={title}>
                {
                    data.map((item) => {
                        return (
                            <Menu.Item key={item[keyValue]}>
                                <CheckboxOption
                                    value={item[keyValue]}
                                    option={item[keyLabel]}
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
            getPopupContainer={node => node.parentNode}
            className='routes-filter-dropdown'
            visible={visible}
            onVisibleChange={(bool) => setVisible(bool)}
        >
            <div>
                <span className='text' >{title}</span>
                <LinesIconGrey />
            </div>
        </Dropdown>
    )
}

export default RoutesDropdown