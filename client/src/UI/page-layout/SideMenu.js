import React, { useEffect, useState } from 'react'
import { Menu } from 'antd';
import { Link, useHistory, useLocation } from 'react-router-dom';
import dashboardIcon from '../../assets/images/ic-manage-users.svg';
import dashboardIcon12 from '../../assets/images/ic-manage-accounts.svg';
import { MARKETINGADMIN, ROLE, WAREHOUSEADMIN } from '../../utils/constants';
import { getSideMenu } from '../../utils/Functions'

const { Item } = Menu

const SideMenu = () => {
    const { pathname } = useLocation()
    const history = useHistory()
    const [menu, setMenu] = useState('dashboard')

    useEffect(() => {
        const menu = getSideMenu(pathname)
        setMenu(menu)
    }, [])

    const handleMenuSelect = (event) => {
        const { key } = event
        setMenu(key)
        history.push(key)
    }

    const handleMenuSelectByAuth = ({ key }) => {
        setMenu(key)
        if (key === 'dashboard') {
            if (ROLE == WAREHOUSEADMIN) history.push('/bibowarehouse')
            else history.push('/addcustomer')
        }
    }

    return (
        <Menu
            id='app-side-menu'
            mode="inline"
            selectedKeys={menu}
        >
            <Item key='dashboard' onClick={handleMenuSelectByAuth}>
                <img src={dashboardIcon12} alt="" />
                <span>Dashboard</span>
            </Item>
            {
                ROLE == WAREHOUSEADMIN ?
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
                ROLE == MARKETINGADMIN ?
                    <Item key='/addcustomer' onClick={handleMenuSelect}>
                        <img src={dashboardIcon12} alt="" />
                        <span>Add Customer</span>
                    </Item>
                    : null
            }
            {
                ROLE == MARKETINGADMIN ? <Item key='/customerDashboard' onClick={handleMenuSelect}>
                    <img src={dashboardIcon12} alt="" />
                    <span>Settings</span>
                </Item> : <Item key='reports' onClick={handleMenuSelect}>
                        <img src={dashboardIcon12} alt="" />
                        <span>Reports</span>
                    </Item>
            }
            {/* <Item key="5" key="sub5"><Link to="/manageaccount"><span><img src={dashboardIcon12} alt="" /></span> <span>Manage Stock</span></Link></Item> */}
            {/* <SubMenu key="sub1" icon={<UserOutlined />} title="Dashboard">
                                <Item key="1">option1</Item>
                                <Item key="2">option2</Item>
                                <Item key="3">option3</Item>
                                <Item key="4">option4</Item>
                            </SubMenu> */}
            {/* <SubMenu key="sub2" icon={<LaptopOutlined />} title="Manage Stock">
                                <Item key="5">option5</Item>
                                <Item key="6">option6</Item>
                                <Item key="7">option7</Item>
                                <Item key="8">option8</Item>
                            </SubMenu> */}
            {/* <SubMenu key="sub3" icon={<NotificationOutlined />} title="Manage Stock">
                                <Item key="9">option9</Item>
                                <Item key="10">option10</Item>
                                <Item key="11">option11</Item>
                                <Item key="12">option12</Item>
                            </SubMenu> */}

            {/* <SubMenu key="sub4" icon={<NotificationOutlined />} title="Reports">
                                <Item key="13">option9</Item>
                                <Item key="14">option10</Item>
                                <Item key="15">option11</Item>
                                <Item key="16">option12</Item>
                            </SubMenu> */}
        </Menu>
    )
}

export default SideMenu