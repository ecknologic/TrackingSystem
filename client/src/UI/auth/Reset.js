import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import { Form, Row, Col, Input, Card, Button } from 'antd'
import { http } from '../../modules/http';
import Spinner from '../../components/Spinner';
import { isEmpty } from '../../utils/Functions';
import image from '../../assets/images/login_img.png'
import { BiboIcon, } from '../../components/SVG_Icons';
import { validatePassword } from '../../utils/validations';

const ResetPassword = () => {
    const history = useHistory();
    const { search } = useLocation();
    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [match, setMatch] = useState(false)

    const token = new URLSearchParams(search).get('token');

    useEffect(() => {
        if (token) {
            validateToken(token)
        }
        else history.replace('/forgot-password')
    }, [])

    const validateToken = async (token) => {
        const url = `users/validateToken?token=${token}`

        try {
            await http.GET(axios, url)
            setIsTokenValid(true)
            setIsLoading(false)
        } catch (error) {
            if (!axios.isCancel(error)) {
                if (error.response.status === 400) {
                    setIsTokenValid(false)
                    setIsLoading(false)
                }
                else {
                    history.replace('/forgot-password')
                }
            }
        }
    }

    const handleResetPassword = async () => {
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

        const url = 'users/resetPassword'
        const body = { token, password }
        try {
            await http.PUT(axios, url, body)
            setResetSuccess(true)

        } catch (error) {
            setIsLoading(false)
            if (!axios.isCancel(error)) {
                if (error.response.status === 400) {
                    setIsTokenValid(false)
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
    }

    const goToForgotPassword = () => {
        history.replace('/forgot-password')
    }

    const handleGotIt = () => {
        history.replace('/')
    }

    if (isLoading) {
        return (
            <div className="full_screen_center">
                <Spinner />
                &nbsp;
                <span className='loading'>Checking...</span>
            </div>
        )
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
                                resetSuccess ? (
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
                                )
                                    : isTokenValid ? (
                                        <Card className="login_card">
                                            <h4>Reset Password</h4>
                                            <p className='fp-info'>Create a new password that is at least 8 characters long and has a combination of letters, digits and punctuation marks.</p>
                                            <Form>
                                                <Form.Item>
                                                    <h5>New Password</h5>
                                                    <Input type="password"
                                                        placeholder="New Password"
                                                        value={password}
                                                        autoFocus
                                                        onChange={(e) => onInputChange(e, "password")}
                                                    />
                                                    <p className="error-msg">{errors.password}</p>
                                                </Form.Item>
                                                <Form.Item>
                                                    <h5>Confirm New Password</h5>
                                                    <Input type="password"
                                                        onPressEnter={handleResetPassword}
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
                                                            <Button type="primary" className="login_btn" disabled={!match} onClick={handleResetPassword}>Reset Password</Button>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </Card>
                                    ) : (
                                        <Card className="login_card">
                                            <h4>Oops!</h4>
                                            <p className='fp-info'>The email link you clicked is invalid or has expired. Please make sure you're using the password reset link from the most recent email.</p>
                                            <Button
                                                type="primary"
                                                className="login_btn"
                                                onClick={goToForgotPassword}
                                            >
                                                Forgot Password?
                                            </Button>
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

export default ResetPassword;