import React, { useState } from "react";
import { Row, Col, Button, Input, Divider, Select, Card } from 'antd';
import { PlusOutlined, MenuOutlined, AppstoreOutlined, FilterOutlined,EllipsisOutlined } from '@ant-design/icons';
import '../css/styles.css'
const { Search } = Input;
const { Option } = Select;
const ManageAccounts = (props) => {
    const onSearch = value => console.log(value);

    return (
        <div>
            <div>
                <Row>
                    <Col span={12}>
                        <h1>Manage Accounts</h1>
                    </Col>
                    <Col span={12}>
                        <Button type="default"><span><PlusOutlined /></span>Create Account</Button>
                    </Col>
                </Row>
            </div>
            <div>
                <Row>
                    <Col span={10}>
                        <Search placeholder="input search text" onSearch={onSearch} style={{ width: '70%' }} />
                    </Col>
                    <Col span={14}>
                        <Row>
                            <Col span={8}>
                                <h3><span> <span> <AppstoreOutlined /> </span><span>Card View</span> </span> <Divider type="vertical" /> <span> <span> <MenuOutlined /> </span><span>List View</span> </span></h3>
                            </Col>
                            <Col span={8}>
                                <Select defaultValue="lucy" style={{ width: 120 }} >
                                    <Option value="jack">Jack</Option>
                                    <Option value="lucy">Lucy</Option>
                                    <Option value="disabled" disabled>
                                        Disabled
                                    </Option>
                                    <Option value="Yiminghe">yiminghe</Option>
                                </Select>
                            </Col>
                            <Col span={8}>
                                <Button type="default"><FilterOutlined /></Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            <div>
                <Row>
                    <Col span={8}>
                        <Card>
                            <div>
                                <p><span> </span> <span> DRAFT </span></p>
                            </div>
                            <div>
                                <h3>Apollo Hospitals</h3>
                                <p>Jubliee Hills, Hyderabad</p>
                            </div>
                            <div>
                                <h4>Contact Person</h4>
                                <p><span></span> <span>Ajay Babu</span></p>
                                <p><span></span> <span>Jhon Jasper</span></p>
                                <p><span></span> <span>Imran Khan</span></p>
                            </div>
                            <div>
                                <h4>Business Type</h4>
                                <p>Health Care</p>
                            </div>
                            <div>
                                <Button type="primary">Manage Account</Button>
                                <EllipsisOutlined />
                            </div>

                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <div>
                                <p><span> </span> <span> DRAFT </span></p>
                            </div>
                            <div>
                                <h3>Apollo Hospitals</h3>
                                <p>Jubliee Hills, Hyderabad</p>
                            </div>
                            <div>
                                <h4>Contact Person</h4>
                                <p><span></span> <span>Ajay Babu</span></p>
                                <p><span></span> <span>Jhon Jasper</span></p>
                                <p><span></span> <span>Imran Khan</span></p>
                            </div>
                            <div>
                                <h4>Business Type</h4>
                                <p>Health Care</p>
                            </div>
                            <div>
                                <Button type="primary">Manage Account</Button>
                                <EllipsisOutlined />
                            </div>

                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <div>
                                <p><span> </span> <span> DRAFT </span></p>
                            </div>
                            <div>
                                <h3>Apollo Hospitals</h3>
                                <p>Jubliee Hills, Hyderabad</p>
                            </div>
                            <div>
                                <h4>Contact Person</h4>
                                <p><span></span> <span>Ajay Babu</span></p>
                                <p><span></span> <span>Jhon Jasper</span></p>
                                <p><span></span> <span>Imran Khan</span></p>
                            </div>
                            <div>
                                <h4>Business Type</h4>
                                <p>Health Care</p>
                            </div>
                            <div>
                                <Button type="primary">Manage Account</Button>
                                <EllipsisOutlined />
                            </div>

                        </Card>
                    </Col>
               
                </Row>
            </div>
        </div>
    );

}
export default ManageAccounts;