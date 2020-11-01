import React, { useEffect } from 'react'
import { Row, Col, Collapse, Button, Checkbox, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CustomSelectComponent from '../../components/selectComponent'
import InputField from '../../components/inputField'
import DeliveryDetailsForm from './DeliveryDetailsForm'
import UploadImage from '../../components/UploadImage'
import './customer.css'
const { Panel } = Collapse;
const FormItem = Form.Item;

const CorporateCustomer = (props) => {
    useEffect(() => {
        console.log('Frrrrr', props)
    }, [props])
    const { dropDownChange, inputData, idProofsList, customImageUpload, errors, frontImage, backImage, gstProof, natureOfBussinessList, invoiceTypeList, deliveryDetails, saveDeliveryDetails,
        callback, deliveryInputChange, currentDelIndex, disabled, inputChange, collapseActiveKey, routesOptions, deliveryDaysList } = props
    return <div>
        <Row>
            <CustomSelectComponent
                onChange={(e) => dropDownChange(e, 'idProofType', 'customerData')}
                label="Select Id Proof"
                value={inputData.idProofType}
                colSpan={10}
                options={idProofsList}
                error={errors.idProofType}
            // disabled={disabled}
            />
        </Row>
        <Row>
            <UploadImage
                onUpload={customImageUpload}
                error={errors.frontImage}
                imageValue={frontImage}
                name='frontImage'
                label='Front side'
                colSpan={3}
            />
            <UploadImage
                onUpload={customImageUpload}
                error={errors.backImage}
                imageValue={backImage}
                name='backImage'
                label='Back side'
                colSpan={3}
            />
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
            {inputData.idProofType == 'Aadhar' ? <InputField colSpan={21} error={errors.adharNo} label="Aadhar NUMBER" disabled={disabled} placeholder="Add Aadhar No" name="adharNo" value={inputData.adharNo} onChange={inputChange} />
                : inputData.idProofType !== '' ? <InputField colSpan={21} error={errors.panNo} label="PAN NUMBER" disabled={disabled} placeholder="Add PAN No" name="panNo" value={inputData.panNo} onChange={inputChange} /> : null
            }
        </Row>
        <Row>
            <Col span={24}>
                <Row>
                    <InputField colSpan={10} error={errors.gstNo} label="GST NUMBER" disabled={disabled} placeholder="Add GST No" name="gstNo" value={inputData.gstNo} onChange={inputChange} />
                    <Col span={2}><Button type="default" style={{ marginTop: "2em" }}>Verify</Button></Col>
                    <UploadImage
                        onUpload={customImageUpload}
                        error={errors.gstProof}
                        imageValue={gstProof}
                        name='gstProof'
                        label='GST Proof'
                        colSpan={3}
                    />
                </Row>
            </Col>
            {/* <InputField offset={1} colSpan={10} error={errors.organizationName} label="ORGANIZATION NAME" disabled={disabled} placeholder="Add organization Name" name="organizationName" value={inputData.organizationName} onChange={inputChange} /> */}
        </Row>
        <InputField colSpan={10} error={errors.organizationName} label="ORGANIZATION NAME" disabled={disabled} placeholder="Add organization Name" name="organizationName" value={inputData.organizationName} onChange={inputChange} />

        <Row>
            <InputField colSpan={21} label="ADDRESS" disabled={disabled} error={errors.address} placeholder="Add Address" name="address" value={inputData.address} onChange={inputChange} />
        </Row>
        <Row>
            <InputField colSpan={10} label="PHONE NUMBER" disabled={disabled} error={errors.phoneNumber} placeholder="Add Phone Number" name="phoneNumber" value={inputData.phoneNumber} onChange={inputChange} />
            <InputField colSpan={10} offset={1} label="EMAIL" disabled={disabled} error={errors.email} placeholder="Add Email" name="email" value={inputData.email} onChange={inputChange} />
        </Row>
        <Row>
            <InputField colSpan={10} label='Account Owner' disabled={disabled} error={errors.customerName} placeholder="Add Owner Name" name="customerName" value={inputData.customerName} onChange={inputChange} />
            <CustomSelectComponent
                onChange={(e) => dropDownChange(e, 'natureOfBussiness', 'customerData')}
                label="NATURE OF BUSINESS"
                value={inputData.natureOfBussiness}
                offset={1}
                colSpan={10}
                options={natureOfBussinessList}
                error={errors.natureOfBussiness}
            // disabled={disabled}
            />
        </Row>
        <Row>
            <InputField colSpan={10} label='REGISTERED DATE' error={errors.registeredDate} disabled={disabled} placeholder="YYYY-MM-DD" name="registeredDate" value={inputData.registeredDate} onChange={inputChange} />
            <CustomSelectComponent
                onChange={(e) => dropDownChange(e, 'invoicetype', 'customerData')}
                label="Select Invoice Type"
                value={inputData.invoicetype}
                colSpan={10}
                offset={1}
                options={invoiceTypeList}
                error={errors.invoicetype}
            // disabled={disabled}
            />
        </Row>
        <Row>
            <InputField colSpan={10} error={errors.creditPeriodInDays} disabled={disabled} label='Credit Period' placeholder="No of days" name="creditPeriodInDays" value={inputData.creditPeriodInDays} onChange={inputChange} />
            <InputField colSpan={10} offset={1} error={errors.referredBy} disabled={disabled} label='REFERED BY' placeholder="Name" name="referredBy" value={inputData.referredBy} onChange={inputChange} />
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
                <Col span={3}>
                    <h1><span>Delivery Details</span></h1>
                </Col>
                {deliveryDetails.length && deliveryDetails.length > 1 ? <Col span={12}>
                    <span><Button type="default" className='addBtn' onClick={() => saveDeliveryDetails(currentDelIndex)}> <span><PlusOutlined /></span> Add New</Button></span>
                </Col> : null}

            </Row>
            {deliveryDetails.length ? deliveryDetails.map((delivery, index) =>
                deliveryDetails.length > 1 && deliveryDetails.length != (index + 1) ? <Collapse onChange={callback} activeKey={[collapseActiveKey]} key={index} accordion>
                    <Panel header={delivery.address} key={String(index)}>
                        <DeliveryDetailsForm
                            // saveDeliveryDetails={saveDeliveryDetails}
                            routesOptions={routesOptions}
                            errors={errors}
                            dropDownChange={dropDownChange}
                            deliveryDaysList={deliveryDaysList}
                            deliveryInputChange={(e) => deliveryInputChange(e, index)}
                            disabled={disabled}
                            delivery={delivery}
                            index={currentDelIndex}
                        />
                    </Panel>
                </Collapse> : <DeliveryDetailsForm
                        routesOptions={routesOptions}
                        // saveDeliveryDetails={saveDeliveryDetails}
                        errors={errors}
                        dropDownChange={dropDownChange}
                        deliveryDaysList={deliveryDaysList}
                        deliveryInputChange={(e) => deliveryInputChange(e, index)}
                        disabled={disabled}
                        delivery={delivery}
                        index={currentDelIndex}
                    />
            ) : null}
            {deliveryDetails.length && deliveryDetails.length == 1 ? <Col span={12}>
                <span><Button type="default" className='addBtn' onClick={() => saveDeliveryDetails(currentDelIndex)}> <span><PlusOutlined /></span> Add New</Button></span>
            </Col> : null}
        </div>
    </div>
}
export default CorporateCustomer;