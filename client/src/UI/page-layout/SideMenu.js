import { Menu } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import { getRole, MARKETINGADMIN, TRACKFORM, WAREHOUSEADMIN, MOTHERPLANTADMIN } from '../../utils/constants';
import { getSideMenuKey, resetTrackForm } from '../../utils/Functions'
import ConfirmModal from '../../components/CustomModal';
import ConfirmMessage from '../../components/ConfirmMessage';
import {
    DashboardIcon, SettingIcon, FriendReqIcon, FriendReqIconLight, DocIconLight,
    DashboardIconLight, SettingIconLight, ProjectIcon, ProjectIconLight, DocIcon, FriendsIconLight, FriendsIcon,
} from '../../components/SVG_Icons'

const SideMenu = () => {
    const ROLE = getRole()
    const { pathname } = useLocation()
    const history = useHistory()
    const [selected, setSelected] = useState('/')
    const [confirm, setConfirm] = useState(false)

    const pattern = /[^\/]*\/[^\/]*/; // regex to match upto second forward slash in url pathname
    const mainPathname = pathname.match(pattern)[0]

    const menu = useMemo(() => getSideMenuKey(pathname), [mainPathname])
    const clickRef = useRef('')

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
            >
                <Item key='/dashboard' onClick={handleMenuSelect}>
                    {selected === '/dashboard' ? <DashboardIcon /> : <DashboardIconLight />}
                    <span>Dashboard</span>
                </Item>
                {
                    ROLE === MOTHERPLANTADMIN ?
                        <>
                            <Item key='/stock-details' onClick={handleMenuSelect}>
                                {selected === '/stock-details' ? <ProjectIcon /> : <ProjectIconLight />}
                                <span>Stock Details</span>
                            </Item>
                            <Item key='/dispatches' onClick={handleMenuSelect}>
                                {selected === '/dispatches' ? <ProjectIcon /> : <ProjectIconLight />}
                                <span>Dispatches</span>
                            </Item>
                            <Item key='/materials' onClick={handleMenuSelect}>
                                {selected === '/materials' ? <ProjectIcon /> : <ProjectIconLight />}
                                <span>Materials</span>
                            </Item>
                            <Item key='/quality-control' onClick={handleMenuSelect}>
                                {selected === '/quality-control' ? <ProjectIcon /> : <ProjectIconLight />}
                                <span>Quality Control</span>
                            </Item>
                        </>
                        : null
                }
                {
                    ROLE === WAREHOUSEADMIN ?
                        <>
                            <Item key='/manage-stock' onClick={handleMenuSelect}>
                                {selected === '/manage-stock' ? <ProjectIcon /> : <ProjectIconLight />}
                                <span>Manage Stock</span>
                            </Item>
                            <Item key='/manage-routes' onClick={handleMenuSelect}>
                                {selected === '/manage-routes' ? <FriendsIcon /> : <FriendsIconLight />}
                                <span>Manage Routes</span>
                            </Item>
                            <Item key='/reports' onClick={handleMenuSelect}>
                                {selected === '/reports' ? <DocIcon /> : <DocIconLight />}
                                <span>Reports</span>
                            </Item>
                        </>
                        : null
                }
                {
                    ROLE === MARKETINGADMIN ?
                        <>
                            <Item key='/manage-accounts' onClick={handleMenuSelect}>
                                {selected === '/manage-accounts' ? <ProjectIcon /> : <ProjectIconLight />}
                                <span>Manage Accounts</span>
                            </Item>
                            <Item key='/add-customer' onClick={handleMenuSelect}>
                                {selected === '/add-customer' ? <FriendReqIcon /> : <FriendReqIconLight />}
                                <span>Add Customer</span>
                            </Item>
                            <Item key='/customerDashboard' onClick={handleMenuSelect}>
                                {selected === '/customerDashboard' ? <SettingIcon /> : <SettingIconLight />}
                                <span>Settings</span>
                            </Item>
                        </>
                        : null
                }
            </Menu>
            <ConfirmModal
                visible={confirm}
                onOk={handleConfirmOk}
                onCancel={handleConfirmCancel}
                title='Are you sure to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </ConfirmModal>
        </>
    )
}

const { Item } = Menu
export default SideMenu