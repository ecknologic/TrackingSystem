import axios from 'axios';
import dayjs from 'dayjs';
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Form, Row, Col, Input, Card, Button } from 'antd'
import { http } from '../../modules/http';
import image from '../../assets/images/login_img.png'
import { BiboIcon } from '../../components/SVG_Icons';
import { isEmpty } from '../../utils/Functions';

const ForgotPassword = () => {
    const history = useHistory()
    const [username, setUserName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMailSent, setIsMailSent] = useState(false);
    const [errors, setErrors] = useState({});

    const handleEmailChange = ({ target: { value } }) => {
        if (value.trim()) {
            if (errors.username) {
                setErrors({ username: "" })
            }
        }
        setUserName(value);
    }

    const handleSendLink = async () => {
        const errors = {};
        if (username.trim() === "") {
            errors.username = "Please enter Username or Email";
        }

        if (!isEmpty(errors)) {
            setErrors(errors)
            return;
        }

        const url = 'users/forgotPassword'
        const body = { username }
        try {
            setIsLoading(true)
            await http.PUT(axios, url, body)
            setIsLoading(false)
            setIsMailSent(true)
        } catch (error) {
            if (!axios.isCancel(error)) {
                setIsLoading(false)
                if (error.response.status === 404) {
                    const errors = {};
                    errors.username = "Invalid Username or Email";
                    setErrors(errors)
                }
            }
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
                                isMailSent ? (
                                    <Card className="login_card">
                                        <h4>Check your Email</h4>
                                        <p className='fp-info'>We've sent instructions for resetting your password to <b>{username}</b>.</p>
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
                                        <h4>Trouble Logging In?</h4>
                                        <p className='fp-info'>Enter your email or username and we'll send you a link to get back into your account.</p>
                                        <Form>
                                            <Form.Item>
                                                <h5>Username or Email</h5>
                                                <Input
                                                    placeholder="Username or Email"
                                                    autoFocus
                                                    value={username} onChange={handleEmailChange}
                                                />
                                                <p className="errors">{errors.username}</p>
                                            </Form.Item>
                                            <Row>
                                                <Col span={12}>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item>
                                                        <Button
                                                            type="primary"
                                                            loading={isLoading}
                                                            className="login_btn"
                                                            onClick={handleSendLink}
                                                        >
                                                            {isLoading ? 'Sending' : 'Send'}
                                                        </Button>
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

export default ForgotPassword;