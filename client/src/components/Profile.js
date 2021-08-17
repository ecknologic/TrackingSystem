import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Dropdown, Menu, message } from 'antd';
import { useHistory } from 'react-router-dom';
import NameCard from './NameCard';
import QuitModal from './CustomModal';
import AvatarText from './AvatarText';
import { http } from '../modules/http';
import { DDownIcon } from './SVG_Icons';
import CPModalForm from './CustomModal';
import useUser from '../utils/hooks/useUser';
import ConfirmMessage from './ConfirmMessage';
import ChangePassword from '../UI/auth/Change';
import { TRACKFORM } from '../utils/constants';
import { validatePassword } from '../utils/validations';
import { isEmpty, resetTrackForm, showToast } from '../utils/Functions';
import '../sass/profile.scss';

const Profile = ({ userName = '' }) => {
    const history = useHistory()
    const { setUser, USERID: userId } = useUser()
    const [CPModal, setCPModal] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [match, setMatch] = useState(false)

    const resetUser = () => {
        setUser({})
        sessionStorage.clear()
        history.replace('/')
    }

    const handleSelect = ({ key }) => {
        if (key === 'logout') {
            resetUser()
            message.success("Logged out successfully.")
        }
        else if (key === 'cp') {
            setCPModal(true)
        }
    }

    const postCP = () => {
        resetUser()
        message.success("You have been logged out. Please login again.")
    }

    const onInputChange = (event, key) => {
        const { target: { value } } = event;
        if (value.trim()) {
            if (errors[key] !== "") {
                setErrors(errors => ({ ...errors, [key]: "" }))
            }
            if (errors.confirmPassword === "Password doesn't meet requirements") {
                setErrors(errors => ({ ...errors, confirmPassword: "" }))
            }
        }
        if (key === "confirmPassword") {
            setConfirmPassword(value);
            if (password.trim() && value.trim()) {
                validateMatch(password, value)
            }
            else setMsg('')
        }
        else if (key === "password") {
            setPassword(value)

            if (confirmPassword.trim() && value.trim()) {
                validateMatch(confirmPassword, value)
            }
            else setMsg('')
        }
        else if (key === "currentPassword") {
            setCurrentPassword(value)
        }
    }

    const handleChangePassword = async () => {
        const errors = {};
        if (currentPassword.trim() === "") {
            errors.currentPassword = "Please enter Current Password";
        }
        else if (password.trim() === "") {
            errors.password = "Please enter New Password";
        }
        else if (confirmPassword.trim() === "") {
            errors.confirmPassword = "Please enter Confirm Password";
        }
        else {
            const err = validatePassword(confirmPassword)

            if (err) {
                (errors.confirmPassword = err)
            }
        }

        if (!isEmpty(errors)) {
            setErrors(errors)
            return;
        }

        const url = 'users/updatePassword'
        const body = { currentPassword, password, userId }
        const options = { item: 'Password', v1Ing: 'Changing', v2: 'changed' }

        try {
            showToast({ ...options, action: 'loading' })
            await http.POST(axios, url, body)
            onModalClose(true)
            showToast(options)
            setTimeout(() => postCP(), 1500)

        } catch (error) {
            message.destroy()
            if (!axios.isCancel(error)) {
                if (error.response.status === 400) {
                    setErrors(errors => ({ ...errors, currentPassword: 'Your password is incorrect' }))
                }
            }
        }
    }

    const validateMatch = (password1, password2) => {
        if (password1 === password2) {
            setMsg('Passwords match ✓')
            setMatch(true)
        }
        else {
            setMsg('Passwords do not match')
            setMatch(false)
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

    const onModalClose = (hasUpdated) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasUpdated) {
            return setConfirmModal(true)
        }
        setCPModal(false)
        setErrors({})
        setMsg('')
        setPassword('')
        setMatch(false)
        setCurrentPassword('')
        setConfirmPassword('')
        resetTrackForm()
    }

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false);
        resetTrackForm()
        onModalClose()
    }, [])
    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])
    const handleModalCancel = useCallback(() => onModalClose(), [])

    return (
        <>
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
            <CPModalForm
                className='app-form-modal'
                visible={CPModal}
                btnDisabled={!match}
                onOk={handleChangePassword}
                onCancel={handleModalCancel}
                title='Change Password'
                okTxt='Change Password'
            >
                <ChangePassword
                    msg={msg}
                    match={match}
                    errors={errors}
                    onChange={onInputChange}
                    onSubmit={handleChangePassword}
                    data={{ password, currentPassword, confirmPassword }}
                />
            </CPModalForm>
            <QuitModal
                visible={confirmModal}
                onOk={handleConfirmModalOk}
                onCancel={handleConfirmModalCancel}
                title='Are you sure you want to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </QuitModal>
        </>
    )
}

export default Profile