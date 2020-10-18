import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Form, Row, Col, Input, Card, Button, Checkbox, message } from 'antd'
import image from '../assets/images/login_img.png'
import { QuestionCircleFilled } from '@ant-design/icons';
import { baseUrl } from '../config'
import './login.css'

const Login = (props) => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});


    const loginBtn = () => {
        console.log("vaalue", username, password)
        let errors1 = {};
        if (username == "") errors1.username = "Please enter username";
        if (password == "") errors1.password = "Please enter password"
        setErrors(errors1)
        if (Object.keys(errors1).length == 0) {
            let userData = {
                username, password
            }
            axios.post(baseUrl + '/bibo/login', userData)
                .then(response => {
                    let token = response.data.token;
                    // let userDetails = response.data.userMasters;
                    if (token) {
                        sessionStorage.setItem("token", token)
                        // message.success(response.data)
                        props.history.push('/bibowarehouse');
                    }
                    // else setErrors({ password: "Invalid credentials" })
                    // console.log(response.data);
                })
                .catch(error => {
                    console.log(error)
                });
        }
    }




    // const onFinish = values => {
    //     console.log(values)

    //     // let requsetData = {
    //     //     userName: values.username,
    //     //     password: values.password
    //     // }


    // };

    // const onFinishFailed = errorInfo => {
    //     console.log('Failed:', errorInfo);
    // };

    // console.log('Process.env', process.env.REACT_API_APP_HOST)
    const onInputChange = (value, key) => {
        if (value != "") {
            if (errors.key != "") setErrors({ ...errors, [key]: "" })
        }
        if (key == "username") setUserName(value);
        if (key == "password") setPassword(value)

    }
    return (
        <div className="login_component">
            <Row>
                <Col span={12} className="first_col">
                    <div>
                        <img src={image} alt="contest-cover" />
                        <div className="login_component_text">
                            <h2>Hella narwhal Cosby sweater <br />McSweeney's, salvia kitsch before they <br />sold out High Life.</h2>
                            <p>
                                Takamaru Ayako <br />
                            Manager an inVision
                            </p>
                        </div>
                    </div>
                </Col>
                <Col span={12}>
                    <div className="login_container">
                        <div>
                            <h3><span>&#8592;</span>  <span className="login_bibo_text">Bibo</span> <span>Water</span></h3>
                            {/* <ArrowLeftOutlined /> */}
                        </div>
                        <div>
                            <Card className="login_card">
                                <h4>LOG IN</h4>
                                <Form>
                                    <Form.Item>
                                        <h5>Use ID or E-mail</h5>
                                        <Input placeholder="UserName" value={username} onChange={(e) => onInputChange(e.target.value, "username")} />
                                        <p className="errors">{errors.username}</p>
                                    </Form.Item>
                                    <Form.Item>
                                        <h5>Password</h5>
                                        <Input type="password" placeholder="Password" value={password} onChange={(e) => onInputChange(e.target.value, "password")} />
                                        <p className="errors">{errors.password}</p>
                                    </Form.Item>
                                    <p className="forgotpasswordLink">
                                        <span className="forgotpasswordLinkicon"><QuestionCircleFilled /></span>  <span className="forgotpasswordLinktext"> Forgot Password ?</span>
                                    </p>
                                    <Row>
                                        <Col span={12}>
                                            <Form.Item className="remberCheckbox">
                                                <Checkbox><span className="remembermelabel">Remember me</span></Checkbox>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item>
                                                <Button type="primary" className="login_btn" onClick={() => loginBtn()}>Login</Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </div>
                        <div>
                            <Row className="login_footer">
                                <Col span={12}>
                                    <p>© 2020. Bibo water</p>
                                </Col>
                                <Col span={12}>
                                    <ul className="loginmenu list-inline">
                                        <li>
                                            <p>Privacy Policy</p>
                                        </li>
                                        <li>
                                            <p>Terms of Use</p>
                                        </li>
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

export default Login;