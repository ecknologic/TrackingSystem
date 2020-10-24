import React, { useEffect } from 'react';
import { Row, Col, Input, Select, Form } from 'antd'
import CustomSelectComponent from '../../components/selectComponent';
const { Option } = Select;
const CreateDCModal = (props) => {
    const { routesInfo, errors, dropDownChange, inputData, inputChange, handleChange, routeId, driverId, driversList, disabled } = props;
    useEffect(() => {

    }, [props])
    const routesOptions = routesInfo.length && routesInfo.map((element, index) => (
        <Option key={index} value={element.RouteId}>{element.RouteName}</Option>
    ))
    return <div>
        <Form>
            <Row>
                <CustomSelectComponent
                    onChange={(e) => dropDownChange(e, 'routeId')}
                    label="Select Route"
                    value={routeId}
                    colSpan={24}
                    options={routesOptions}
                    error={errors.routeId}
                    disabled={disabled}
                />
            </Row>
            <Row>
                <Col span={16} className="padding-right_comp">
                    <Form.Item>
                        <h5 className="form_modal_label">Person / Shop Name</h5>
                        <Input disabled={disabled} placeholder="Add Name" name="personShopName" value={inputData.personShopName} onChange={inputChange} />
                        <p className='errMsg'>{errors.personShopName}</p>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item>
                        <h5 className="form_modal_label">Phone Number</h5>
                        <Input disabled={disabled} placeholder="789 -7700 " name="phoneNumber" value={inputData.phoneNumber} onChange={inputChange} />
                        <p className='errMsg'>{errors.phoneNumber}</p>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Form.Item>
                        <h5 className="form_modal_label">Shop Address</h5>
                        <Input disabled={disabled} placeholder="Add Address" name="shopAddress" value={inputData.shopAddress} onChange={inputChange} />
                        <p className='errMsg'>{errors.shopAddress}</p>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <CustomSelectComponent
                    label="Driver Name"
                    options={driversList}
                    colSpan={24}
                    value={driverId}
                    error={errors.driverId}
                    disabled={disabled}
                    onChange={(e) => handleChange(e, "driverId")}
                />
            </Row>
            <Row>
                <Col span={24}>
                    <h5>Stock Details </h5>
                </Col>
            </Row>
            <Row>
                <Col span={8} className="padding-right_comp">
                    <Form.Item>
                        <h5 className="form_modal_label">20 Ltrs</h5>
                        <Input disabled={disabled} placeholder="1500" name="twentyLiters" value={inputData.twentyLiters} onChange={inputChange} />
                        <p className='errMsg'>{errors.twentyLiters}</p>
                    </Form.Item>
                </Col>
                <Col span={5} className="padding-right_comp">
                    <Form.Item>
                        <h5 className="form_modal_label">1 Ltrs (Box-1x12)</h5>
                        <Input disabled={disabled} placeholder="1500" name="oneLiterBoxes" value={inputData.oneLiterBoxes} onChange={inputChange} />
                        <p className='errMsg'>{errors.oneLiterBoxes}</p>
                    </Form.Item>
                </Col>
                <Col span={6} className="padding-right_comp">
                    <Form.Item>
                        <h5 className="form_modal_label">500 ml (Box-1x12)</h5>
                        <Input disabled={disabled} placeholder="1500" name="fiveMlBoxes" value={inputData.fiveMlBoxes} onChange={inputChange} />
                        <p className='errMsg'>{errors.fiveMlBoxes}</p>
                    </Form.Item>
                </Col>
                <Col span={5}>
                    <Form.Item>
                        <h5 className="form_modal_label">250 ml (Box-1x12)</h5>
                        <Input disabled={disabled} placeholder="1500" name="twoFiveMLBoxes" value={inputData.twoFiveMLBoxes} onChange={inputChange} />
                        <p className='errMsg'>{errors.twoFiveMLBoxes}</p>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    </div>
}
export default CreateDCModal;