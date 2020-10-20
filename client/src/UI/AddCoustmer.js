import React from "react";
import { Row, Col, Button, Select, Form, Input, Checkbox } from 'antd';
import '../css/styles.css'
import FormItem from "antd/lib/form/FormItem";
const { Option } = Select;
const AddCoustmer = (props) => {

    const children = [];
    for (let i = 10; i < 36; i++) {
        children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }

    function handleChange(value) {
        console.log(`selected ${value}`);
    }


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
            <div>
                <Row>
                    <Col span={24}>
                        <Button type="primary">Corporate Customers</Button>
                        <Button type="primary">Other Customers</Button>
                    </Col>
                </Row>
                <Form>
                    <div>
                        <Row>
                            <Col span={10}>
                                <FormItem>
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

                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>

                            </Col>
                            <Col span={10} offset={1}>
                                <FormItem>
                                    <Input placeholder="Basic usage" />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={21}>
                                <FormItem>
                                    <Input placeholder="Basic usage" />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>
                                <Input placeholder="Basic usage" />
                            </Col>
                            <Col span={10} offset={1}>
                                <FormItem>
                                    <Input placeholder="Basic usage" />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>
                                <FormItem>
                                    <Input placeholder="Basic usage" />
                                </FormItem>
                            </Col>
                            <Col span={10} offset={1}>
                                <FormItem>
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
                                    <Input placeholder="Basic usage" />
                                </FormItem>
                            </Col>
                            <Col span={10} offset={1}>
                                <FormItem>
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
                                <Col span={10}>

                                </Col>
                            </Row>
                            <Row>
                                <Col span={21}>
                                    <FormItem>
                                        <Input placeholder="Basic usage" />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={10}>
                                    <FormItem>
                                        <Input placeholder="Basic usage" />
                                    </FormItem>
                                </Col>
                                <Col span={10} offset={1}>
                                    <FormItem>
                                        <Input placeholder="Basic usage" />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={10}>
                                    <FormItem>
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
                                    <FormItem>
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
                    </div>
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