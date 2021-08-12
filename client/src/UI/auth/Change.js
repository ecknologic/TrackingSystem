import axios from 'axios';
import dayjs from 'dayjs';
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Form, Row, Col, Input, Card, Button } from 'antd'
import { http } from '../../modules/http';
import useUser from '../../utils/hooks/useUser';
import { isEmpty } from '../../utils/Functions';
import image from '../../assets/images/login_img.png'
import { BiboIcon, } from '../../components/SVG_Icons';
import { validatePassword } from '../../utils/validations';

const ChangePassword = () => {
    const { USERID: userId } = useUser()
    const history = useHistory();
    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const [password, setPassword] = useState('');
    const [changeSuccess, setChangeSuccess] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [match, setMatch] = useState(false)

    const handleChangePassword = async () => {
        const errors = {};
        if (password.trim() === "") {
            errors.password = "Please enter New Password";
        }
        else if (confirmPassword.trim() === "") {
            errors.confirmPassword = "Please enter Confirm New Password";
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
        try {
            await http.POST(axios, url, body)
            setChangeSuccess(true)

        } catch (error) {
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

    const handleGotIt = () => {
        history.replace('/')
    }

    return (
        <div className="login_component">
            <Row>
                <Col span={12} className="first_col">
                    <div>
                        <img src={image} alt="contest-cover" />
                    </div>
                </Col>
                <Col span={12}>
                    <div className="login_container">
                        <div>
                            <h3><BiboIcon className='app-logo' /></h3>
                        </div>
                        <div>
                            {
                                changeSuccess ? (
                                    <Card className="login_card">
                                        <h4>Success!</h4>
                                        <p className='fp-info'>Your password was successfully changed.</p>
                                        <Button
                                            type="primary"
                                            className="login_btn"
                                            onClick={handleGotIt}
                                        >
                                            Got It
                                        </Button>
                                    </Card>
                                ) : (
                                    <Card className="login_card">
                                        <h4>Change Password</h4>
                                        <p className='fp-info'>Create a new password that is at least 8 characters long and has a combination of letters, digits and punctuation marks.</p>
                                        <Form>
                                            <Form.Item>
                                                <h5>Current Password</h5>
                                                <Input type="password"
                                                    placeholder="Current Password"
                                                    value={currentPassword}
                                                    autoFocus
                                                    onChange={(e) => onInputChange(e, "currentPassword")}
                                                />
                                                <p className="error-msg">{errors.currentPassword}</p>
                                            </Form.Item>
                                            <Form.Item>
                                                <h5>New Password</h5>
                                                <Input type="password"
                                                    placeholder="New Password"
                                                    value={password}
                                                    onChange={(e) => onInputChange(e, "password")}
                                                />
                                                <p className="error-msg">{errors.password}</p>
                                            </Form.Item>
                                            <Form.Item>
                                                <h5>Confirm New Password</h5>
                                                <Input type="password"
                                                    onPressEnter={handleChangePassword}
                                                    placeholder="Confirm New Password"
                                                    value={confirmPassword}
                                                    onChange={(e) => onInputChange(e, "confirmPassword")}
                                                />
                                                {errors.confirmPassword ? <p className="error-msg">{errors.confirmPassword}</p>
                                                    : <p className={match ? 'match' : 'no-match'}>{msg}</p>}
                                            </Form.Item>
                                            <Row>
                                                <Col span={12}>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item>
                                                        <Button type="primary" className="login_btn" disabled={!match} onClick={handleChangePassword}>Change Password</Button>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Card>
                                )
                            }

                        </div>
                        <div>
                            <Row className="login_footer">
                                <Col span={12}>
                                    <p>© {dayjs().year()}. Bibo water</p>
                                </Col>
                                <Col span={12}>
                                    <ul className="loginmenu">
                                        <p>Privacy Policy</p>
                                        <p>Terms of Use</p>
                                    </ul>
                                </Col>

                            </Row>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default ChangePassword;