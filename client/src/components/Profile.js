import React from 'react';
import { Dropdown, Menu, message } from 'antd';
import { useHistory } from 'react-router-dom';
import useUser from '../utils/hooks/useUser';
import AvatarText from './AvatarText';
import { DDownIcon } from './SVG_Icons';
import NameCard from './NameCard';
import '../sass/profile.scss'

const Profile = ({ userName = '' }) => {
    const history = useHistory()
    const { setUser } = useUser()

    const handleSelect = ({ key }) => {
        if (key === 'logout') {
            setUser({})
            sessionStorage.clear()
            history.replace('/')
            message.success("Logged out successfully.")
        }
        else if (key === 'cp') {
            history.push('/change-password')
        }
    }

    const menu = (
        <Menu onClick={handleSelect}>
            <Menu.ItemGroup title={<NameCard name={userName} size='large' />}></Menu.ItemGroup>
            <Menu.Divider />
            <Menu.Item key="cp" >
                Change Password
            </Menu.Item>
            <Menu.Item key="logout" >
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown
            arrow
            overlay={menu}
            trigger='click'
            overlayClassName='profile-dropdown'
            getPopupContainer={node => node.parentNode}
        >
            <div className='profile-container'>
                <AvatarText name={userName} />
                <DDownIcon className='down' />
            </div>
        </Dropdown>
    )
}

export default Profile