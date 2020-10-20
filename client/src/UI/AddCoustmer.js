import React, { useState } from "react";
import { Row, Col, Button, Select, Form, Input, Checkbox, DatePicker, Space, Upload } from 'antd';
import '../css/styles.css'
import FormItem from "antd/lib/form/FormItem";
import { UploadOutlined } from '@ant-design/icons';
const { Option } = Select;
const AddCoustmer = (props) => {
    const [tab1, setTab1] = useState(true)
    const [tab2, setTab2] = useState(false)
    const children = [];
    for (let i = 10; i < 36; i++) {
        children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }

    const handleChange = (value) => {
        console.log(`selected ${value}`);
    }

    const tabBtn = (type) => {
        if (type == "tabs1") {
            setTab2(false); setTab1(true)
        } else {
            setTab2(true); setTab1(false)
        }
    }
    const onChange = (date, dateString) => {
        console.log(date, dateString);
    }
    const fileList = [
        {
            uid: '-1',
            name: 'xxx.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
            uid: '-2',
            name: 'yyy.png',
            status: 'error',
        },
    ];
    return (
        <div>
            <div className="addcustomerheader">
                <Row>
                    <Col span={20}>
                        <h1><span>Back</span> <span>Create Account</span></h1>
                    </Col>
                    <Col span={4}>
                        <h5>help</h5>
                    </Col>
                </Row>
            </div>
            <div className="addCustomerBody">
                <Row>
                    <Col span={24}>
                        <Button type="primary" className={tab1 ? 'ActivenumTab' : 'normalnumTab'} onClick={() => tabBtn("tabs1")}>Corporate Customers</Button>
                        <Button type="primary" className={tab2 ? 'ActivenumTab' : 'normalnumTab'} onClick={() => tabBtn("tab2")}>Other Customers</Button>
                    </Col>
                </Row>
                <Form>
                    {tab1 ?
                        <div>
                            <Row>
                                <Col span={10}>
                                    <FormItem>
                                        <h5>select id proof</h5>
                                        <Select defaultValue="lucy" style={{ width: '100%' }}>
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="disabled" disabled>
                                                Disabled
                                        </Option>
                                            <Option value="Yiminghe">yiminghe</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={10}>
                                    <FormItem>
                                        <Upload
                                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                            listType="picture"
                                            defaultFileList={[...fileList]}
                                        >
                                            <Button icon={<UploadOutlined />}>Upload</Button>
                                        </Upload>
                                    </FormItem>
                                </Col>
                                <Col span={10}>

                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <div>
                                        <h4>Please help us verify your identity</h4>
                                    </div>
                                    <p>(kindly upload the documents either in JPEG,PNG,PDF format. The file should be lessthan 5MB) Need to be upload front and back.</p>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={10}>
                                    <FormItem>

                                    </FormItem>
                                </Col>
                                <Col span={10} offset={1}>
                                    <FormItem>
                                    <h5>ORGANIZATION NAME</h5>
                                        <Input placeholder="Basic usage" />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={21}>
                                    <FormItem>
                                        <h5>ADDRESS</h5>
                                        <Input placeholder="Basic usage" />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={10}>
                                    <FormItem>
                                        <h5>PHONE NUMBER</h5>
                                        <Input placeholder="Basic usage" />
                                    </FormItem>
                                </Col>
                                <Col span={10} offset={1}>
                                    <FormItem>
                                        <h5>EMAIL</h5>
                                        <Input placeholder="Basic usage" />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={10}>
                                    <FormItem>
                                        <h5>CONTACT PERSON</h5>
                                        <Input placeholder="Basic usage" />
                                    </FormItem>
                                </Col>
                                <Col span={10} offset={1}>
                                    <FormItem>
                                        <h5>NATURE OF BUSINESS</h5>
                                        <Select defaultValue="lucy" style={{ width: '100%' }}>
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="disabled" disabled>
                                                Disabled
                                        </Option>
                                            <Option value="Yiminghe">yiminghe</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={10}>
                                    <FormItem>
                                        <h5>REGISTERED DATE</h5>
                                        <Input placeholder="Basic usage" />
                                    </FormItem>
                                </Col>
                                <Col span={10} offset={1}>
                                    <FormItem>
                                        <h5>INVOICE TYPE</h5>
                                        <Select defaultValue="lucy" style={{ width: '100%' }}>
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="disabled" disabled>
                                                Disabled
                                        </Option>
                                            <Option value="Yiminghe">yiminghe</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={10}>
                                    <FormItem>
                                        <h5>CREDIT PERIOD IN DAYS</h5>
                                        <Select defaultValue="lucy" style={{ width: '100%' }}>
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="disabled" disabled>
                                                Disabled
                                        </Option>
                                            <Option value="Yiminghe">yiminghe</Option>
                                        </Select>
                                    </FormItem>

                                </Col>
                                <Col span={10} offset={1}>
                                    <FormItem>
                                        <h5>REFERED BY</h5>
                                        <Input placeholder="Basic usage" />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem>
                                        <Checkbox>Delivery to same address</Checkbox>
                                    </FormItem>
                                </Col>
                            </Row>
                            <div>
                                <Row>
                                    <Col span={24}>
                                        <h1>Delivery Details</h1>
                                    </Col>

                                </Row>

                                <Row>
                                    <Col span={10}>

                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={21}>
                                        <FormItem>
                                            <h5>ADDRESS</h5>
                                            <Input placeholder="Basic usage" />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={10}>
                                        <FormItem>
                                            <h5>PHONE NUMBER</h5>
                                            <Input placeholder="Basic usage" />
                                        </FormItem>
                                    </Col>
                                    <Col span={10} offset={1}>
                                        <FormItem>
                                            <h5>CONTACT PERSON</h5>
                                            <Input placeholder="Basic usage" />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={10}>
                                        <FormItem>
                                            <h5>PRODUCTS</h5>
                                            <Select
                                                mode="multiple"
                                                allowClear
                                                style={{ width: '100%' }}
                                                placeholder="Please select"
                                                defaultValue={['a10', 'c12']}
                                                onChange={handleChange}
                                            >
                                                {children}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={10} offset={1}>
                                        <FormItem>
                                            <h5>DELIVERY DAYS</h5>
                                            <Select
                                                mode="multiple"
                                                allowClear
                                                style={{ width: '100%' }}
                                                placeholder="Please select"
                                                defaultValue={['a10', 'c12']}
                                                onChange={handleChange}
                                            >
                                                {children}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={10}>
                                        <FormItem >
                                            <h5>PRICE</h5>
                                            <Select defaultValue="lucy" style={{ width: '100%' }}>
                                                <Option value="jack">Jack</Option>
                                                <Option value="lucy">Lucy</Option>
                                                <Option value="disabled" disabled>
                                                    Disabled
                                        </Option>
                                                <Option value="Yiminghe">yiminghe</Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={10} offset={1}>
                                        <FormItem>
                                            <h5>DEPOSIT AMOUNT</h5>
                                            <Select defaultValue="lucy" style={{ width: '100%' }}>
                                                <Option value="jack">Jack</Option>
                                                <Option value="lucy">Lucy</Option>
                                                <Option value="disabled" disabled>
                                                    Disabled
                                        </Option>
                                                <Option value="Yiminghe">yiminghe</Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        </div> :

                        <div>
                            <Row>
                                <Col span={10}>
                                    <FormItem>
                                        <h5>select id proof</h5>
                                        <Select defaultValue="lucy" style={{ width: '100%' }}>
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="disabled" disabled>
                                                Disabled
                                        </Option>
                                            <Option value="Yiminghe">yiminghe</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={10}>
                                    <FormItem>
                                        <Upload
                                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                            listType="picture"
                                            defaultFileList={[...fileList]}
                                        >
                                            <Button icon={<UploadOutlined />}>Upload</Button>
                                        </Upload>
                                    </FormItem>
                                </Col>
                                <Col span={10}>

                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <h4>Please help us verify your identity</h4>
                                    <p>(kindly upload the documents either in JPEG,PNG,PDF format. The file should be lessthan 5MB) Need to be upload front and back.</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={10}>

                                </Col>
                                <Col span={10} offset={1}>
                                    <FormItem>
                                        <h5>NAME</h5>
                                        <Input placeholder="Basic usage" />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={21}>
                                    <FormItem>
                                        <h5>ADDRESS</h5>
                                        <Input placeholder="Basic usage" />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={10}>
                                    <FormItem>
                                        <h5>PHONE NUMBER</h5>
                                        <Input placeholder="Basic usage" />
                                    </FormItem>
                                </Col>
                                <Col span={10} offset={1}>
                                    <FormItem>
                                        <h5>EMAIL</h5>
                                        <Input placeholder="Basic usage" />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={10}>
                                    <FormItem>
                                        <h5>DELIVERY DAYS</h5>
                                        <Select
                                            mode="multiple"
                                            allowClear
                                            style={{ width: '100%' }}
                                            placeholder="Please select"
                                            defaultValue={['a10', 'c12']}
                                            onChange={handleChange}
                                        >
                                            {children}
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={10} offset={1}>
                                    <FormItem>
                                        <h5>REGISTERED DATE</h5>
                                        <DatePicker onChange={onChange} />
                                    </FormItem>

                                </Col>
                            </Row>
                            <Row>
                                <Col span={10}>
                                    <FormItem>
                                        <h5>ADD PRODUCTS</h5>
                                        <Select defaultValue="lucy" style={{ width: '100%' }}>
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="disabled" disabled>
                                                Disabled
                                        </Option>
                                            <Option value="Yiminghe">yiminghe</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={10} offset={1}>
                                    <FormItem>
                                        <h5>DEPOSIT AMOUNT</h5>
                                        <Select defaultValue="lucy" style={{ width: '100%' }}>
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="disabled" disabled>
                                                Disabled
                                        </Option>
                                            <Option value="Yiminghe">yiminghe</Option>
                                        </Select>
                                    </FormItem>
                                </Col>

                            </Row>
                            <Row>
                                <Col span={10}>
                                    <FormItem>
                                        <h5>PHONE NUMBER</h5>
                                        <Input placeholder="Basic usage" />
                                    </FormItem>
                                </Col>
                                <Col span={10} offset={1}>
                                    <FormItem>
                                        <h5>EMAIL</h5>
                                        <Input placeholder="Basic usage" />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={10}>
                                    <FormItem>
                                        <h5>INVOICE TYPE</h5>
                                        <Select defaultValue="lucy" style={{ width: '100%' }}>
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="disabled" disabled>
                                                Disabled
                                        </Option>
                                            <Option value="Yiminghe">yiminghe</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                            </Row>

                        </div>}
                </Form>
            </div>
            <div>
                <Row>
                    <Col span={10}>
                        <Button type="default">CANCEL</Button>
                    </Col>
                    <Col span={10} offset={1}>
                        <Button type="primary">CREATE ACCOUNT</Button>
                    </Col>
                </Row>

            </div>
        </div>
    )
}

export default AddCoustmer;