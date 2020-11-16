import React, { useEffect, useMemo, useState } from 'react'
import { Menu } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import dashboardIcon12 from '../../assets/images/ic-manage-accounts.svg';
import { getRole, MARKETINGADMIN, WAREHOUSEADMIN } from '../../utils/constants';
import { getSideMenuKey } from '../../utils/Functions'
const { Item } = Menu

const SideMenu = () => {
    const ROLE = getRole()
    const { pathname } = useLocation()
    const history = useHistory()
    const [selected, setSelected] = useState('/dashboard')

    const pattern = /[^\/]*\/[^\/]*/; // regex to match upto second forward slash in url pathname
    const mainPathname = pathname.match(pattern)[0]

    const menu = useMemo(() => getSideMenuKey(pathname), [mainPathname])

    useEffect(() => {
        setSelected(menu)
    }, [menu])

    const handleMenuSelect = ({ key }) => history.push(key)

    const handleMenuSelectByRole = ({ key }) => {
        if (key === '/dashboard') {
            if (ROLE == WAREHOUSEADMIN) history.push('/bibowarehouse')
            else history.push('/addcustomer')
        }
    }

    return (
        <Menu
            id='app-side-menu'
            mode="inline"
            selectedKeys={selected}
        >
            <Item key='/dashboard' onClick={handleMenuSelect}>
                <img src={dashboardIcon12} alt="" />
                <span>Dashboard</span>
            </Item>
            {
                ROLE === WAREHOUSEADMIN ?
                    <Item key='stock' onClick={handleMenuSelect}>
                        <img src={dashboardIcon12} alt="" />
                        <span>Manage Stock</span>
                    </Item>
                    : null
            }
            <Item key='/manage-accounts' onClick={handleMenuSelect}>
                <img src={dashboardIcon12} alt="" />
                <span>Manage Accounts</span>
            </Item>
            {
                ROLE === MARKETINGADMIN ?
                    <Item key='/add-customer' onClick={handleMenuSelect}>
                        <img src={dashboardIcon12} alt="" />
                        <span>Add Customer</span>
                    </Item>
                    : null
            }
            {
                ROLE === MARKETINGADMIN ? <Item key='/customerDashboard' onClick={handleMenuSelect}>
                    <img src={dashboardIcon12} alt="" />
                    <span>Settings</span>
                </Item> : <Item key='reports' onClick={handleMenuSelect}>
                        <img src={dashboardIcon12} alt="" />
                        <span>Reports</span>
                    </Item>
            }
        </Menu>
    )
}

export default SideMenu