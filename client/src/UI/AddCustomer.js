import React, { useState, useEffect } from "react";
import { Row, Col, Button, Select, Form, Input, Checkbox, DatePicker, Collapse, message, Modal } from 'antd';
import '../css/styles.css'
import LayoutPage from '../UI/Layout';
import CustomSelectComponent from '../components/selectComponent'
import { PlusOutlined } from '@ant-design/icons';
import { createOrUpdateAPI, getAPI } from "../utils/apis";
import { getBase64 } from '../utils/Functions'
import UploadImage from '../components/UploadImage';
import InputField from '../components/inputField';
import { WAREHOUSEID, USERID, USERNAME, TODAYDATE } from '../utils/constants'
const { Option } = Select;
const FormItem = Form.Item;
const { Panel } = Collapse;

const AddCustomer = (props) => {
    const [visible, setVisible] = useState(false)
    const [corpCustomer, setCorpCustomer] = useState(true)
    const [otherCustomer, setOtherCustomer] = useState(false)
    const [errors, setErrors] = useState({})
    const [disabled, setDisabled] = useState(false)
    const [inputData, setInputData] = useState({ registeredDate: TODAYDATE, referredBy: USERNAME })
    const [routesInfo, setRoutesInfo] = useState([]);
    // const [deliveryData, setDeliveryData] = useState([]);
    const [frontImage, setFrontImage] = useState('')
    const [backImage, setBackImage] = useState('')
    const idProofs = ["Aadhar", 'Pan']
    const invoiceTypes = ["Non-Complementary", 'Complementary'];
    const natureOfBussiness = ['Residential', 'Software', 'Corporate', 'Traders']
    const products = [{
        productName: '20L',
        productPrice: 0,
        noOfJarsTobePlaced: 0
    }, {
        productName: '1L',
        productPrice: 0,
        noOfJarsTobePlaced: 0
    }, {
        productName: '500ML',
        productPrice: 0,
        noOfJarsTobePlaced: 0
    }, {
        productName: '250ML',
        productPrice: 0,
        noOfJarsTobePlaced: 0
    }]
    const [deliveryDetails, setDeliveryDetails] = useState([{ products }])
    const [deliveryInputData, setDeliveryInputData] = useState({ products })
    const [deliveryDays, setDeliveryDays] = useState({
        "SUN": 0,
        "MON": 0,
        "TUE": 0,
        "WED": 0,
        "THU": 0,
        "FRI": 0,
        "SAT": 0
    })
    const [collapseActiveKey, setCollapseActiveKey] = useState('0')
    const children = [];
    for (let i = 10; i < 36; i++) {
        children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }
    useEffect(() => {
        getRoutes();
    }, []);
    const callback = (key) => {
        setCollapseActiveKey(key)
    }
    const getRoutes = () => {
        getAPI('/warehouse/getroutes')
            .then(response => {
                setRoutesInfo(response);
            })
            .catch(error => {
                message.error("Error in getting routes", error)
                console.log(error)
            });
    }


    const customImageUpload = (file, name) => {
        getBase64(file, async (BitImageUrl) => {
            if (name == 'frontImage') setFrontImage(BitImageUrl)
            else setBackImage(BitImageUrl)
        })
    }
    const handleChange = (value) => {
        console.log(`selected ${value}`);
    }

    const onTabChange = (type) => {
        if (type == "corpCustomer") {
            setOtherCustomer(false); setCorpCustomer(true)
        } else {
            setOtherCustomer(true); setCorpCustomer(false)
        }
    }
    const onChange = (date, dateString) => {
        console.log(date, dateString);
    }
    const inputChange = (e) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value })
    }
    const dropDownChange = (e, name, state) => {
        if (state == 'customerData') setInputData({ ...inputData, [name]: e })
        else if (name == 'deliveryDays') {
            let obj = {}
            Object.entries(deliveryDays).map(([key]) => {
                if (e.includes(key)) obj[`${key}`] = 1
                else obj[`${key}`] = 0
            })
            setDeliveryDays(obj)
        }
        else setDeliveryInputData({ ...deliveryInputData, [name]: e })
    }
    const deliveryInputChange = (e, productName, index) => {
        // console.log('eee', e)
        // if (productName) {
        //     let deliveryProducts = deliveryInputData.products
        //     if (deliveryProducts[index].productName == productName) {
        //         deliveryProducts[index][e.target.name] = e.target.value
        //         setDeliveryInputData({ ...deliveryInputData, products: deliveryProducts })
        //     }
        // }
        // else 
        setDeliveryInputData({ ...deliveryInputData, [e.target.name]: e.target.value })
    }
    const saveDeliveryDetails = (index) => {
        let arr = deliveryDetails;
        arr[index] = deliveryInputData
        arr[index].deliveryDays = deliveryDays
        arr[index].products = [{
            productName: '20L',
            productPrice: parseInt(deliveryInputData.price20L),
            noOfJarsTobePlaced: parseInt(deliveryInputData.quantity20L)
        }, {
            productName: '1L',
            productPrice: parseInt(deliveryInputData.price1L),
            noOfJarsTobePlaced: parseInt(deliveryInputData.quantity1L)
        }, {
            productName: '500ML',
            productPrice: parseInt(deliveryInputData.price500ML),
            noOfJarsTobePlaced: parseInt(deliveryInputData.quantity500ML)
        }, {
            productName: '250ML',
            productPrice: parseInt(deliveryInputData.price250ML),
            noOfJarsTobePlaced: parseInt(deliveryInputData.quantity250ML)
        }]
        // localStorage.setItem('deliveryDetails', JSON.stringify(deliveryDetails))
        // console.log("gdgdgdgdgdg", arr)
        message.success('Delivery details Saved successfully')
        setDeliveryDetails(arr)
    }
    const saveOrUpdate = () => {
        let obj = {
            customertype: corpCustomer ? "Corporate" : 'Others',
            organizationName: inputData.organizationName,
            customerName: inputData.customerName,
            idProofs: [frontImage, backImage],
            idProofType: inputData.idProofType,
            gstNo: inputData.gstNo,
            Address1: inputData.address,
            EmailId: inputData.email,
            mobileNumber: inputData.phoneNumber,
            panNo: inputData.panNo,
            adharNo: inputData.adharNo,
            // contactperson: inputData.contactPerson,
            creditPeriodInDays: inputData.creditPeriodInDays,
            invoicetype: inputData.invoicetype,
            referredBy: inputData.referredBy,
            natureOfBussiness: inputData.natureOfBussiness,
            isActive: 0,
            departmentId: WAREHOUSEID,
            registeredDate: inputData.registeredDate,
            createdBy: USERID,
            deliveryDetails,
            // deliveryDaysId: 1,
            // depositamount: 10,
            // shippingAddress: '',
            // shippingContactPerson: '',
            // shippingContactNo: 222
        }
        console.log('Obj', obj)
        createOrUpdateAPI('customer/createCustomer', obj, 'POST').then(res => {
            console.log("res", res)
            message.success(res.message)
        })
    }
    const idProofsList = idProofs.length && idProofs.map(item => <Option key={item} value={item}>{item}</Option>)
    const natureOfBussinessList = natureOfBussiness.length && natureOfBussiness.map(item => <Option key={item} value={item}>{item}</Option>)
    const invoiceTypeList = invoiceTypes.length && invoiceTypes.map(item => <Option key={item} value={item}>{item}</Option>)
    const deliveryDaysList = Object.entries(deliveryDays).map(([key, value]) => <Option key={key} value={key}>{key}</Option>)
    const routesOptions = routesInfo.length && routesInfo.map((element, index) => (
        <Option key={index} value={element.RouteId}>{element.RouteName}</Option>
    ))
    return (
        <div>
            <LayoutPage>
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
                            <Button type="primary" className={corpCustomer ? 'ActivenumTab' : 'normalnumTab'} onClick={() => onTabChange("corpCustomer")}>Corporate Customers</Button>
                            <Button type="primary" className={otherCustomer ? 'ActivenumTab' : 'normalnumTab'} onClick={() => onTabChange("otherCustomer")}>Other Customers</Button>
                        </Col>
                    </Row>
                    <Form>
                        {corpCustomer ?
                            <div>
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
                                        colSpan={3}
                                    />
                                    <UploadImage
                                        onUpload={customImageUpload}
                                        error={errors.backImage}
                                        imageValue={backImage}
                                        name='backImage'
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
                                    <Col span={10}>
                                        <Row>
                                            <InputField colSpan={21} error={errors.gstNo} label="GST NUMBER" disabled={disabled} placeholder="Add GST No" name="gstNo" value={inputData.gstNo} onChange={inputChange} />
                                            <Col span={2}><Button type="default" style={{ marginTop: "2em" }}>Verify</Button></Col>
                                        </Row>
                                    </Col>
                                    <InputField offset={1} colSpan={10} error={errors.organizationName} label="ORGANIZATION NAME" disabled={disabled} placeholder="Add organization Name" name="organizationName" value={inputData.organizationName} onChange={inputChange} />
                                </Row>
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
                                        <Col span={24}>
                                            <h1><span>Delivery Details</span> <span> <Button type="default" onClick={() => setDeliveryDetails([...deliveryDetails, ''])}> <span><PlusOutlined /></span> Add New</Button></span></h1>
                                        </Col>

                                    </Row>
                                    {deliveryDetails.length ? deliveryDetails.map((delivery, i) =>
                                        <Collapse onChange={callback} activeKey={[collapseActiveKey]} key={i} accordion>
                                            <Panel header={"Delivery details"} key={String(i)}>
                                                <Row>
                                                    <InputField colSpan={10} label='GST NO' disabled={disabled} placeholder="GST No" name="gstNo" value={delivery.gstNo} onChange={deliveryInputChange} />
                                                </Row>
                                                <Row>
                                                    <InputField colSpan={10} label='DELIVERY LOCATION' disabled={disabled} placeholder="Add Delivery Location" name="address" value={delivery.address} onChange={deliveryInputChange} />
                                                    <CustomSelectComponent
                                                        onChange={(e) => dropDownChange(e, 'routingId')}
                                                        label="Select Route"
                                                        offset={1}
                                                        value={delivery.routingId}
                                                        colSpan={10}
                                                        options={routesOptions}
                                                        error={errors.routingId}
                                                        disabled={disabled}
                                                    />
                                                </Row>
                                                <Row>
                                                    <InputField colSpan={21} label='ADDRESS' disabled={disabled} placeholder="Add Address" name="address" value={delivery.address} onChange={deliveryInputChange} />
                                                </Row>
                                                <Row>
                                                    <InputField colSpan={10} label='PHONE NUMBER' disabled={disabled} placeholder="Add Phone Number" name="phoneNumber" value={delivery.phoneNumber} onChange={deliveryInputChange} />
                                                    <InputField colSpan={10} offset={1} label='CONTACT PERSON' disabled={disabled} placeholder="Contact Person Name" name="contactPerson" value={delivery.contactPerson} onChange={deliveryInputChange} />
                                                </Row>
                                                <Row>
                                                    {/* {delivery.products.length && delivery.products.map((product, productIndex) =>
                                                        <Col span={2}>
                                                            <InputField colSpan={12} label={product.productName} disabled={disabled} placeholder="Add" name={product.noOfJarsTobePlaced} value={product.noOfJarsTobePlaced} onChange={(e) => deliveryInputChange(e, product.productName, productIndex)} />
                                                            <InputField colSpan={12} className='priceInput' label='PRICE' disabled={disabled} placeholder="Rs" name={product.productPrice} value={product.productPrice} onChange={(e) => deliveryInputChange(e, product.productName, productIndex)} />
                                                        </Col>
                                                    )} */}
                                                    <InputField colSpan={2} label='20LTRS' disabled={disabled} placeholder="Add" name="quantity20L" value={delivery.quantity20L} onChange={deliveryInputChange} />
                                                    <InputField colSpan={2} className='priceInput' label='PRICE' disabled={disabled} placeholder="Rs" name="price20L" value={delivery.price20L} onChange={deliveryInputChange} />
                                                    <InputField colSpan={2} offset={1} label='1LTR' disabled={disabled} placeholder="Add" name="quantity1L" value={delivery.quantity1L} onChange={deliveryInputChange} />
                                                    <InputField colSpan={2} className='priceInput' label='PRICE' disabled={disabled} placeholder="Rs" name="price1L" value={delivery.price1ML} onChange={deliveryInputChange} />
                                                    <InputField colSpan={2} offset={1} label='500ML' disabled={disabled} placeholder="Add" name="quantity500ML" value={delivery.quantity500ML} onChange={deliveryInputChange} />
                                                    <InputField colSpan={2} className='priceInput' label='PRICE' disabled={disabled} placeholder="Rs" name="price500ML" value={delivery.price500ML} onChange={deliveryInputChange} />
                                                    <InputField colSpan={2} offset={1} label='250ML' disabled={disabled} placeholder="Add" name="quantity250ML" value={delivery.quantity250ML} onChange={deliveryInputChange} />
                                                    <InputField colSpan={2} className='priceInput' label='PRICE' disabled={disabled} placeholder="Rs" name="price250ML" value={delivery.price250ML} onChange={deliveryInputChange} />
                                                </Row>
                                                <Row>
                                                    <CustomSelectComponent
                                                        onChange={(e) => dropDownChange(e, 'deliveryDays')}
                                                        label="DELIVERY DAYS"
                                                        mode="multiple"
                                                        value={delivery.deliveryDays}
                                                        colSpan={10}
                                                        options={deliveryDaysList}
                                                        error={errors.deliveryDays}
                                                        disabled={disabled}
                                                    />
                                                    <InputField colSpan={10} offset={1} label='DEPOSIT AMOUNT' disabled={disabled} placeholder="Amount" name="depositAmount" value={delivery.depositAmount} onChange={deliveryInputChange} />

                                                </Row>
                                                <Button onClick={() => saveDeliveryDetails(i)}>Save Details</Button>
                                            </Panel>
                                        </Collapse>
                                    ) : null}
                                </div>
                            </div> :

                            <div>
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
                                        colSpan={3}
                                    />
                                    <UploadImage
                                        onUpload={customImageUpload}
                                        error={errors.backImage}
                                        imageValue={backImage}
                                        name='backImage'
                                        colSpan={3}
                                    />
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <h4>Please help us verify your identity</h4>
                                        <p>(kindly upload the documents either in JPEG,PNG,PDF format. The file should be lessthan 5MB) Need to be upload front and back.</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <InputField colSpan={10} error={errors.gstNo} label="GST NUMBER" disabled={disabled} placeholder="Add GST No" name="gstNo" value={inputData.gstNo} onChange={inputChange} /><Button type="default">Verify</Button>
                                    <InputField offset={1} colSpan={10} error={errors.organizationName} label="NAME" disabled={disabled} placeholder="Add organization Name" name="organizationName" value={inputData.organizationName} onChange={inputChange} />
                                </Row>
                                <Row>
                                    <InputField colSpan={21} label="ADDRESS" disabled={disabled} error={errors.address} placeholder="Add Address" name="address" value={inputData.address} onChange={inputChange} />
                                </Row>
                                <Row>
                                    <InputField colSpan={10} label="PHONE NUMBER" disabled={disabled} error={errors.phoneNumber} placeholder="Add Phone Number" name="phoneNumber" value={inputData.phoneNumber} onChange={inputChange} />
                                    <InputField colSpan={10} offset={1} label="EMAIL" disabled={disabled} error={errors.email} placeholder="Add Email" name="email" value={inputData.email} onChange={inputChange} />
                                </Row>
                                <Row>
                                    <Col span={10}>
                                        <FormItem>
                                            <h5 className="form_modal_label">DELIVERY DAYS</h5>
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
                                            <h5 className="form_modal_label">REGISTERED DATE</h5>
                                            <DatePicker onChange={onChange} />
                                        </FormItem>

                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={10}>
                                        <FormItem>
                                            <h5 className="form_modal_label">ADD PRODUCTS</h5>
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
                                            <h5 className="form_modal_label">DEPOSIT AMOUNT</h5>
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
                                            <h5 className="form_modal_label">PHONE NUMBER</h5>
                                            <Input disabled={disabled} placeholder="Add organization Name" name="organizationName" value={inputData.organizationName} onChange={inputChange} />
                                        </FormItem>
                                    </Col>
                                    <Col span={10} offset={1}>
                                        <FormItem>
                                            <h5 className="form_modal_label">EMAIL</h5>
                                            <Input disabled={disabled} placeholder="Add organization Name" name="organizationName" value={inputData.organizationName} onChange={inputChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={10}>
                                        <FormItem>
                                            <h5 className="form_modal_label">INVOICE TYPE</h5>
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
                <div className="addcustomerfooter">
                    <Row>
                        <Col span={10}>
                            <Button type="default">CANCEL</Button>
                        </Col>
                        <Col span={10} offset={1}>
                            <Button type="primary" onClick={() => saveOrUpdate()}>CREATE ACCOUNT</Button>
                        </Col>
                    </Row>

                </div>
                <div>
                    <Modal
                        title="Basic Modal"
                        visible={visible}
                        onOk={() => { setVisible(false) }}
                        onCancel={() => { setVisible(false) }}
                    >
                        <h1>sucessfully done</h1>
                    </Modal>
                </div>
            </LayoutPage >
        </div >
    )
}

export default AddCustomer;