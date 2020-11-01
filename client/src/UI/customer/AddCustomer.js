import React, { useState, useEffect } from "react";
import { Row, Col, Button, Select, Form, Input, Checkbox, DatePicker, Collapse, message, Modal } from 'antd';
import '../../css/styles.css'
import LayoutPage from '../Layout';
import { createOrUpdateAPI, getAPI } from "../../utils/apis";
import { getBase64 } from '../../utils/Functions'
import { WAREHOUSEID, USERID, USERNAME, TODAYDATE } from '../../utils/constants'
import CorporateCustomerForm from './CorporateCustomerForm'
import OtherCustomerForm from "./OtherCustomerForm";
const { Option } = Select;

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
    const [gstProof, setGstProof] = useState('')
    const [currentDelIndex, setCurrentDelIndex] = useState(0)
    const idProofs = ["Aadhar", 'Pan', 'Driving License', 'Passport']
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
    const days = {
        "SUN": 0,
        "MON": 0,
        "TUE": 0,
        "WED": 0,
        "THU": 0,
        "FRI": 0,
        "SAT": 0
    }
    const [deliveryDetails, setDeliveryDetails] = useState([{}])
    const [deliveryInputData, setDeliveryInputData] = useState({ products })
    const [deliveryDays, setDeliveryDays] = useState(days)
    const [collapseActiveKey, setCollapseActiveKey] = useState('0')

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
    }


    const customImageUpload = (file, name) => {
        getBase64(file, async (BitImageUrl) => {
            if (name == 'frontImage') setFrontImage(BitImageUrl)
            else if (name == 'gstProof') setGstProof(BitImageUrl)
            else setBackImage(BitImageUrl)
        })
    }

    const onTabChange = (type) => {
        if (type == "corpCustomer") {
            setOtherCustomer(false); setCorpCustomer(true)
            setDeliveryDetails([{}])
            setDeliveryInputData({ products })
            setInputData({ registeredDate: TODAYDATE, referredBy: USERNAME })
        } else {
            setOtherCustomer(true); setCorpCustomer(false)
            setDeliveryDetails([{}])
            setDeliveryInputData({ products })
            setInputData({ registeredDate: TODAYDATE, referredBy: USERNAME })
        }
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
            let arr = deliveryDetails
            arr[currentDelIndex].deliveryDays = obj
            setDeliveryDetails(arr)
            setDeliveryDays(obj)
        }
        else setDeliveryInputData({ ...deliveryInputData, [name]: e })
    }
    const deliveryInputChange = (e, index) => {
        // console.log('eee', e)
        // if (productName) {
        //     let deliveryProducts = deliveryInputData.products
        //     if (deliveryProducts[index].productName == productName) {
        //         deliveryProducts[index][e.target.name] = e.target.value
        //         setDeliveryInputData({ ...deliveryInputData, products: deliveryProducts })
        //     }
        // }
        // else 
        if (index) setCurrentDelIndex(index)
        setDeliveryInputData({ ...deliveryInputData, [e.target.name]: e.target.value })
    }
    const saveDeliveryDetails = (index, create) => {
        let arr = deliveryDetails;
        arr[index] = deliveryInputData
        arr[index].deliveryDays = deliveryDays
        if (!corpCustomer) arr[index].address = inputData.address
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
        setDeliveryDays(days)
        if (create) { setDeliveryDetails(arr); saveOrUpdate() }
        else setDeliveryDetails([...arr, ''])
    }
    const saveOrUpdate = () => {
        let obj = {
            customertype: corpCustomer ? "Corporate" : 'Others',
            organizationName: inputData.organizationName,
            customerName: inputData.customerName,
            idProofs: [frontImage, backImage],
            idProofType: inputData.idProofType,
            gstNo: inputData.gstNo,
            gstProof: gstProof,
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
        // console.log('Obj', obj)
        createOrUpdateAPI('customer/createCustomer', obj, 'POST').then(res => {
            setVisible(true)
        })
    }
    const idProofsList = idProofs.length && idProofs.map(item => <Option key={item} value={item}>{item}</Option>)
    const natureOfBussinessList = natureOfBussiness.length && natureOfBussiness.map(item => <Option key={item} value={item}>{item}</Option>)
    const invoiceTypeList = invoiceTypes.length && invoiceTypes.map(item => <Option key={item} value={item}>{item}</Option>)
    const deliveryDaysList = Object.entries(days).map(([key, value]) => <Option key={key} value={key}>{key}</Option>)
    const routesOptions = routesInfo.length && routesInfo.map((element, index) => (
        <Option key={index} value={element.RouteId}>{element.RouteName}</Option>
    ))
    return (
        <div>
            <LayoutPage>
                <div className="addcustomerheader">
                    <Row>
                        <Col span={2}>
                            <span className='backBtn'>Back</span>
                        </Col>
                        <Col span={15}>
                            <span className='create-account'>Create Account</span>
                        </Col>
                        <Col span={4}>
                            <h5>help</h5>
                        </Col>
                    </Row>
                </div>
                <div className="addCustomerBody">
                    <Row>
                        <Col span={24}>
                            <Button type="primary" className={corpCustomer ? 'ActivenumTab' : 'normalnumTab'} onClick={() => onTabChange("corpCustomer")}>Create Account for Business Users</Button>
                            <Button type="primary" className={otherCustomer ? 'ActivenumTab' : 'normalnumTab'} onClick={() => onTabChange("otherCustomer")}>Account for Other Users</Button>
                        </Col>
                    </Row>
                    <Form>
                        {corpCustomer ?
                            <CorporateCustomerForm
                                dropDownChange={dropDownChange}
                                inputData={inputData} idProofsList={idProofsList} customImageUpload={customImageUpload}
                                errors={errors} frontImage={frontImage} backImage={backImage} gstProof={gstProof}
                                natureOfBussinessList={natureOfBussinessList} invoiceTypeList={invoiceTypeList} deliveryDetails={deliveryDetails}
                                saveDeliveryDetails={saveDeliveryDetails} setDeliveryDetails={setDeliveryDetails} callback={callback} deliveryInputChange={deliveryInputChange}
                                currentDelIndex={currentDelIndex} disabled={disabled} inputChange={inputChange} collapseActiveKey={collapseActiveKey} routesOptions={routesOptions} deliveryDaysList={deliveryDaysList} /> :
                            <OtherCustomerForm
                                dropDownChange={dropDownChange}
                                inputData={inputData} idProofsList={idProofsList} customImageUpload={customImageUpload}
                                errors={errors} frontImage={frontImage} backImage={backImage} gstProof={gstProof}
                                invoiceTypeList={invoiceTypeList} deliveryDetails={deliveryDetails}
                                saveDeliveryDetails={saveDeliveryDetails} setDeliveryDetails={setDeliveryDetails} deliveryInputChange={deliveryInputChange}
                                disabled={disabled} inputChange={inputChange} routesOptions={routesOptions} deliveryDaysList={deliveryDaysList}
                            />}
                    </Form>
                </div>
                <div className="addcustomerfooter">
                    <Row>
                        <Col className="left-align">
                            <Button type="default">CANCEL</Button>
                        </Col>
                        <Col span={4} className="right-align">
                            <Button type="primary" onClick={() => saveDeliveryDetails(currentDelIndex, 'create')}>CREATE ACCOUNT</Button>
                        </Col>
                    </Row>

                </div>
                <div>
                    <Modal
                        title="Account Confirmation"
                        visible={visible}
                        onOk={() => { setVisible(false) }}
                        onCancel={() => { setVisible(false) }}
                        footer={<Row>
                            <Col className="left-align">
                                <Button className='cancelBtn' onClick={() => setVisible(false)}>Cancel</Button>
                            </Col>
                            <Col className="right-align">
                                <Button className='confirmBtn'>Continue</Button>
                            </Col>
                        </Row>}
                    >
                        <div className='successmodal' style={{ textAlign: 'center' }}>
                            <h1>Done!</h1>
                            <p>You have successfully added a Business customer account for</p>
                            <h1>{inputData.customerName}</h1>
                        </div>
                    </Modal>
                </div>
            </LayoutPage >
        </div >
    )
}

export default AddCustomer;