import { Menu } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import useUser from '../../utils/hooks/useUser';
import ConfirmModal from '../../components/CustomModal';
import ConfirmMessage from '../../components/ConfirmMessage';
import { getSideMenuKey, resetTrackForm, getMainPathname } from '../../utils/Functions'
import { MARKETINGADMIN, TRACKFORM, WAREHOUSEADMIN, MOTHERPLANTADMIN, SUPERADMIN, ACCOUNTSADMIN, MARKETINGMANAGER } from '../../utils/constants';
import {
    DashboardIcon, SettingIcon, FriendReqIcon, FriendReqIconLight, DocIconLight, FriendIcon,
    DashboardIconLight, SettingIconLight, ProjectIcon, ProjectIconLight, DocIcon, FriendsIconLight, FriendsIcon,
    FriendIconLight, LocationIcon, LocationIconLight, BlocksIcon, BlocksIconLight, StockIcon, StockIconLight, ReportIcon,
    ReportIconLight, BadgeIcon, BadgeIconLight, RibbonIcon, RibbonIconLight, CheckIcon, CheckIconLight, StackIcon, StackIconLight,
    HomeIcon, HomeIconLight
} from '../../components/SVG_Icons'

const SideMenu = () => {
    const { ROLE } = useUser()
    const history = useHistory()
    const { pathname } = useLocation()
    const [selected, setSelected] = useState('/')
    const [confirm, setConfirm] = useState(false)
    const clickRef = useRef('')

    const mainPathname = getMainPathname(pathname)
    const menu = useMemo(() => getSideMenuKey(pathname), [mainPathname])

    useEffect(() => {
        setSelected(menu)
    }, [menu])

    const handleMenuSelect = ({ key }) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged) {
            clickRef.current = key
            setConfirm(true)
        }
        else history.push(key)
    }

    const handleConfirmCancel = useCallback(() => setConfirm(false), [])
    const handleConfirmOk = useCallback(() => {
        setConfirm(false)
        resetTrackForm()
        history.push(clickRef.current)
    }, [])

    return (
        <>
            <Menu
                id='app-side-menu'
                mode="inline"
                selectedKeys={selected}
                onSelect={handleMenuSelect}
            >
                <Item key='/dashboard' icon={selected === '/dashboard' ? <DashboardIcon /> : <DashboardIconLight />}>
                    <span>Dashboard</span>
                </Item>
                {
                    ROLE === MOTHERPLANTADMIN ?
                        <>
                            <Item key='/manage-production' icon={selected === '/manage-production' ? <StockIcon /> : <StockIconLight />}>
                                Stock Details
                            </Item>
                            <Item key='/manage-return-cans' icon={selected === '/manage-return-cans' ? <ProjectIcon /> : <ProjectIconLight />}>
                                Empty Cans
                            </Item>
                            <Item key='/manage-dispatches' icon={selected === '/manage-dispatches' ? <CheckIcon /> : <CheckIconLight />}>
                                Dispatches
                            </Item>
                            <Item key='/manage-materials' icon={selected === '/manage-materials' ? <RibbonIcon /> : <RibbonIconLight />}>
                                Materials
                            </Item>
                            <Item key='/manage-qc' icon={selected === '/manage-qc' ? <BadgeIcon /> : <BadgeIconLight />}>
                                Quality Control
                            </Item>
                        </>
                        : null
                }
                {
                    ROLE === WAREHOUSEADMIN ?
                        <>
                            <Item key='/manage-stock' icon={selected === '/manage-stock' ? <BlocksIcon /> : <BlocksIconLight />}>
                                Manage Stock
                            </Item>
                            <Item key='/manage-empty-cans' icon={selected === '/manage-empty-cans' ? <ProjectIcon /> : <ProjectIconLight />}>
                                Empty Cans
                            </Item>
                            <Item key='/manage-dispatches' icon={selected === '/manage-dispatches' ? <CheckIcon /> : <CheckIconLight />}>
                                Dispatches
                            </Item>
                            <Item key='/request-stock' icon={selected === '/request-stock' ? <RibbonIcon /> : <RibbonIconLight />}>
                                Stock Request
                            </Item>
                            <Item key='/manage-invoices' icon={selected === '/manage-invoices' ? <DocIcon /> : <DocIconLight />}>
                                Invoices
                            </Item>
                            <Item key='/manage-routes' icon={selected === '/manage-routes' ? <LocationIcon /> : <LocationIconLight />}>
                                Routes
                            </Item>
                            <Item key='/warehouse-staff' icon={selected === '/warehouse-staff' ? <FriendsIcon /> : <FriendsIconLight />}>
                                Staff
                            </Item>
                            <Item key='/reports' style={{ pointerEvents: 'none' }} icon={selected === '/reports' ? <ReportIcon /> : <ReportIconLight />}>
                                Reports
                            </Item>
                            <Item key='/closed-customers' icon={selected === '/closed-customers' ? <FriendIcon /> : <FriendIconLight />}>
                                Closed Customers
                            </Item>
                        </>
                        : null
                }
                {
                    ROLE === MARKETINGADMIN ?
                        <>
                            <Item key='/customers' icon={selected === '/customers' ? <ProjectIcon /> : <ProjectIconLight />}>
                                Customers
                            </Item>
                            <Item key='/add-customer' icon={selected === '/add-customer' ? <FriendReqIcon /> : <FriendReqIconLight />}>
                                Add Customer
                            </Item>
                            <Item key='/visited-customers' icon={selected === '/visited-customers' ? <FriendIcon /> : <FriendIconLight />}>
                                Visited Customers
                            </Item>
                            <Item key='/closed-customers' icon={selected === '/closed-customers' ? <FriendIcon /> : <FriendIconLight />}>
                                Closed Customers
                            </Item>
                            <Item key='/customerDashboard' style={{ pointerEvents: 'none' }} icon={selected === '/customerDashboard' ? <SettingIcon /> : <SettingIconLight />}>
                                Settings
                            </Item>
                        </>
                        : null
                }
                {
                    ROLE === MARKETINGMANAGER ?
                        <>
                            <Item key='/customers' icon={selected === '/customers' ? <ProjectIcon /> : <ProjectIconLight />}>
                                Customers
                            </Item>
                            <Item key='/add-customer' icon={selected === '/add-customer' ? <FriendReqIcon /> : <FriendReqIconLight />}>
                                Add Customer
                            </Item>
                            <Item key='/invoices' icon={selected === '/invoices' ? <DocIcon /> : <DocIconLight />}>
                                Invoices
                            </Item>
                            <Item key='/visited-customers' icon={selected === '/visited-customers' ? <FriendIcon /> : <FriendIconLight />}>
                                Visited Customers
                            </Item>
                            <Item key='/closed-customers' icon={selected === '/closed-customers' ? <FriendIcon /> : <FriendIconLight />}>
                                Closed Customers
                            </Item>
                            <Item key='/customerDashboard' style={{ pointerEvents: 'none' }} icon={selected === '/customerDashboard' ? <SettingIcon /> : <SettingIconLight />}>
                                Settings
                            </Item>
                        </>
                        : null
                }
                {
                    ROLE === SUPERADMIN ?
                        <>
                            <SubMenu icon={<DocIconLight />} title='Add'>
                                <Item key='/customers' icon={selected === '/customers' ? <FriendIcon /> : <FriendIconLight />}>
                                    Customers
                                </Item>
                                <Item key='/products' icon={selected === '/products' ? <FriendsIcon /> : <FriendsIconLight />}>
                                    Products
                                </Item>
                                <Item key='/staff' icon={selected === '/staff' ? <FriendsIcon /> : <FriendsIconLight />}>
                                    Staff
                                </Item>
                                <Item key='/drivers' icon={selected === '/drivers' ? <FriendsIcon /> : <FriendsIconLight />}>
                                    Drivers
                                </Item>
                                <Item key='/distributors' icon={selected === '/distributors' ? <FriendsIcon /> : <FriendsIconLight />}>
                                    Distributors
                                </Item>
                                <Item key='/vendors' icon={selected === '/vendors' ? <FriendsIcon /> : <FriendsIconLight />}>
                                    Vendors
                                </Item>
                                <Item key='/routes' icon={selected === '/routes' ? <LocationIcon /> : <LocationIconLight />}>
                                    Routes
                                </Item>
                                <Item key='/motherplants' icon={selected === '/motherplants' ? <StackIcon /> : <StackIconLight />}>
                                    Mother Plants
                                </Item>
                                <Item key='/warehouses' icon={selected === '/warehouses' ? <HomeIcon /> : <HomeIconLight />}>
                                    Warehouses
                                </Item>
                            </SubMenu>
                            <Item key='/materials' icon={selected === '/materials' ? <RibbonIcon /> : <RibbonIconLight />}>
                                Materials
                            </Item>
                            <Item key='/invoices' icon={selected === '/invoices' ? <DocIcon /> : <DocIconLight />}>
                                Invoices
                            </Item>
                            <Item key='/visited-customers' icon={selected === '/visited-customers' ? <FriendIcon /> : <FriendIconLight />}>
                                Visited Customers
                            </Item>
                            <Item key='/closed-customers' icon={selected === '/closed-customers' ? <DocIcon /> : <DocIconLight />}>
                                Closed Customers
                            </Item>
                            <SubMenu icon={<ReportIconLight />} title='Reports'>
                                <Item key='/new-customers-report' icon={selected === '/new-customers-report' ? <FriendIcon /> : <FriendIconLight />}>
                                    New Customers
                                </Item>
                                <Item key='/closed-customers-report' icon={selected === '/closed-customers-report' ? <FriendIcon /> : <FriendIconLight />}>
                                    Closed Customers
                                </Item>
                                <Item key='/dispensers-viability-report' icon={selected === '/dispensers-viability-report' ? <FriendIcon /> : <FriendIconLight />}>
                                    Dispensers Viability
                                </Item>
                                <Item key='/collection-performance-report' icon={selected === '/collection-performance-report' ? <FriendIcon /> : <FriendIconLight />}>
                                    Collection Performance
                                </Item>
                            </SubMenu>
                            <Item key='/settings' style={{ pointerEvents: 'none' }} icon={selected === '/settings' ? <SettingIcon /> : <SettingIconLight />}>
                                Settings
                            </Item>
                        </>
                        : null
                }
                {
                    ROLE === ACCOUNTSADMIN ?
                        <>
                            <Item key='/customers' icon={selected === '/customers' ? <FriendIcon /> : <FriendIconLight />}>
                                Customers
                            </Item>
                            <Item key='/receipts' icon={selected === '/receipts' ? <DocIcon /> : <DocIconLight />}>
                                Receipts
                            </Item>
                            <Item key='/invoices' icon={selected === '/invoices' ? <DocIcon /> : <DocIconLight />}>
                                Invoices
                            </Item>
                            <Item key='/closed-customers' icon={selected === '/closed-customers' ? <FriendIcon /> : <FriendIconLight />}>
                                Closed Customers
                            </Item>
                            <Item key='/settings' style={{ pointerEvents: 'none' }} icon={selected === '/settings' ? <SettingIcon /> : <SettingIconLight />}>
                                Settings
                            </Item>
                        </>
                        : null
                }
            </Menu>
            <ConfirmModal
                visible={confirm}
                onOk={handleConfirmOk}
                onCancel={handleConfirmCancel}
                title='Are you sure you want to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </ConfirmModal>
        </>
    )
}

const { Item, SubMenu } = Menu
export default SideMenu